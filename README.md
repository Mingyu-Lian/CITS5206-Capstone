# CITS5206-Capstone

# Project Overview
eWMS (Electronic Working Method Statement) is a web-based system designed to assist administrators, supervisors, and engineers in managing locomotive installation and commissioning tasks efficiently.

This system digitalizes traditional Working Method Statements (WMS) by leveraging modern mobile and web technologies. It enables document import, task assignment, progress tracking, and offline support to streamline daily engineering workflows.

# Key Features
1.  **Role-Based Access Control**: Users (Administrators, Supervisors, Engineers) have personalized dashboards and access rights.
2.  **WMS Document Importing**: Supports bulk import of Microsoft Word and Excel files as WMS templates.
3.  **Real-Time Collaboration**: Multiple users can interact with the same WMS simultaneously, including adding text, images, and videos.
4.  **Offline Support**: Engineers can work without an internet connection, and data syncs when online.
5.  **Locomotive Baseline Management**: Tracks installation progress, reports updates, and manages system configurations.

# Technology Stack
## Frontend:
- React.js -  Reactive and fast UI development
- Element-Plus - UI component library
- JavaScript
- Pinia - State management

## Backend:
- Node.js - Express.js Backend framework 
- MongoDB - NoSQL database for managing WMS records
- JWT (JSON Web Tokens) - Authentication and authorization

# System Architecture
## Frontend (Web UI)
- Displays dashboards based on user roles.
- Supports image/video capture and file uploads.
- Provides offline functionality with local caching.

## Backend (API & Database)
- Stores and processes WMS templates.
- Manages user authentication and access control.
- Syncs offline data when network restores.

# Setup Instructions

## 1. Prerequisites
Make sure you have **Docker** or **Docker Desktop** installed.

### Install Docker:

#### Mac (via Homebrew):

` brew install --cask docker`

#### Windows (via Chocolatey):
`choco install docker-desktop`


### Install Docker Desktop:
Or download and install Docker Desktop directly:

Docker Desktop Download: https://www.docker.com/products/docker-desktop/

After installation, make sure Docker is running in the background.

## 2. Installation

You can choose to run in Docker (Recommended) or without Docker

### In Docker

This will automatically run both frontend and backend, along with MongoDB, using Docker Compose.

Step 1: Clone the repository or pull the code from the Git.

Step 2: go to `server` directory:

`cd server`

Step 3: Build the container and run both frontend & backend

run `docker-compose up --build` 

or `docker compose up --build` (when the first command does not work)

Step 4: For the Future Run

run `docker-compose up`
or `docker compose up`

#### This will:

Build all containers (frontend, backend, database)

Start the services

Watch for changes (if configured correctly)

### Without Docker (not Recommended)

Run in Local (not in Docker, complex and not recommended):

#### For Frontend:

Step 1: Clone or pull the code from Git

Step 2:`cd server/frontend`

Step 3:`npm install`

Step 4:`npm install react-webcam` , `npm install localforage`

Step 5:`npm start`  or `npm run dev`

The frontend will be available at:
http://localhost:3000

#### For Backend:

Step 1: Clone or pull the code from Git

Step 2: `cd server/backend`

Step 3: Create an .env file and copy this code in:

MONGO_URI=mongodb://mongodb:27017/test
JWT_SECRET=mysecretkey


Step 4: `npm install`

Step 5: `node server.js`  # or `npm run dev` 



## 3. Final Check
The backend server will be running at:
http://localhost:5001 (or the port you specified )

Once everything is running, visit:

### Frontend UI: http://localhost:3000

### Backend API: http://localhost:5001

### API Documentation (Swagger): http://localhost:5001/api-docs 

### Login Credentials for Frontend

To explore the system from different user perspectives, use the following mock credentials during login:

| **Role**     | **Username** | **Password**       | **Discipline**  |
|--------------|--------------|--------------------|-----------------|
| Admin        | alice        | Admin@123          | Not required    |
| Supervisor   | charlie      | Supervisor@123     | Mechanical      |
| Supervisor   | diana        | Supervisor@123     | Electrical      |
| Engineer     | fiona        | Engineer@123       | Mechanical      |
| Engineer     | george       | Engineer@123       | Electrical      |
| Engineer     | hannah       | Engineer@123       | Software        |

> **Note:** Discipline is only required for Supervisor and Engineer roles.

# Contributors

Lian Liu (24022721)<br/>
Dhanyavi Goti (24096172)<br/>
Ethan He (24154773)<br/>
Alex Wang (24123115)<br/>
Arthur Lian (24046428)<br/>
Raunak Chhabra (23914274)<br/>

