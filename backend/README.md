# Alumni Connect Backend

A Flask + MySQL backend API for the Alumni Connect & Scholarship Support Platform.

## Features

- **Authentication**: JWT-based login/register with bcrypt password hashing
- **Role-based Access Control**: Admin, Alumni, and Student roles
- **File Upload**: Resume upload functionality for applications
- **RESTful API**: Clean JSON responses with proper error handling
- **Database Integration**: MySQL with SQLAlchemy ORM

## Tech Stack

- **Flask**: Web framework
- **SQLAlchemy**: ORM for database operations
- **MySQL**: Database
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-Migrate**: Database migrations

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up MySQL database**
   - Install MySQL server
   - Create database: `CREATE DATABASE alumni_connect;`
   - Run the initialization script: `mysql -u root -p alumni_connect < init_db.sql`

4. **Configure environment variables**
   - Copy `env_example.txt` to `.env`
   - Update database credentials and secret keys

5. **Run the application**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Admin Routes
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/<id>` - Delete user
- `GET /api/admin/stats` - Get platform statistics

### Alumni Routes
- `GET /api/alumni/opportunities` - Get my opportunities
- `POST /api/alumni/opportunities` - Create opportunity
- `PUT /api/alumni/opportunities/<id>` - Update opportunity
- `DELETE /api/alumni/opportunities/<id>` - Delete opportunity
- `GET /api/alumni/applications` - Get applications for my opportunities
- `PUT /api/alumni/applications/<id>/status` - Update application status
- `GET /api/alumni/profile` - Get my profile
- `PUT /api/alumni/profile` - Update my profile

### Student Routes
- `GET /api/student/opportunities` - Get available opportunities
- `POST /api/student/opportunities/<id>/apply` - Apply to opportunity
- `GET /api/student/applications` - Get my applications
- `DELETE /api/student/applications/<id>` - Withdraw application
- `GET /api/student/profile` - Get my profile
- `PUT /api/student/profile` - Update my profile

## Database Schema

### Users
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `role`: admin/alumni/student
- `created_at`: Timestamp

### Alumni Profiles
- `id`: Primary key
- `user_id`: Foreign key to users
- `occupation`: Job title
- `company`: Company name
- `domain`: Field of expertise

### Student Profiles
- `id`: Primary key
- `user_id`: Foreign key to users
- `cgpa`: Grade point average
- `category`: Student category

### Opportunities
- `id`: Primary key
- `alumni_id`: Foreign key to users (alumni)
- `type`: internship/scholarship/mentorship/success_story
- `title`: Opportunity title
- `description`: Detailed description
- `min_cgpa`: Minimum CGPA requirement
- `category`: Target category
- `created_at`: Timestamp

### Applications
- `id`: Primary key
- `student_id`: Foreign key to users (student)
- `opportunity_id`: Foreign key to opportunities
- `status`: pending/accepted/declined
- `resume_file`: Uploaded resume filename
- `applied_at`: Timestamp

## Default Credentials

- **Admin**: admin@alumni.com / admin123
- **Sample Alumni**: john@alumni.com / admin123
- **Sample Student**: jane@student.com / admin123

## File Upload

- Resume files are stored in the `uploads/` directory
- Supported formats: PDF, DOC, DOCX
- Maximum file size: 16MB
- Files are renamed with UUID to prevent conflicts

## CORS Configuration

The backend is configured to allow CORS requests from the React frontend running on `http://localhost:3000`.

## Error Handling

All API endpoints return consistent JSON responses:
- **Success**: `{"message": "Success message", "data": {...}}`
- **Error**: `{"error": "Error message"}`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- File upload validation
- SQL injection prevention with SQLAlchemy ORM

## Development

To run in development mode:
```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

## Production Deployment

1. Set strong secret keys in environment variables
2. Use a production database
3. Configure proper CORS origins
4. Set up file storage (AWS S3, etc.)
5. Use a production WSGI server (Gunicorn, uWSGI)
6. Set up reverse proxy (Nginx)
7. Enable HTTPS
