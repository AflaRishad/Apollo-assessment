APOLLO — ENERGY ASSET MANAGEMENT

Fullstack web app for managing and monitoring energy assets: projects, tasks, and progress tracking, with token-based authentication.

1. WHAT THIS APP DOES

* User registration, login, and logout
* Token-based authentication via Laravel Sanctum
* Create and list projects
* Project detail view with a task checklist
* Create tasks and toggle task status:
  todo → in-progress → done
* Dashboard shows recent tasks, active projects, and per-project progress
* Green/white visual theme throughout auth pages, dashboard, and project detail

2. ARCHITECTURE

BACKEND

Framework: Laravel 13 (PHP 8.5)
Authentication: Sanctum, token-based
Authorization header: Bearer <token>
Database: PostgreSQL via Eloquent models and migrations

Models:

* User
* Project
* Task

Controllers:

* Api\AuthController
* Api\ProjectController
* Api\TaskController

API ROUTES:

POST /api/register
POST /api/login
POST /api/logout
GET /api/me
GET /api/projects
POST /api/projects
GET /api/projects/{project}
POST /api/projects/{project}/tasks
PATCH /api/projects/{project}/tasks/{task}

Authentication:

* /api/logout uses auth:sanctum
* /api/me uses auth:sanctum
* /api/projects uses auth:sanctum
* /api/projects/{project} uses auth:sanctum
* /api/projects/{project}/tasks uses auth:sanctum
* /api/projects/{project}/tasks/{task} uses auth:sanctum

FRONTEND

Framework: React + TypeScript
Build tool: Vite
Routing: React Router
State management: Local component state + AuthContext
API layer: api.ts

Vite:

* npm run dev automatically opens the browser

API layer:

* Uses a typed fetch wrapper
* Attaches the bearer token to every request
* Automatically clears local storage when a 401 response is received

3. DATA MODEL

USERS TABLE

id
name
email — unique
password — hashed

PROJECTS TABLE

id
user_id — owner, foreign key
name
description — nullable
status — planned | active | completed

TASKS TABLE

id
project_id — foreign key
title
description — nullable
status — todo | in-progress | done
due_date — nullable

4. UI AND DESIGN

Color palette:

* Emerald green: #1B5E3F
* Used as the single accent color across the sidebar, buttons, active navigation state, and progress bars
* Matches the green split-screen authentication pages

Status badges:

* Green — done/on-track
* Amber — in-progress
* Red — urgent/overdue

AUTH PAGES

* Split-screen layout
* Green brand panel on the left
* Login/register form on the right

DASHBOARD

* Sidebar containing:

  * Brand
  * Navigation
  * User information
  * Logout button

* Main content containing:

  * Recent tasks
  * Active project cards
  * Project progress bars

PROJECT DETAIL

* Dark-themed project card
* Task checklist
* Clicking a task cycles through its status

5. BACKEND SETUP — WINDOWS / POWERSHELL

PREREQUISITES

* PHP 8.1+
* Composer
* PostgreSQL

If installing PHP through winget fails with a 404:

1. Go directly to:
   https://windows.php.net/download/

2. Download the Zip version.

3. Select:

* Thread Safe
* x64
* Do NOT download the -src source archive

4. Extract PHP so that php.exe is located directly at:

C:\php\php.exe

5. Add C:\php to your User PATH using:

System Properties → Environment Variables

The GUI method is more reliable than scripting it.

6. Open a completely new terminal window before testing:

php -v

STEP 1 — CREATE THE LARAVEL PROJECT

Run:

composer create-project laravel/laravel backend
cd backend

Do not pin the project to ^10.0.

Recent Laravel 10.x releases may be blocked by Composer's security-advisory check.

Using the latest Laravel version is fine.

STEP 2 — INSTALL SANCTUM AND API ROUTING

Run:

composer require laravel/sanctum
php artisan install:api

If Laravel asks whether to run migrations immediately, select NO.

Add your own migrations first.

STEP 3 — ENABLE REQUIRED PHP EXTENSIONS

Copy:

php.ini-development

to:

php.ini

inside your PHP folder.

Then open php.ini and uncomment the following extensions by removing the leading semicolon:

extension=fileinfo
extension=mbstring
extension=openssl
extension=pdo_pgsql
extension=pgsql
extension=curl

STEP 4 — ADD THE CUSTOM APPLICATION FILES

Add the custom:

* Controllers
* Models
* Migrations
* routes/api.php

Make sure the files follow the actual Laravel namespace and folder structure.

For example:

app/Http/Controllers/Api/AuthController.php
app/Http/Controllers/Api/ProjectController.php
app/Http/Controllers/Api/TaskController.php

STEP 5 — CONFIGURE .ENV

Laravel 11+ defaults to SQLite.

Replace the database configuration with:

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=apollo
DB_USERNAME=postgres
DB_PASSWORD=<your postgres password>

Also set:

SESSION_DRIVER=file

Do not use:

SESSION_DRIVER=database

unless you keep Laravel's default sessions table migration.

STEP 6 — CREATE THE DATABASE AND GENERATE THE APP KEY

Create the PostgreSQL database:

psql -U postgres -c "CREATE DATABASE apollo;"

Generate the Laravel application key:

php artisan key:generate

STEP 7 — CHECK FOR DUPLICATE MIGRATIONS

Laravel's default users migration and Sanctum's personal_access_tokens migration can conflict with copied versions of the same migrations.

Keep only one migration for each table.

Then run:

php artisan migrate

STEP 8 — RUN THE BACKEND

Run:

php artisan serve

The API will be available at:

http://127.0.0.1:8000/api

