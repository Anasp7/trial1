#!/usr/bin/env python3
"""
Script to create test users in the SQLite database
"""

from flask import Flask
from config import Config
from models import db, User, AlumniProfile, StudentProfile
import bcrypt

def create_test_users():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Create admin user
        admin_user = User.query.filter_by(email='admin@alumni.com').first()
        if not admin_user:
            admin_user = User(
                name='Admin User',
                email='admin@alumni.com',
                role='admin'
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            print("Created admin user: admin@alumni.com / admin123")
        
        # Create alumni user
        alumni_user = User.query.filter_by(email='john@alumni.com').first()
        if not alumni_user:
            alumni_user = User(
                name='John Alumni',
                email='john@alumni.com',
                role='alumni'
            )
            alumni_user.set_password('admin123')
            db.session.add(alumni_user)
            db.session.flush()  # Get the ID
            
            # Create alumni profile
            alumni_profile = AlumniProfile(
                user_id=alumni_user.id,
                occupation='Software Engineer',
                company='Tech Corp',
                domain='Computer Science'
            )
            db.session.add(alumni_profile)
            print("Created alumni user: john@alumni.com / admin123")
        
        # Create student user
        student_user = User.query.filter_by(email='jane@student.com').first()
        if not student_user:
            student_user = User(
                name='Jane Student',
                email='jane@student.com',
                role='student'
            )
            student_user.set_password('admin123')
            db.session.add(student_user)
            db.session.flush()  # Get the ID
            
            # Create student profile
            student_profile = StudentProfile(
                user_id=student_user.id,
                cgpa=8.5,
                category='General'
            )
            db.session.add(student_profile)
            print("Created student user: jane@student.com / admin123")
        
        # Commit all changes
        db.session.commit()
        print("All test users created successfully!")

if __name__ == '__main__':
    create_test_users()
