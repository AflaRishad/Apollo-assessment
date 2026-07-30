# Apollo — Energy Asset Management

Fullstack web app for managing and monitoring energy assets: projects, tasks, and progress
tracking, with token-based authentication.

---

## 1) What this app does

- User registration, login, and logout
- Token-based auth via Laravel Sanctum
- Create and list projects
- Project detail view with a task checklist
- Create tasks and toggle task status (`todo → in-progress → done`)
- Dashboard shows recent tasks, active projects, and per-project progress
- Green/white visual theme throughout (auth pages, dashboard, and project detail)

---

## 2) Architecture

### Backend
- **Framework:** Laravel 13 (PHP 8.5)
- **Auth:** Sanctum, token-based (`Authorization: Bearer <token>`)
- **Database:** PostgreSQL via Eloquent models + migrations
- **Models:** `User`, `Project`, `Task`
- **Controllers:** `Api\AuthController`, `Api\ProjectController`, `Api\TaskController`

**API routes:**
