
# Project API Endpoints and Instructions

## API Endpoints

The project uses the following API endpoints:

- **MAIN_API:** `http://localhost:3004/`
- **BHASHINI:** `http://localhost:3002/`
- **IMAGE_API:** `http://localhost:8008/`
- **PYTHON_API:** `http://127.0.0.1:5000/`

## Running the Project

### Prerequisites

- Node.js (https://nodejs.org/)
- Python 3 (https://www.python.org/)

### Running the Node.js Server

1. Navigate to your project directory:

   ```bash
   cd path/to/your/project
2. Install the necessary dependencies:
npm install 
3.Start the Node.js server:
npm start

Your Node.js server should now be running and accessible at http://localhost:3004/.

4.Running the Python Server
4.1.Navigate to your Python project directory:

cd path/to/your/python/project

4.2.(Optional) Create and activate a virtual environment:
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

4.3.Install the necessary dependencies:
pip install -r requirements.txt

4.4.Start the Python server:
python app.py
Your Python server should now be running and accessible at http://127.0.0.1:5000/.

5.Additional Information
Ensure that both the Node.js and Python servers are running simultaneously for the application to function correctly. You can modify the API endpoint URLs in src/constants/path.js  for different environments or configurations.

