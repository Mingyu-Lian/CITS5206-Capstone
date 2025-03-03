# CITS5206-Capstone

# Next.js + Django Full Stack Application

A collaborative web application using Next.js with Tailwind CSS for the frontend and Django REST Framework for the backend.

## Prerequisites

- Git
- Python 3.11+
- Node.js 18+
- Docker and Docker Compose (optional but recommended)

## Getting Started

### With Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Mingyu-Lian/CITS5206-Capstone.git
cd CITS5206-Capstone

# Start the application
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin panel: http://localhost:8000/admin

### Without Docker

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Development Workflow

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests locally
4. Commit your changes with descriptive commit messages
5. Push to your branch: `git push origin feature/your-feature-name`
6. Create a Pull Request on GitHub

## Project Structure

```
project-root/
├── frontend/         # Next.js application
├── backend/          # Django application
├── docker/           # Docker configuration files
├── docs/             # Documentation
├── .gitignore        # Root gitignore file
└── README.md         # Project overview
```

## API Documentation

API documentation is available at `/api/docs/` when running the backend server.