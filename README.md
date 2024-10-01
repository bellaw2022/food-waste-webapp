
Copy code
# Fridgify Web Application

## Overview
Fridgify is a web application that helps users manage grocery inventory, track food waste, and reduce environmental impact. This app includes a React frontend and Flask backend. The backend is hosted on Heroku, and the database is pre-configured using PostgreSQL.

### Technologies Used:
- Flask (Backend)
- PostgreSQL (Database)
- React (Frontend)
- Heroku (Backend Hosting)
  
## Prerequisites
- Python 3.x
- Node.js (v14 or higher)
- npm (v6 or higher)

## Instructions for Setting Up the Project

### 1.Clone the Repository
To get started, clone the repository to your local machine:
```bash
git clone https://github.com/bellaw2022/food-waste-webapp.git
```
```bash
cd food-waste-webapp
```
### 1.2 Environment Variables
You will need to create a `.env` file in the backend directory of the project, plz reach out to get the file. 


### 2. Backend Setup (Flask)

### Step 1: Create a Virtual Environment
In the `flask-backend` directory, set up a virtual environment:
```bash
cd flask-backend
python3 -m venv venv
```
```bash
source venv/bin/activate  # For Linux/macOS
```


```bash
use `venv\Scripts\activate` # For Windows
```


### Step 2: Install Dependencies
Install the backend dependencies using the requirements.txt file:
```bash
pip install -r requirements.txt
```
### Step 3: Running the Backend Server
Once the environment is ready, you can run the Flask server:
```bash
flask run
```
The backend will run on http://127.0.0.1:5000/.

### 3. Frontend Setup (React)
### Step 1: Navigate to the Frontend Directory
```bash
cd ../fridgify-frontend
```
### Step 2: Install Dependencies
Install the necessary React dependencies:
```bash
npm install
```
### Step 3: Running the Frontend
Start the React development server:
```bash
npm start
```
The frontend will run on http://localhost:3000.

### Step 4: Checking the Statistics Page
To confirm that the frontend is correctly connected to the backend, navigate to the Statistics page by clicking on the link from the homepage. This page will fetch user waste data from the backend and display it.