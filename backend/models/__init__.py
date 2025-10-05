from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum('admin', 'alumni', 'student'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    alumni_profile = db.relationship('AlumniProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    student_profile = db.relationship('StudentProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    opportunities = db.relationship('Opportunity', backref='alumni', lazy=True)
    applications = db.relationship('Application', backref='student', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convert user to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AlumniProfile(db.Model):
    __tablename__ = 'alumni_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    occupation = db.Column(db.String(100), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    domain = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    github = db.Column(db.String(255), nullable=True)
    profile_pic = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'occupation': self.occupation,
            'company': self.company,
            'domain': self.domain,
            'phone': self.phone,
            'location': self.location,
            'bio': self.bio,
            'linkedin': self.linkedin,
            'github': self.github,
            'profile_pic': self.profile_pic,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cgpa = db.Column(db.Float, nullable=True)
    category = db.Column(db.String(50), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    github = db.Column(db.String(255), nullable=True)
    profile_pic = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'cgpa': self.cgpa,
            'category': self.category,
            'phone': self.phone,
            'location': self.location,
            'bio': self.bio,
            'linkedin': self.linkedin,
            'github': self.github,
            'profile_pic': self.profile_pic,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Opportunity(db.Model):
    __tablename__ = 'opportunities'
    
    id = db.Column(db.Integer, primary_key=True)
    alumni_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.Enum('internship', 'scholarship', 'mentorship', 'success_story'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    min_cgpa = db.Column(db.Float, nullable=True)
    category = db.Column(db.String(50), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    duration = db.Column(db.String(50), nullable=True)
    stipend = db.Column(db.String(100), nullable=True)
    requirements = db.Column(db.Text, nullable=True)
    deadline = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    applications = db.relationship('Application', backref='opportunity', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'alumni_id': self.alumni_id,
            'type': self.type,
            'title': self.title,
            'description': self.description,
            'min_cgpa': self.min_cgpa,
            'category': self.category,
            'company': self.company,
            'location': self.location,
            'duration': self.duration,
            'stipend': self.stipend,
            'requirements': self.requirements,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'alumni_name': self.alumni.name if self.alumni else None
        }

class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'declined'), default='pending')
    resume_file = db.Column(db.String(255), nullable=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'opportunity_id': self.opportunity_id,
            'status': self.status,
            'resume_file': self.resume_file,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'student_name': self.student.name if self.student else None,
            'opportunity_title': self.opportunity.title if self.opportunity else None
        }
