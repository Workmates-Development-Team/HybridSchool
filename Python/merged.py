from flask import Flask, request, jsonify
from flask_cors import CORS

from pymongo import MongoClient

from langchain_community.llms import Bedrock
from langchain_community.chat_models import BedrockChat
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import BedrockEmbeddings
from langchain.vectorstores import FAISS
from langchain.indexes import VectorstoreIndexCreator

import uuid
import random
import time
import base64
import pandas as pd
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

app = Flask(__name__)
CORS(app)

# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')
db = client['edtech']
collection = db['notes']

sessions = {}  # Dictionary to store conversation instances by session number
pdf_index = None  # Global variable to hold the PDF index
llm = None  # Global variable to hold the HR LLM model




# Web crawling part

def get_soup(url):
    try:
        page = requests.get(url)
        if page.status_code == 200:
            return BeautifulSoup(page.content, 'html.parser')
        else:
            print(f'The url {url} returned a status of {page.status_code}')
            return None
    except requests.RequestException as e:
        print(f"Request failed for {url}: {e}")
        return None

def get_all_links(soup, base_url):
    links = set()
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        full_url = urljoin(base_url, href)
        if urlparse(base_url).netloc == urlparse(full_url).netloc:
            links.add(full_url)
    return links

def crawl_website(base_url, max_depth=1):
    visited_urls = set()
    content_list = []

    def crawl(url, depth):
        if depth > max_depth or url in visited_urls:
            return
        print(f"Crawling: {url} (Depth: {depth})")
        visited_urls.add(url)
        soup = get_soup(url)
        if soup is None:
            return
        page_content = soup.get_text(separator=' ', strip=True)
        content_list.append((url, page_content))
        links = get_all_links(soup, base_url)
        for link in links:
            crawl(link, depth + 1)
        time.sleep(1)

    crawl(base_url, 0)
    content_df = pd.DataFrame(content_list, columns=['URL', 'Content'])
    return content_df

def save_scraped_content_to_mongodb(base_url, max_depth=2):
    content_df = crawl_website(base_url, max_depth)
    content_dict = content_df.to_dict(orient='records')
    document = {
        'url': base_url,
        'max_depth': max_depth,
        'content': content_dict,
        'timestamp': time.time()
    }
    collection.insert_one(document)
    return document['_id']




# Bedrock Chat part 

random_max_tokens = random.randint(500, 9999)
llm = BedrockChat(
    credentials_profile_name="default",
    provider="anthropic",
    model_id="anthropic.claude-3-haiku-20240307-v1:0",
    model_kwargs={"temperature": 1, "max_tokens": random_max_tokens, "top_p": 1.0},
    streaming=True,
)






# PDF part 

# def initialize_pdf_index(pdf_path):
#     global pdf_index
#     if pdf_index is None:
#         data_load = PyPDFLoader(pdf_path)
#         data_split = RecursiveCharacterTextSplitter(separators=["\n\n", "\n", " ", ""])
#         data_embeddings = BedrockEmbeddings(
#             credentials_profile_name='default',
#             model_id='amazon.titan-embed-text-v1'
#         )
#         data_index = VectorstoreIndexCreator(
#             text_splitter=data_split,
#             embedding=data_embeddings,
#             vectorstore_cls=FAISS
#         )
#         pdf_index = data_index.from_loaders([data_load])

def initialize_pdf_index(pdf_path):
    global pdf_index
    # Always create a new index for the new PDF file
    data_load = PyPDFLoader(pdf_path)
    data_split = RecursiveCharacterTextSplitter(separators=["\n\n", "\n", " ", ""])
    data_embeddings = BedrockEmbeddings(
        credentials_profile_name='default',
        model_id='amazon.titan-embed-text-v1'
    )
    data_index = VectorstoreIndexCreator(
        text_splitter=data_split,
        embedding=data_embeddings,
        vectorstore_cls=FAISS
    )
    pdf_index = data_index.from_loaders([data_load])


def initialize_hr_llm():
    global llm
    if llm is None:
        llm = Bedrock(
            credentials_profile_name='default',
            model_id='anthropic.claude-v2',
            model_kwargs={
                "max_tokens_to_sample": 4000,
                "temperature": 1,
                "top_p": 0.9
            }
        )

def hr_rag_response(index, question):
    initialize_hr_llm()
    hr_rag_query = index.query(question=question, llm=llm)
    return hr_rag_query




# API part


# /chat api for normal chat
@app.route('/chat', methods=['POST'])
def chat_endpoint():
    session_number = request.json.get('session_number')
    input_text = request.json.get('input', "")
    start_new = request.json.get('start_new', False)

    if start_new or session_number not in sessions:
        session_number = str(uuid.uuid4())
        conversation = ConversationChain(llm=llm, verbose=True, memory=ConversationBufferMemory())
        sessions[session_number] = conversation
    else:
        conversation = sessions[session_number]

    response = conversation.predict(input=input_text)
    return jsonify({"response": response, "session_number": session_number})


# /search api for web crawling
@app.route('/search', methods=['POST'])
def scrape_website():
    try:
        data = request.get_json()
        base_url = data.get('url')
        max_depth = data.get('max_depth', 1)
        document_id = save_scraped_content_to_mongodb(base_url, max_depth)
        return jsonify({"message": f"Scraped content saved to MongoDB with ID {document_id}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# /ask api for asking from crwaled content
@app.route('/ask', methods=['POST'])
def conversation_from_mongodb():
    try:
        data = request.get_json()
        base_url = data.get('url')
        input_text = data.get('input')
        start_new = data.get('start_new', False)
        document_id = data.get('doc_id')

        document = collection.find_one({'url': base_url})
        document = collection.find_one({'cod_id':document_id})
        if document is None:
            return jsonify({"error": "No content found for the provided URL"}), 404

        content_df = pd.DataFrame(document['content'])
        conversation_llm = BedrockChat(
            credentials_profile_name="default",
            provider="anthropic",
            model_id="anthropic.claude-3-haiku-20240307-v1:0",
            model_kwargs={"temperature": 1, "max_tokens": random_max_tokens, "top_p": 1.0},
            streaming=True,
        )

        conversation = None
        if start_new or conversation is None:
            conversation = ConversationChain(llm=conversation_llm, verbose=True, memory=ConversationBufferMemory())

        content_context = "\n".join(content_df['Content'].tolist())
        full_input = f"{content_context}\n\n{input_text}"
        response = conversation.predict(input=full_input)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# /pdf api

@app.route('/pdf', methods=['POST'])
def invoke_llm_with_embeddings():
    try:
        prompt = request.form.get('prompt')
        pdf_file = request.files.get('pdf_file')
        user_id = request.form.get('user_id')

        temp_pdf_path = r'C:\backend_pdf\f{user_id}.pdf'
        pdf_file.save(temp_pdf_path)
        initialize_pdf_index(temp_pdf_path)
        response = hr_rag_response(pdf_index, prompt)
        response_data = {"output_responses": response}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)
