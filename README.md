# Blog App

A functional likeness of the social media site Reddit built with Vite+React.js (frontend) and Node.js Express (backend) for practice and learning purposes. Started from November 2025 and currently work in progress.
The project aims to replicate fundamental functions of Reddit and other traditional blog platforms like 4chan. 

## Features

- User authentication and account management
- Blog creation and management
- Post creation and edits
- Multiple image uploads
- Commenting system
- Likes and follows system
- Full compatiblity with small screens

Disclaimer: Not all features are implemented at the time of this writing.

## Screenshots

Home screen
<img width="1361" height="941" alt="Screenshot (1392)" src="https://github.com/user-attachments/assets/5e6d5063-9fc2-40f8-907c-2a1c98568c48" />

Post page
<img width="1356" height="939" alt="Screenshot (1389)" src="https://github.com/user-attachments/assets/8e4d1a49-0e7f-4105-bc7a-0c3cf761e17f" />

Post page (Mobile)
<img width="1142" height="991" alt="Screenshot (1390)" src="https://github.com/user-attachments/assets/a711db9a-68ce-462f-8f62-de0da01463f2" />

Blog creation page
<img width="1360" height="954" alt="Screenshot (1393)" src="https://github.com/user-attachments/assets/0ccde158-f974-4e50-a891-34edbde37945" />

Post creation page
<img width="1356" height="943" alt="Screenshot (1391)" src="https://github.com/user-attachments/assets/f452cbd8-2082-4293-8822-3a6d12222338" />

## Installation

### Prerequisites
Make sure you have the following installed:

- Node.js (v18 or later)
- npm (comes with Node.js)
- MongoDB (local installation or MongoDB Atlas)

---

### 1. Clone the repository

```bash
git clone https://github.com/NevVaek/blog-app.git
cd blog-app
```

### 2. Setup backend (Express + MongoDB)
```bash
cd server
npm install
```
Create a .env file in the server directory and add:
```bash
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```
Start backend server
```bash
npm run dev
```

### 3. Setup frontend (Vite + React)
Open a new terminal window
```bash
cd client
npm install
npm run dev
```
Visit http://localhost:5173


