import os
import requests
import json
import boto3
 
from flask import Flask, request, jsonify
from flask_cors import CORS
 
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import BedrockEmbeddings
from langchain.vectorstores import FAISS
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.llms import Bedrock
from langchain_aws import BedrockChat, ChatBedrock
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
 
from pymongo import MongoClient
from bson import ObjectId
 
from PyPDF2 import PdfReader
 
app = Flask(__name__)
CORS(app)
 
# MongoDB connection
mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client['hybridSchool']
collection = db['collections']
 
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
 
@app.route('/ask', methods=['POST'])
def conversation_from_mongodb():
    try:
        data = request.get_json()
        input_text = data.get('input')
        start_new = data.get('start_new', False)
        document_id = data.get('doc_id')
 
        document = collection.find_one({'_id': ObjectId(document_id)})
 
        if document is None:
            return jsonify({"error": "No content found"}), 404
 
        if 'rawNotes' not in document:
            return jsonify({"error": "'rawNote' field is missing in the document"}), 400
 
        raw_note = document['rawNotes']
 
        print(raw_note)
 
        conversation_llm = BedrockChat(
            credentials_profile_name="default",
            provider="anthropic",
            model_id="anthropic.claude-3-haiku-20240307-v1:0",
            model_kwargs={"temperature": 1, "max_tokens": 2000, "top_p": 1.0},
            streaming=True,
        )
 
        conversation = None
        if start_new or conversation is None:
            conversation = ConversationChain(llm=conversation_llm, verbose=True, memory=ConversationBufferMemory())
 
 
        # Concatenate rawNote with input_text for full context
        full_input = f"{raw_note}\n\n{input_text}"
        response = conversation.predict(input=full_input)
 
        print(response)
        return jsonify({"response": response})
    except Exception as e:
        print('error', e)
        return jsonify({"error": str(e)}), 500
 
@app.route('/pdf_raw_save', methods=['POST'])
def get_raw_pdf_content():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    pdf_file = request.files['pdf']
    noteId = request.form.get('noteId', 'default')

    # Convert noteId to ObjectId
    try:
        noteId = ObjectId(noteId)
    except:
        return jsonify({'error': 'Invalid noteId'}), 400

    temp_pdf_path = f'{noteId}.pdf'
    pdf_file.save(temp_pdf_path)

    try:
        reader = PdfReader(temp_pdf_path)
        rawPDFnote = "\n".join([page.extract_text() for page in reader.pages])

        # Create a document to be inserted into MongoDB
        document = {
            "noteId": noteId,
            "rawNotes": rawPDFnote,
            "type": "pdf"
        }

        # Save raw content to MongoDB
        collection.insert_one(document)

        return jsonify({"message": "Raw PDF content saved to MongoDB"})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(temp_pdf_path) 

@app.route('/ask_note', methods=['POST'])
def ask_note():
    try:
        data = request.get_json()
        input_text = data.get('input')
        note_id = data.get('doc_id')  # Assuming doc_id refers to noteId in your collection
 
        # Log the received note_id
        print(f"Received note_id: {note_id}")
 
        # Check if note_id is provided
        if not note_id:
            return jsonify({"error": "No note_id provided"}), 400
 
        # Ensure note_id is a valid ObjectId
        try:
            object_id = ObjectId(note_id)
        except Exception as e:
            return jsonify({"error": f"Invalid note_id format: {str(e)}"}), 400
 
        # Find all documents with the given note_id
        documents = list(collection.find({'noteId': object_id}))
 
        # Log the number of documents found
        print(f"Number of documents found: {len(documents)}")
 
        if not documents:
            return jsonify({"error": "No content found"}), 404
 
        # Concatenate rawNotes from all found documents
        all_notes = "\n\n".join([doc.get('rawNotes', '') for doc in documents])
 
        if not all_notes:
            return jsonify({"error": "No rawNotes found in the documents"}), 404
 
        conversation_llm = BedrockChat(
            credentials_profile_name="default",
            provider="anthropic",
            model_id="anthropic.claude-3-haiku-20240307-v1:0",
            model_kwargs={"temperature": 1, "max_tokens": 2000, "top_p": 1.0},
            streaming=True,
        )
 
        # Concatenate all_notes with input_text for full context
        full_input = f"{all_notes}\n\n{input_text}"
        conversation = ConversationChain(llm=conversation_llm, verbose=True, memory=ConversationBufferMemory())
        response = conversation.predict(input=full_input)
 
        return jsonify({"response": response})
    except Exception as e:
        print('error', e)
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True) 