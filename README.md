# Apollo — Energy Asset Management

A fullstack web app for managing and monitoring energy assets projects, tasks, and progress tracking with token-based authentication.

## Screenshots

**Login**
<img width="1920" height="1032" alt="Login" src="https://github.com/user-attachments/assets/4ecdf4ce-0e56-4bd8-b4d7-a930ff1ef918" />

**Register**
<img width="1920" height="1032" alt="Register" src="https://github.com/user-attachments/assets/a9fa006b-e3f1-48b1-bc31-14489e426f93" />

**Dashboard**
<img width="1920" height="1032" alt="Dashboard" src="https://github.com/user-attachments/assets/c2167d5c-9842-4dbc-b18c-ab50b8a0635d" />

**Project Detail**
<img width="1920" height="1032" alt="Project Detail" src="https://github.com/user-attachments/assets/26502c24-41bc-4552-ac67-1f762848141a" />


## Features

- User registration, login, and logout
- Token-based auth via Laravel Sanctum
- Create and list projects
- Project detail view with a task checklist
- Task status flow: `todo → in-progress → done`
- Dashboard with recent tasks, active projects, and per-project progress
- Green/white theme across auth pages, dashboard, and project detail

## Tech Stack

**Backend:** Laravel 13 (PHP 8.5), Sanctum, PostgreSQL
**Frontend:** React + TypeScript, Vite, React Router

## Data Model

- **Users** — id, name, email, password
- **Projects** — id, user_id, name, description, status (`planned` / `active` / `completed`)
- **Tasks** — id, project_id, title, description, status (`todo` / `in-progress` / `done`), due_date

## API Routes

| Method | Route | Auth |
|---|---|---|
| POST | `/api/register` | – |
| POST | `/api/login` | – |
| POST | `/api/logout` | ✅ |
| GET | `/api/me` | ✅ |
| GET | `/api/projects` | ✅ |
| POST | `/api/projects` | ✅ |
| GET | `/api/projects/{project}` | ✅ |
| POST | `/api/projects/{project}/tasks` | ✅ |
| PATCH | `/api/projects/{project}/tasks/{task}` | ✅ |

## Getting Started

### Backend

```bash
composer create-project laravel/laravel backend
cd backend
composer require laravel/sanctum
php artisan install:api
```

Configure PostgreSQL in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=apollo
DB_USERNAME=postgres
DB_PASSWORD=<your postgres password>
SESSION_DRIVER=file
```

Then:

```bash
psql -U postgres -c "CREATE DATABASE apollo;"
php artisan key:generate
php artisan migrate
php artisan serve
```

API runs at `http://127.0.0.1:8000/api`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env   # or `cp` on macOS/Linux
npm run dev
```

App runs at `http://localhost:5173` (or the next available port).

Set `VITE_API_URL` in the frontend `.env` to point at the backend (`http://localhost:8000/api`).

## Project Structure

```
backend/
  app/Http/Controllers/Api/   # AuthController, ProjectController, TaskController
  app/Models/                 # User, Project, Task
  routes/api.php

frontend/
  src/App.tsx                 # Router
  src/context/AuthContext.tsx # Auth state
  src/api.ts                  # Bearer-token-aware fetch wrapper
  src/pages/                  # Login, Signup, Dashboard, ProjectDetail
  src/styles.css               # Global styles (--green accent)
```

## Known Gotchas

- `ProjectController@index` must use `->with('tasks')`, not `->withCount('tasks')`, or the dashboard's task list comes back empty.
- Frontend must call `PATCH /projects/{project}/tasks/{task}` to toggle task status — not `PUT /tasks/{id}`.
- Access `project.tasks ?? []` on the frontend to avoid crashes when the array is undefined.
- On Windows, close and reopen the terminal after editing `PATH` (PHP/Composer/psql) for changes to take effect.

## Roadmap

- Project editing & deletion (`PATCH` / `DELETE /api/projects/{project}`)
- Task editing & deletion
- Persist project status on creation
- Automated API tests
- Pagination for large project/task lists
