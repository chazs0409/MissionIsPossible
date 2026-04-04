# PROJECT SETUP GUIDE

This project uses Docker to run a React frontend, Django backend, and PostgreSQL database. Follow these steps to set up your local environment.

1. ENVIRONMENT VARIABLES
------------------------
Before starting, you need to set up your local environment file:

  a. Open the new .env.example file and ensure the database credentials 
     (POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD) match your 
     docker-compose.yml settings.

2. START THE CONTAINERS
-----------------------
Build and start the services in detached mode:

  docker compose up --build -d

3. DATABASE SETUP (CRUCIAL)
---------------------------
You must sync the database schema and load the job data for the app to work.

  A. Run Migrations:
     (Creates the api_job table and database structure)
     docker compose exec backend python manage.py migrate

  B. Load Job Data:
     (Populates the database with Amazon, Apple, Microsoft, etc.)
     docker compose exec backend python manage.py loaddata initial_jobs.json

4. WORKING WITH DBEAVER
-----------------------
To view or edit the data directly in DBeaver:

  - Connection Type: PostgreSQL
  - Host: localhost
  - Port: 5432
  - Database/User/Password: Use the values defined in your .env.example file.

5. SYNCING TEAM CHANGES
-----------------------
If a teammate updates the models or adds new job data:

  a. Pull the latest code: 
     git pull origin <your-branch-name>

  b. Apply new changes:
     docker compose exec backend python manage.py migrate
     docker compose exec backend python manage.py loaddata initial_jobs.json

-------------------------------------------------------------------------
NOTE: Make sure the 'backend/api/fixtures/initial_jobs.json' file exists 
before running the loaddata command.
-------------------------------------------------------------------------