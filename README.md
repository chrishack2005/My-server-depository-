# 🎯 PredictHub

A prediction app where users forecast outcomes across three markets — **crypto prices**, **forex currency pairs**, and **sports match results** — then track their accuracy over time and compete on a leaderboard.

## Features

✅ **Live Data Feeds** - Real-time prices for crypto, forex, and sports  
✅ **Prediction Submission** - Make predictions that lock once submitted  
✅ **Automatic Resolution** - Background job auto-resolves predictions  
✅ **Points-Based Scoring** - Earn points for correct predictions  
✅ **Community Leaderboard** - Compete with other predictors  
✅ **User Profiles** - Track your stats, win rate, and streaks  
✅ **Category Tabs** - Switch between Crypto / Forex / Sports  

---

## Project Structure

```
my-web-server/
├── app.py                 # Main Flask application
├── config.py              # Configuration settings
├── models.py              # Database models (User, Prediction)
├── scheduler.py           # Background job for resolving predictions
├── requirements.txt       # Python dependencies
├── routes/
│   ├── auth.py           # Authentication routes (login, register)
│   ├── predictions.py    # Prediction routes
│   ├── leaderboard.py    # Leaderboard routes
│   └── data.py           # Market data routes
└── frontend/
    ├── index.html        # Main HTML page
    ├── styles.css        # CSS styling
    └── app.js            # JavaScript logic
```

---

## Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/chrishack2005/My-server-depository-.git
cd My-server-depository-
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Backend Server
```bash
python app.py
```

The server will start on `http://localhost:5000`

### 4. Open the Frontend
Open `frontend/index.html` in your browser or use a local server:

```bash
# Using Python 3
python -m http.server 8000 --directory frontend

# Then visit: http://localhost:8000
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Predictions
- `POST /api/predictions/submit` - Submit a prediction
- `GET /api/predictions/active` - Get active predictions
- `GET /api/predictions/history` - Get prediction history
- `GET /api/predictions/<id>` - Get specific prediction

### Leaderboard
- `GET /api/leaderboard/top` - Top users by points
- `GET /api/leaderboard/by-category/<category>` - Top users in a category

### Market Data
- `GET /api/data/crypto` - Get crypto prices
- `GET /api/data/forex` - Get forex rates
- `GET /api/data/sports` - Get upcoming sports matches

### Health
- `GET /api/health` - Health check
- `GET /api` - Welcome endpoint

---

## How It Works

### 1. User Registration & Login
- Users create an account with username, email, and password
- JWT tokens are issued for authentication

### 2. Making Predictions
- Select a market (Crypto/Forex/Sports)
- Choose an asset and prediction direction
- Set a timeframe (1h, 24h, 7d)
- Submit prediction (locked once submitted, cannot edit)

### 3. Automatic Resolution
- Background scheduler checks predictions every minute
- When prediction expires, system compares predicted vs actual value
- Points awarded for correct predictions
- User stats updated (win rate, streaks, points)

### 4. Leaderboard
- Global leaderboard sorted by points
- Category-specific leaderboards sorted by win rate
- Real-time ranking updates

---

## Database Models

### User Model
```python
- id: Integer (Primary Key)
- username: String (Unique)
- email: String (Unique)
- password_hash: String
- total_predictions: Integer
- correct_predictions: Integer
- points: Integer
- current_streak: Integer
- longest_streak: Integer
- created_at: DateTime
```

### Prediction Model
```python
- id: Integer (Primary Key)
- user_id: Integer (Foreign Key)
- category: String (crypto/forex/sports)
- asset: String
- predicted_value: String
- timeframe: String
- created_at: DateTime
- expires_at: DateTime
- resolved_at: DateTime
- actual_value: String
- is_correct: Boolean
- points_earned: Integer
```

---

## Configuration

Edit `config.py` to customize:

```python
SQLALCHEMY_DATABASE_URI  # Database URL
JWT_SECRET_KEY           # Secret key for JWT tokens
JWT_ACCESS_TOKEN_EXPIRES # Token expiration time
DEBUG                    # Debug mode
```

### Environment Variables
Create a `.env` file:

```
DATABASE_URL=sqlite:///predicthub.db
JWT_SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

---

## Prediction Scoring

- **Correct Prediction**: +10 points, +1 streak
- **Incorrect Prediction**: 0 points, streak resets
- **Win Rate**: (Correct / Total) * 100

---

## External APIs (To Integrate)

Replace mock data in `routes/data.py` with real APIs:

### Crypto
- **CoinGecko API**: https://api.coingecko.com
- **Binance API**: https://api.binance.com

### Forex
- **Twelve Data**: https://twelvedata.com
- **Alpha Vantage**: https://www.alphavantage.co

### Sports
- **API-Football**: https://www.api-football.com
- **SportRadar**: https://developer.sportradar.com

---

## Deployment

### Deploy Backend (Heroku)
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Netlify)
```bash
# Build and deploy frontend folder
netlify deploy --prod --dir frontend
```

---

## Troubleshooting

**"Cannot connect to API"**
- Make sure backend is running on `http://localhost:5000`
- Check CORS is enabled in `app.py`

**"Database not found"**
- Database is auto-created on first run
- Check file permissions in the directory

**"Token expired"**
- Token expires after 30 days
- User needs to login again

---

## Future Enhancements

- [ ] Connect to real market data APIs
- [ ] User notifications for predictions resolved
- [ ] Advanced prediction analytics
- [ ] Social features (follow users, comments)
- [ ] Mobile app
- [ ] Real-time WebSocket updates
- [ ] Premium features

---

## License

MIT License - Feel free to use this project!

---

## Support

For issues or questions, open a GitHub issue or contact the maintainer.

---

**Made with 💜 by PredictHub Team**
