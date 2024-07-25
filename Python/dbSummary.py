from bs4 import BeautifulSoup
import requests
import pandas as pd
import json
import boto3
from flask import Flask, request, jsonify
from langchain_aws import BedrockChat, ChatBedrock
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

 
app = Flask(__name__)
CORS(app)
 
# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')
db = client['edtech']
collection = db['notes']
 

# /ask api for asking from database content
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

        if 'rawNote' not in document:
            return jsonify({"error": "'rawNote' field is missing in the document"}), 400

        raw_note = document['rawNote']

        print(raw_note)

        conversation_llm = BedrockChat(
            credentials_profile_name="default",
            provider="anthropic",
            model_id="anthropic.claude-3-haiku-20240307-v1:0",
            model_kwargs={"temperature": 1, "max_tokens": 1000, "top_p": 1.0},
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



if __name__ == '__main__':
    app.run(debug=True)