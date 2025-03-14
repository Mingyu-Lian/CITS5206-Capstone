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
Vue.js 3 + Vite - Reactive and fast UI development
Element-Plus - UI component library
TypeScript - Type-safe JavaScript
Pinia - State management

## Backend:
Node.js - Backend framework
MongoDB - NoSQL database for managing WMS records
JWT (JSON Web Tokens) - Authentication and authorization

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
## 1️. Prerequisites
- Node.js (v16+)
- MongoDB (Latest)
- Git (Latest)
  
## 2. Installation
`#Clone the repository`
`git clone https://github.com/Mingyu-Lian/CITS5206-Capstone.git`

`# Navigate to the project folder`
`cd CITS5206-Capstone`

`# Install dependencies`
`npm install

## 3. Run the Application

## 4. Environment Variables

# Contributors
Dr. Bin Zhu 
Dr. Licai Fang 
Zulqarnain Gilani

Lian Liu (24022721)
Dhanyavi Goti (24096172)
Ethan He (24154773)
Alex Wang (24123115)
Arthur Lian (24046428)
Raunak Chhabra (23914274)


