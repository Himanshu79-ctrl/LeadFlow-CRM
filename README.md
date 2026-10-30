# LeadFlow CRM

A full-stack CRM application designed for small web development and digital marketing agencies to manage potential clients, track sales opportunities, and schedule follow-ups from one place.

## Features

### Authentication
- User registration and login.
- JWT-based authentication.
- Protected API endpoints.
- Logout with refresh-token blacklisting.
- Passwords handled using Django's password hashing.

### Lead Management
- Create, view, update, and delete leads.
- Search leads by name or company.
- Filter leads by sales stage.
- Track client information, service interests, lead source, and budget.
- Automatically associate leads with the authenticated user.

### Sales Pipeline
Track leads through the following stages:
- New
- Contacted
- Qualified
- Proposal Sent
- Won
- Lost

### Follow-up Management
- Create follow-up activities for leads.
- Support Call, Email, Meeting, and Task activity types.
- Set due dates and track pending activities.
- Mark activities as completed.
- Track completion timestamps.
- Restrict access to activities associated with the user's own leads.

### Dashboard
- Total leads.
- Active leads.
- Won leads.
- Lost leads.
- Pending follow-ups.
- Overdue follow-ups.

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- Lucide React

**Backend**
- Python
- Django
- Django REST Framework
- Simple JWT

**Database**
- PostgreSQL

## Project Structure

```text
LeadFlow-CRM/
├── backend/
│   ├── accounts/
│   ├── activities/
│   ├── config/
│   ├── dashboard/
│   ├── leads/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Python 3.11 or another version supported by the installed dependencies.
- Node.js and npm.
- PostgreSQL.
- Git.

## Backend Setup

### 1. Navigate to the backend directory

```powershell
cd backend
```

### 2. Create and activate a virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt or follow your system's virtual-environment activation instructions.

### 3. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file inside the `backend/` directory.

Use `.env.example` as a template and provide your local PostgreSQL credentials.

Do not commit the actual `.env` file or production secrets.

### 5. Create the PostgreSQL database

Open PostgreSQL and create a database named `leadflow_crm`, or use the database name configured in your environment variables.

Example:

```sql
CREATE DATABASE leadflow_crm;
```

### 6. Apply database migrations

```powershell
python manage.py migrate
```

### 7. Start the backend server

```powershell
python manage.py runserver
```

The backend will run at:

`http://127.0.0.1:8000/`

Health endpoint:

`http://127.0.0.1:8000/api/v1/health/`

## Frontend Setup

Open a second terminal.

### 1. Navigate to the frontend directory

```powershell
cd frontend
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Configure the API URL

Create or update `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 4. Start the frontend

```powershell
npm run dev
```

Open the local URL printed by Vite in your terminal, usually:

`http://localhost:5173/`

Keep both the frontend and backend servers running while using the application.

## API Endpoints

All API endpoints use the `/api/v1/` prefix.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/health/` | Check API status | Public |
| POST | `/auth/register` | Register a user | Public |
| POST | `/auth/login` | Log in and obtain JWT tokens | Public |
| POST | `/auth/logout` | Blacklist a refresh token | Required |
| GET | `/auth/me` | Get current user details | Required |
| GET | `/leads/` | List leads | Required |
| POST | `/leads/` | Create a lead | Required |
| GET | `/leads/{id}` | Retrieve a lead | Required |
| PATCH | `/leads/{id}` | Update a lead | Required |
| DELETE | `/leads/{id}` | Delete a lead | Required |
| GET | `/activities/` | List follow-up activities | Required |
| POST | `/activities/` | Create a follow-up | Required |
| PATCH | `/activities/{id}/complete` | Complete a follow-up | Required |
| GET | `/dashboard/summary/` | Retrieve dashboard metrics | Required |

Use the exact paths above, including trailing slashes where shown.

### Lead Search and Filtering

Search leads by name or company:

`GET /api/v1/leads/?search=company`

Filter by stage:

`GET /api/v1/leads/?stage=Qualified`

Combine search and filtering:

`GET /api/v1/leads/?search=company&stage=Qualified`

### Follow-up Filtering

Filter activities by lead:

`GET /api/v1/activities/?lead=1`

Filter activities by status:

`GET /api/v1/activities/?status=Pending`

### Authentication

After login, use the returned access token in the Authorization header for protected endpoints:

```http
Authorization: Bearer <access_token>
```

The application uses JWT authentication. Access tokens expire, and refresh tokens are subject to their configured lifetime and blacklist behavior.

## Validation and Security

The backend includes the following protections:

- Protected API endpoints require authentication.
- Leads are associated with the authenticated user on the server.
- Users cannot retrieve leads belonging to other users.
- Follow-up access is restricted through the associated lead's ownership.
- Lead names are required.
- A lead must have an email address, phone number, or both.
- Negative lead budgets are rejected.
- Lead email addresses are normalized to lowercase.
- Activity completion timestamps are assigned by the backend.
- Passwords are handled by Django's password-hashing system.
- Environment files containing secrets should not be committed.

## Running Automated Tests

Run backend tests from the `backend/` directory.

Test lead management:

```powershell
python manage.py test leads
```

Test authentication:

```powershell
python manage.py test accounts
```

Test follow-up activities:

```powershell
python manage.py test activities
```

Test dashboard metrics:

```powershell
python manage.py test dashboard
```

Run the complete backend test suite:

```powershell
python manage.py test
```

Check the Django project configuration:

```powershell
python manage.py check
```

## Manual Test Checklist

- [ ] Register a new account.
- [ ] Attempt registration with an existing email.
- [ ] Log in with valid credentials.
- [ ] Verify that invalid credentials are rejected.
- [ ] Open protected pages while logged in.
- [ ] Create, update, view, and delete a lead.
- [ ] Search leads by name and company.
- [ ] Filter leads by stage.
- [ ] Verify that negative budgets are rejected.
- [ ] Verify that a lead cannot be created without an email or phone number.
- [ ] Create a follow-up activity.
- [ ] Mark a follow-up as completed.
- [ ] Verify that users cannot access another user's leads or follow-ups.
- [ ] Verify dashboard counts against the underlying records.
- [ ] Log out and verify that the frontend session is cleared.
- [ ] Check the API health endpoint.
- [ ] Restart the application and verify database persistence.

## Future Improvements

- Automated email reminders for upcoming follow-ups.
- Pagination and more advanced lead filtering.
- Role-based permissions for multiple team members.
- Deployment with production-grade environment configuration.
- Additional integration and end-to-end tests.

## Author

Developed as a full-stack CRM project for the VyorAI SDE Intern assignment.