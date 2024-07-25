import os
from flask import Flask, request, jsonify
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import BedrockEmbeddings
from langchain.vectorstores import FAISS
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.llms import Bedrock
import random
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection
mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client['edtech']
collection = db['notes']

pdf_index = None  # Global variable to hold the PDF index
max_tokens = 6000


def initialize_pdf_index(pdf_path):
    global pdf_index
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
    return Bedrock(
        credentials_profile_name='default',
        model_id='anthropic.claude-v2',
        model_kwargs={
            "max_tokens_to_sample": max_tokens,
            "temperature": 1,
            "top_p": 0.9
        }
    )

def hr_rag_response(index, question):
    llm = initialize_hr_llm()
    hr_rag_query = index.query(question=question, llm=llm)
    return hr_rag_query

@app.route('/pdf_summary', methods=['POST'])
def summarize_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    pdf_file = request.files['pdf']
    user_id = request.form.get('user_id', 'default')

    temp_pdf_path = f'{user_id}.pdf'
    pdf_file.save(temp_pdf_path)
    initialize_pdf_index(temp_pdf_path)
    prompt = "summarize pdf"
    response = hr_rag_response(pdf_index, prompt)
    os.remove(temp_pdf_path)

    return jsonify({"output_responses": response})

@app.route('/pdf_prompt', methods=['POST'])
def process_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    pdf_file = request.files['pdf']
    user_id = request.form.get('user_id', 'default')
    prompt = request.form.get('prompt')

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400

    temp_pdf_path = f'{user_id}.pdf'
    pdf_file.save(temp_pdf_path)
    initialize_pdf_index(temp_pdf_path)
    response = hr_rag_response(pdf_index, prompt)
    os.remove(temp_pdf_path)

    return jsonify({"output_responses": response})

@app.route('/pdf_raw', methods=['POST'])
def get_raw_pdf_content():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    pdf_file = request.files['pdf']
    user_id = request.form.get('user_id', 'default')

    temp_pdf_path = f'{user_id}.pdf'
    pdf_file.save(temp_pdf_path)

    try:
        loader = PyPDFLoader(temp_pdf_path)
        rawPDFnote = "\n".join([page.page_content for page in loader.load_and_split()])

        # Create a document to be inserted into MongoDB
        document = {"user_id": user_id, "rawPDFnote": rawPDFnote}


        # Save raw content to MongoDB
        collection.insert_one(document)


        return jsonify({"message": "Raw PDF content saved to MongoDB"})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(temp_pdf_path)


if __name__ == '__main__':
    app.run(debug=True)