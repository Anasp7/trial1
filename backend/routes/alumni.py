from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Opportunity, Application, AlumniProfile
from datetime import datetime
from utils.file_utils import save_uploaded_file, delete_file

alumni_bp = Blueprint('alumni', __name__, url_prefix='/api/alumni')

def alumni_required(f):
    """Decorator to require alumni role"""
    def decorated_function(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'alumni':
            return jsonify({'error': 'Alumni access required'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@alumni_bp.route('/opportunities', methods=['GET'])
@jwt_required()
@alumni_required
def get_my_opportunities():
    try:
        user_id = int(get_jwt_identity())
        opportunities = Opportunity.query.filter_by(alumni_id=user_id).all()
        
        return jsonify({
            'opportunities': [opp.to_dict() for opp in opportunities]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@alumni_bp.route('/opportunities', methods=['POST'])
@jwt_required()
@alumni_required
def create_opportunity():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['type', 'title', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate type
        if data['type'] not in ['internship', 'scholarship', 'mentorship', 'success_story']:
            return jsonify({'error': 'Invalid opportunity type'}), 400
        
        user_id = int(get_jwt_identity())
        
        opportunity = Opportunity(
            alumni_id=user_id,
            type=data['type'],
            title=data['title'],
            description=data['description'],
            min_cgpa=data.get('min_cgpa'),
            category=data.get('category'),
            company=data.get('company'),
            location=data.get('location'),
            duration=data.get('duration'),
            stipend=data.get('stipend'),
            requirements=data.get('requirements')
        )

        # Parse deadline string (YYYY-MM-DD) to date
        if data.get('deadline'):
            try:
                opportunity.deadline = datetime.strptime(data['deadline'], "%Y-%m-%d").date()
            except Exception:
                return jsonify({'error': 'Invalid deadline format. Use YYYY-MM-DD.'}), 400
        else:
            opportunity.deadline = None
        
        db.session.add(opportunity)
        db.session.commit()
        
        return jsonify({
            'message': 'Opportunity created successfully',
            'opportunity': opportunity.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@alumni_bp.route('/opportunities/<int:opportunity_id>', methods=['PUT'])
@jwt_required()
@alumni_required
def update_opportunity(opportunity_id):
    try:
        user_id = int(get_jwt_identity())
        opportunity = Opportunity.query.filter_by(id=opportunity_id, alumni_id=user_id).first()
        
        if not opportunity:
            return jsonify({'error': 'Opportunity not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            opportunity.title = data['title']
        if 'description' in data:
            opportunity.description = data['description']
        if 'min_cgpa' in data:
            opportunity.min_cgpa = data['min_cgpa']
        if 'category' in data:
            opportunity.category = data['category']
        if 'company' in data:
            opportunity.company = data['company']
        if 'location' in data:
            opportunity.location = data['location']
        if 'duration' in data:
            opportunity.duration = data['duration']
        if 'stipend' in data:
            opportunity.stipend = data['stipend']
        if 'requirements' in data:
            opportunity.requirements = data['requirements']
        if 'deadline' in data:
            if data['deadline']:
                try:
                    opportunity.deadline = datetime.strptime(data['deadline'], "%Y-%m-%d").date()
                except Exception:
                    return jsonify({'error': 'Invalid deadline format. Use YYYY-MM-DD.'}), 400
            else:
                opportunity.deadline = None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Opportunity updated successfully',
            'opportunity': opportunity.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@alumni_bp.route('/opportunities/<int:opportunity_id>', methods=['DELETE'])
@jwt_required()
@alumni_required
def delete_opportunity(opportunity_id):
    try:
        user_id = int(get_jwt_identity())
        opportunity = Opportunity.query.filter_by(id=opportunity_id, alumni_id=user_id).first()
        
        if not opportunity:
            return jsonify({'error': 'Opportunity not found'}), 404
        
        db.session.delete(opportunity)
        db.session.commit()
        
        return jsonify({'message': 'Opportunity deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@alumni_bp.route('/applications', methods=['GET'])
@jwt_required()
@alumni_required
def get_applications():
    try:
        user_id = int(get_jwt_identity())
        
        # Get applications for opportunities created by this alumni
        applications = db.session.query(Application).join(Opportunity).filter(
            Opportunity.alumni_id == user_id
        ).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@alumni_bp.route('/applications/<int:application_id>/status', methods=['PUT'])
@jwt_required()
@alumni_required
def update_application_status(application_id):
    try:
        user_id = int(get_jwt_identity())
        
        # Find application for opportunities created by this alumni
        application = db.session.query(Application).join(Opportunity).filter(
            Application.id == application_id,
            Opportunity.alumni_id == user_id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'accepted', 'declined']:
            return jsonify({'error': 'Invalid status'}), 400
        
        application.status = new_status
        db.session.commit()
        
        return jsonify({
            'message': 'Application status updated successfully',
            'application': application.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@alumni_bp.route('/profile', methods=['GET'])
@jwt_required()
@alumni_required
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.alumni_profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        profile_data = user.alumni_profile.to_dict()
        profile_data['user'] = user.to_dict()
        
        return jsonify({'profile': profile_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@alumni_bp.route('/profile', methods=['PUT'])
@jwt_required()
@alumni_required
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
        
        # Update or create alumni profile
        if not user.alumni_profile:
            profile = AlumniProfile(user_id=user_id)
            db.session.add(profile)
            db.session.flush()  # Get the ID
        
        profile = user.alumni_profile
        
        if 'occupation' in data:
            profile.occupation = data['occupation']
        if 'company' in data:
            profile.company = data['company']
        if 'domain' in data:
            profile.domain = data['domain']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
