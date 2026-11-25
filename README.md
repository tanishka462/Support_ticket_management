# HelpDesk — Support Ticket Management System

A full-stack helpdesk application built for the Full Stack Developer technical assignment.

## Stack
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB + Mongoose
- Auth: JWT access tokens + bcrypt password hashing
- Validation: Zod
- Tests: Jest + Supertest
- Events: Node.js EventEmitter with persistent activity logs and in-app notifications

## Features
- User registration and login; role-based `user` / `admin` access
- Users can create, view, update and delete their own open tickets
- Users and admins can comment on tickets
- Admin can view/manage all tickets, update status and priority, and filter/search
- Ticket activity history and in-app notifications
- Dashboard statistics, pagination, sorting and filtering
- Input validation, centralized error handling, protected routes and ownership checks
- Responsive React UI
- API documentation and Postman collection

## Prerequisites
- Node.js 20+
- npm 9+
- MongoDB local instance or MongoDB Atlas connection string

## Quick start

### 1. Backend
```bash
cd server
cp .env.example .env
npm install
npm run seed:admin
npm run dev
```
Set `MONGODB_URI` and `JWT_SECRET` in `server/.env` before starting. API runs at `http://localhost:5000`.

Default seeded admin (change immediately after first login):
- Email: `admin@helpdesk.local`
- Password: `Admin@12345`

### 2. Frontend
Open a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

## Environment variables
See `server/.env.example` and `client/.env.example`.

## API overview
Base URL: `/api`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /tickets`
- `POST /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id`
- `DELETE /tickets/:id`
- `POST /tickets/:id/comments`
- `PATCH /tickets/:id/admin` (admin)
- `GET /dashboard/stats`
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `GET /activity` (admin)

All protected endpoints require `Authorization: Bearer <token>`.

## Data model
- **User**: name, email (unique), passwordHash, role, timestamps
- **Ticket**: title, description, category, priority, status, owner, timestamps
- **Comment**: ticket, author, body, timestamps
- **ActivityLog**: actor, ticket, action, message, metadata, timestamp
- **Notification**: recipient, ticket, message, readAt, timestamp

Ticket status: `open | in_progress | waiting_for_user | resolved | closed`
Priority: `low | medium | high | urgent`
Category: `technical | billing | account | general | other`

## Architecture and event workflow
Routes validate incoming data and call controllers. Controllers enforce role/ownership rules and use Mongoose models. Important ticket/comment actions emit domain events. An event listener persists activity logs and creates in-app notifications. This keeps event side effects separate from HTTP route logic.

## Tests
```bash
cd server
npm test
```
The included API tests cover the health endpoint and authentication validation. For integration tests, provide a dedicated test MongoDB URI using `TEST_MONGODB_URI`.

## API documentation
See `docs/API.md` and `postman/HelpDesk.postman_collection.json`.

## Security notes
- Passwords are hashed using bcrypt.
- JWT secret is supplied through environment variables.
- Admin role cannot be assigned through public registration.
- Ticket ownership is checked on every user ticket operation.
- Admin-only operations are protected by role middleware.
- Request payloads are validated with Zod.
- Helmet, CORS configuration and rate limiting are enabled.
- Never commit `.env` files or production secrets.

## Git workflow
```bash
git init
git add .
git commit -m "Build HelpDesk support ticket management system"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```
