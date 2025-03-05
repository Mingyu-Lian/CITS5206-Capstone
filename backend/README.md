# Introduction for Backend
The admin account
admin
Password: password123

### Step 1: Go into backend dir
`cd backend`

### Step2: Activate the Venv:
`source venv/bin/activate`

### Step 3: Install dependency (only do when you use it first time)
`pip install -r requirements.txt`

### Step4: Migrations
Only when you change the database (or first time run the code)
if you don't want to generate new migration, just run the second command is fine 
`python manage.py makemigrations`

`python manage.py migrate`

### deStep 5: run server
`python manage.py runserver`


Then the local portal will host the backend part.

## If you would like to deactivate the venv:
`deactivate`