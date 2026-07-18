from flask import Blueprint, jsonify
from models import db, User, Prediction
from sqlalchemy import desc

leaderboard_bp = Blueprint('leaderboard', __name__, url_prefix='/api/leaderboard')

@leaderboard_bp.route('/top', methods=['GET'])
def get_top_users():
    """Get top users by points"""
    top_users = User.query.order_by(desc(User.points)).limit(100).all()
    
    leaderboard = []
    for rank, user in enumerate(top_users, 1):
        leaderboard.append({
            'rank': rank,
            'username': user.username,
            'points': user.points,
            'win_rate': user.get_win_rate(),
            'total_predictions': user.total_predictions,
            'current_streak': user.current_streak
        })
    
    return jsonify({'leaderboard': leaderboard}), 200

@leaderboard_bp.route('/by-category/<category>', methods=['GET'])
def get_leaderboard_by_category(category):
    """Get leaderboard for a specific category"""
    if category not in ['crypto', 'forex', 'sports']:
        return jsonify({'error': 'Invalid category'}), 400
    
    # Get users with their stats for this category
    users = User.query.all()
    user_stats = []
    
    for user in users:
        correct = Prediction.query.filter_by(
            user_id=user.id,
            category=category,
            is_correct=True
        ).count()
        
        total = Prediction.query.filter_by(
            user_id=user.id,
            category=category
        ).count()
        
        if total > 0:
            win_rate = (correct / total) * 100
            user_stats.append({
                'username': user.username,
                'correct': correct,
                'total': total,
                'win_rate': round(win_rate, 2)
            })
    
    # Sort by win rate
    user_stats.sort(key=lambda x: x['win_rate'], reverse=True)
    
    leaderboard = []
    for rank, stat in enumerate(user_stats[:100], 1):
        leaderboard.append({
            'rank': rank,
            **stat
        })
    
    return jsonify({'leaderboard': leaderboard}), 200
