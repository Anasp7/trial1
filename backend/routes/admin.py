from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, AlumniProfile, StudentProfile

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(f):
    """Decorator to require admin role"""
    def decorated_function(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    try:
        users = User.query.all()
        users_data = []
        
        for user in users:
            user_data = user.to_dict()
            
            # Add profile data
            if user.role == 'alumni' and user.alumni_profile:
                user_data['profile'] = user.alumni_profile.to_dict()
            elif user.role == 'student' and user.student_profile:
                user_data['profile'] = user.student_profile.to_dict()
            
            users_data.append(user_data)
        
        return jsonify({'users': users_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Don't allow admin to delete themselves
        current_user_id = get_jwt_identity()
        if user_id == current_user_id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_stats():
    try:
        total_users = User.query.count()
        admin_count = User.query.filter_by(role='admin').count()
        alumni_count = User.query.filter_by(role='alumni').count()
        student_count = User.query.filter_by(role='student').count()
        
        return jsonify({
            'total_users': total_users,
            'admin_count': admin_count,
            'alumni_count': alumni_count,
            'student_count': student_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
