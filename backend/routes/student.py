from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Opportunity, Application, StudentProfile
from utils.file_utils import save_uploaded_file, delete_file

student_bp = Blueprint('student', __name__, url_prefix='/api/student')

def student_required(f):
    """Decorator to require student role"""
    def decorated_function(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@student_bp.route('/opportunities', methods=['GET'])
@jwt_required()
@student_required
def get_opportunities():
    try:
        # Get query parameters for filtering
        opp_type = request.args.get('type')
        category = request.args.get('category')
        min_cgpa = request.args.get('min_cgpa', type=float)
        
        # Build query
        query = Opportunity.query
        
        if opp_type:
            query = query.filter_by(type=opp_type)
        if category:
            query = query.filter_by(category=category)
        if min_cgpa is not None:
            query = query.filter(Opportunity.min_cgpa <= min_cgpa)
        
        opportunities = query.all()
        
        return jsonify({
            'opportunities': [opp.to_dict() for opp in opportunities]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/opportunities/<int:opportunity_id>/apply', methods=['POST'])
@jwt_required()
@student_required
def apply_to_opportunity(opportunity_id):
    try:
        user_id = int(get_jwt_identity())
        
        # Check if opportunity exists
        opportunity = Opportunity.query.get(opportunity_id)
        if not opportunity:
            return jsonify({'error': 'Opportunity not found'}), 404
        
        # Check if student already applied
        existing_application = Application.query.filter_by(
            student_id=user_id,
            opportunity_id=opportunity_id
        ).first()
        
        if existing_application:
            return jsonify({'error': 'You have already applied to this opportunity'}), 400
        
        # Check CGPA requirement
        student = User.query.get(user_id)
        if student.student_profile and student.student_profile.cgpa:
            if opportunity.min_cgpa and student.student_profile.cgpa < opportunity.min_cgpa:
                return jsonify({'error': 'Your CGPA does not meet the minimum requirement'}), 400
        
        # Handle file upload
        resume_file = None
        if 'resume' in request.files:
            file = request.files['resume']
            if file.filename:
                resume_file = save_uploaded_file(file)
                if not resume_file:
                    return jsonify({'error': 'Invalid file format. Only PDF, DOC, DOCX allowed'}), 400
        
        # Create application
        application = Application(
            student_id=user_id,
            opportunity_id=opportunity_id,
            resume_file=resume_file
        )
        
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications', methods=['GET'])
@jwt_required()
@student_required
def get_my_applications():
    try:
        user_id = int(get_jwt_identity())
        applications = Application.query.filter_by(student_id=user_id).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications/<int:application_id>', methods=['DELETE'])
@jwt_required()
@student_required
def withdraw_application(application_id):
    try:
        user_id = int(get_jwt_identity())
        application = Application.query.filter_by(
            id=application_id,
            student_id=user_id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Only allow withdrawal if status is pending
        if application.status != 'pending':
            return jsonify({'error': 'Cannot withdraw application that has been processed'}), 400
        
        # Delete resume file if exists
        if application.resume_file:
            delete_file(application.resume_file)
        
        db.session.delete(application)
        db.session.commit()
        
        return jsonify({'message': 'Application withdrawn successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
@student_required
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.student_profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        profile_data = user.student_profile.to_dict()
        profile_data['user'] = user.to_dict()
        
        return jsonify({'profile': profile_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/profile', methods=['PUT'])
@jwt_required()
@student_required
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update user data
        if 'name' in data:
            user.name = data['name']
        
        # Update or create student profile
        if not user.student_profile:
            profile = StudentProfile(user_id=user_id)
            db.session.add(profile)
            db.session.flush()  # Get the ID
        
        profile = user.student_profile
        
        if 'cgpa' in data:
            profile.cgpa = data['cgpa']
        if 'category' in data:
            profile.category = data['category']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