6. FRONTEND SETUP

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Copy the environment file:

copy .env.example .env

Start the frontend:

npm run dev

The application should automatically open at:

http://localhost:5173

If port 5173 is already in use, Vite will automatically select another available port such as:

5174
5175

Check the terminal output to find the actual URL.

7. HOW THE FRONTEND COMMUNICATES WITH THE BACKEND

Base API URL:

http://localhost:8000/api

This is configured through:

VITE_API_URL

inside the frontend .env file.

Authentication flow:

1. User logs in.
2. Backend returns an authentication token.
3. Frontend stores the token in localStorage.
4. The token is attached to every API request using:

Authorization: Bearer <token>

5. If the backend returns a 401 response:

   * Stored token is cleared.
   * Stored user information is cleared.
   * The user is effectively logged out.

CORS:

The frontend and backend run on different origins:

Frontend:
http://localhost:5173

Backend:
http://localhost:8000

Make sure config/cors.php contains:

'paths' => ['api/*']

and:

'allowed_origins' => ['*']

This allows the frontend to communicate with the API during development.

8. KEY FILES

BACKEND

routes/api.php

Contains all API endpoints.

app/Http/Controllers/Api/AuthController.php

Handles:

* Registration
* Login
* Logout
* Current user information

app/Http/Controllers/Api/ProjectController.php

Handles:

* Project listing
* Project creation
* Project details

Important:
The index() method must use:

->with('tasks')

and NOT:

->withCount('tasks')

Otherwise, the dashboard's task list may silently come back empty.

app/Http/Controllers/Api/TaskController.php

Handles:

* Task creation
* Task updates

MODELS

app/Models/User.php
app/Models/Project.php
app/Models/Task.php

FRONTEND

src/App.tsx

Contains the React Router configuration.

src/context/AuthContext.tsx

Handles:

* Authentication state
* Login
* Registration
* Logout

src/api.ts

Contains the fetch wrapper.

Provides:

get()
post()
put()
patch()
del()

All requests are bearer-token aware.

src/pages/Dashboard.tsx

Contains:

* Recent tasks
* Active projects
* Project progress

src/pages/ProjectDetail.tsx

Contains:

* Task list
* Add task functionality
* Task status toggling

src/pages/Login.tsx

Login page.

src/pages/Signup.tsx

Registration page.

src/styles.css

Contains global styling.

Uses a single green accent variable:

--green

9. KNOWN GOTCHAS AND FIXES

PROBLEM:
Login/signup buttons did nothing.

CAUSE:
The pages were static HTML mockups and had no JavaScript connected to the API.

FIX:
Rebuilt them as React components with real fetch calls.

PROBLEM:
winget install PHP returned a 404.

CAUSE:
Broken manifest on Microsoft's end.

FIX:
Download the PHP Zip directly from:

https://windows.php.net/download/

PROBLEM:
php, composer, or psql was not recognized.

CAUSE:
PATH changes were not refreshed in the current terminal.

FIX:
Completely close the terminal and open a new terminal after changing PATH.

PROBLEM:
composer create-project laravel/laravel:^10.0 failed.

CAUSE:
Laravel 10.x was flagged by security advisories.

FIX:
Use:

composer create-project laravel/laravel backend

without pinning the Laravel version.

PROBLEM:
ext-fileinfo or another PHP extension was missing.

CAUSE:
Fresh PHP installations have several extensions disabled.

FIX:
Open php.ini and uncomment the required extensions.

PROBLEM:
relation "users" already exists during migration.

CAUSE:
Laravel's default users migration and a copied-in users migration both existed.

FIX:
Delete the duplicate migration and keep only one users migration.

PROBLEM:
relation "sessions" does not exist.

CAUSE:
The migration responsible for creating the sessions table was deleted.

FIX:
Set:

SESSION_DRIVER=file

in .env.

PROBLEM:
MissingAppKeyException.

CAUSE:
php artisan key:generate was not run.

FIX:
Run:

php artisan key:generate

PROBLEM:
Blank white screen after clicking "+ New Project".

CAUSE:
project.tasks was undefined for some API responses, causing .map() to crash.

FIX:
Use:

project.tasks ?? []

wherever the task array is accessed.

PROBLEM:
A task was added but did not appear on the dashboard.

CAUSE:
ProjectController@index used:

withCount('tasks')

which returns a number rather than the actual task array.

FIX:
Change it to:

with('tasks')

PROBLEM:
Toggling a task did nothing.

CAUSE:
The frontend was calling:

PUT /tasks/{id}

while the actual API route was:

PATCH /projects/{project}/tasks/{task}

FIX:
Add api.patch() and use the correct URL.

10. POSSIBLE FUTURE IMPROVEMENTS

* Add project editing
* Add project deletion
* Add PATCH /api/projects/{project}
* Add DELETE /api/projects/{project}
* Add task editing
* Add task deletion
* Validate and persist project status during project creation
* Currently project status is accepted by the frontend but is not yet validated or stored by ProjectController@store
* Add automated tests for API endpoints
* Add pagination for large project and task lists

SUMMARY

Apollo is a full-stack energy asset management application built with Laravel, PostgreSQL, React, and TypeScript.

The backend provides token-based authentication using Laravel Sanctum and REST-style APIs for managing projects and tasks.

The frontend provides:

* Authentication
* Dashboard
* Project management
* Task management
* Progress tracking
* Task status updates

The overall design uses a green and white visual identity with emerald green as the primary accent color.

Current core functionality:

* Register
* Login
* Logout
* View current user
* Create projects
* List projects
* View project details
* Create tasks
* Toggle task status
* View recent tasks
* View active projects
* Track project progress
