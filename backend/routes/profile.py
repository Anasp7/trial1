from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, User, AlumniProfile, StudentProfile

profile_bp = Blueprint('profile', __name__, url_prefix='/api')

@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_type = request.args.get('type')
        user_id = request.args.get('id', type=int)
        if user_type not in ['alumni', 'student'] or not user_id:
            return jsonify({'error': 'Invalid parameters'}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        if user_type == 'alumni':
            if not user.alumni_profile:
                # Create an empty profile for robustness
                profile = AlumniProfile(user_id=user_id)
                db.session.add(profile)
                db.session.commit()
            profile = user.alumni_profile
            data = {
                'id': profile.id if profile else None,
                'user_id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': profile.phone if profile else None,
                'location': profile.location if profile else None,
                'bio': profile.bio if profile else None,
                'linkedIn': profile.linkedin if profile else None,
                'github': profile.github if profile else None,
                'profile_pic': profile.profile_pic if profile else None,
                'occupation': profile.occupation if profile else None,
                'company': profile.company if profile else None,
                'workingDomain': getattr(profile, 'domain', None) if profile else None,
            }
        else:
            if not user.student_profile:
                profile = StudentProfile(user_id=user_id)
                db.session.add(profile)
                db.session.commit()
            profile = user.student_profile
            data = {
                'id': profile.id if profile else None,
                'user_id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': profile.phone if profile else None,
                'location': profile.location if profile else None,
                'bio': profile.bio if profile else None,
                'linkedIn': profile.linkedin if profile else None,
                'github': profile.github if profile else None,
                'profile_pic': profile.profile_pic if profile else None,
                'cgpa': profile.cgpa if profile else None,
                'category': profile.category if profile else None,
            }

        return jsonify({'profile': data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_type = request.args.get('type')
        user_id = request.args.get('id', type=int)
        if user_type not in ['alumni', 'student'] or not user_id:
            return jsonify({'error': 'Invalid parameters'}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json() or {}

        # Update core user fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']

        if user_type == 'alumni':
            if not user.alumni_profile:
                user.alumni_profile = AlumniProfile(user_id=user_id)
            profile = user.alumni_profile
            # Common profile fields
            if 'phone' in data:
                profile.phone = data['phone']
            if 'location' in data:
                profile.location = data['location']
            if 'bio' in data:
                profile.bio = data['bio']
            if 'linkedIn' in data:
                profile.linkedin = data['linkedIn']
            if 'github' in data:
                profile.github = data['github']
            if 'profile_pic' in data:
                profile.profile_pic = data['profile_pic']
            if 'occupation' in data:
                profile.occupation = data['occupation']
            if 'company' in data:
                profile.company = data['company']
            if 'workingDomain' in data:
                setattr(profile, 'domain', data['workingDomain'])
        else:
            if not user.student_profile:
                user.student_profile = StudentProfile(user_id=user_id)
            profile = user.student_profile
            # Common profile fields
            if 'phone' in data:
                profile.phone = data['phone']
            if 'location' in data:
                profile.location = data['location']
            if 'bio' in data:
                profile.bio = data['bio']
            if 'linkedIn' in data:
                profile.linkedin = data['linkedIn']
            if 'github' in data:
                profile.github = data['github']
            if 'profile_pic' in data:
                profile.profile_pic = data['profile_pic']
            if 'cgpa' in data:
                profile.cgpa = data['cgpa']
            if 'category' in data:
                profile.category = data['category']

        db.session.commit()

        # Re-hydrate response from DB to ensure persisted values are returned
        refreshed = user.alumni_profile if user_type == 'alumni' else user.student_profile
        resp = {
            'id': getattr(refreshed, 'id', None),
            'user_id': user.id,
            'name': user.name,
            'email': user.email,
        }
        if user_type == 'alumni':
            resp.update({
                'phone': refreshed.phone,
                'location': refreshed.location,
                'bio': refreshed.bio,
                'linkedIn': refreshed.linkedin,
                'github': refreshed.github,
                'profile_pic': refreshed.profile_pic,
                'occupation': refreshed.occupation,
                'company': refreshed.company,
                'workingDomain': getattr(refreshed, 'domain', None),
            })
        else:
            resp.update({
                'phone': refreshed.phone,
                'location': refreshed.location,
                'bio': refreshed.bio,
                'linkedIn': refreshed.linkedin,
                'github': refreshed.github,
                'profile_pic': refreshed.profile_pic,
                'cgpa': refreshed.cgpa,
                'category': refreshed.category,
            })

        return jsonify({'profile': resp}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


