from apscheduler.schedulers.background import BackgroundScheduler
from models import db, Prediction, User
from datetime import datetime

def resolve_expired_predictions():
    """Background job to resolve predictions that have expired"""
    print(f"[{datetime.utcnow()}] Running prediction resolution job...")
    
    # Find all unresolved predictions that have expired
    expired_predictions = Prediction.query.filter(
        Prediction.is_correct == None,
        Prediction.expires_at <= datetime.utcnow()
    ).all()
    
    print(f"Found {len(expired_predictions)} expired predictions to resolve")
    
    for prediction in expired_predictions:
        resolve_prediction(prediction)
    
    db.session.commit()
    print("Prediction resolution job completed")

def resolve_prediction(prediction):
    """Resolve a single prediction"""
    # Simulate prediction resolution
    # In production, compare predicted_value with actual market data
    
    # For demo: randomly mark as correct or incorrect (50/50)
    import random
    is_correct = random.choice([True, False])
    
    prediction.is_correct = is_correct
    prediction.actual_value = "Market data here"
    prediction.resolved_at = datetime.utcnow()
    
    # Award points if correct
    if is_correct:
        prediction.points_earned = 10
        user = prediction.user
        user.correct_predictions += 1
        user.points += 10
        user.current_streak += 1
        
        if user.current_streak > user.longest_streak:
            user.longest_streak = user.current_streak
    else:
        user = prediction.user
        user.current_streak = 0
    
    user.total_predictions += 1

def start_scheduler(app):
    """Start the background scheduler"""
    scheduler = BackgroundScheduler()
    
    # Run prediction resolution every 1 minute (change to desired interval)
    scheduler.add_job(
        func=resolve_expired_predictions,
        trigger="interval",
        minutes=1,
        id="resolve_predictions"
    )
    
    scheduler.start()
    print("Scheduler started")
    return scheduler
