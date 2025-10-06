from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.alumni import alumni_bp
from routes.student import student_bp
from routes.profile import profile_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    
    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app)  
    jwt = JWTManager(app)  
    
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(alumni_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(profile_bp)

    
    @app.route('/api/files/<path:filename>')
    def serve_file(filename):
        from config import Config
        return send_from_directory(Config.UPLOAD_FOLDER, filename, as_attachment=False)
    
    
    with app.app_context():
        db.create_all()
        
        
        from models import User, AlumniProfile, StudentProfile
        admin_user = User.query.filter_by(email='admin@alumni.com').first()
        if not admin_user:
            admin_user = User(
                name='Admin User',
                email='admin@alumni.com',
                role='admin'
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            db.session.commit()
            print("Default admin user created: admin@alumni.com / admin123")
        
      
        alumni_user = User.query.filter_by(email='john@alumni.com').first()
        if not alumni_user:
            alumni_user = User(
                name='John Alumni',
                email='john@alumni.com',
                role='alumni'
            )
            alumni_user.set_password('admin123')
            db.session.add(alumni_user)
            db.session.flush()  
            
           
            alumni_profile = AlumniProfile(
                user_id=alumni_user.id,
                occupation='Software Engineer',
                company='Tech Corp',
                domain='Computer Science'
            )
            db.session.add(alumni_profile)
            db.session.commit()
            print("Test alumni user created: john@alumni.com / admin123")
        
        
        student_user = User.query.filter_by(email='jane@student.com').first()
        if not student_user:
            student_user = User(
                name='Jane Student',
                email='jane@student.com',
                role='student'
            )
            student_user.set_password('admin123')
            db.session.add(student_user)
            db.session.flush()  
            
            
            student_profile = StudentProfile(
                user_id=student_user.id,
                cgpa=8.5,
                category='General'
            )
            db.session.add(student_profile)
            db.session.commit()
            print("Test student user created: jane@student.com / admin123")
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
