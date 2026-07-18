// API Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showMainApp();
        loadUserProfile();
        loadAllData();
    } else {
        showAuthSection();
    }
});

// ==================== Authentication ====================

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab-btn[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}-tab`).classList.add('active');
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            showMainApp();
            loadUserProfile();
            loadAllData();
        } else {
            document.getElementById('login-error').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        document.getElementById('login-error').textContent = 'Error connecting to server';
        console.error('Login error:', error);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (password !== confirm) {
        document.getElementById('register-error').textContent = 'Passwords do not match';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            showMainApp();
            loadUserProfile();
            loadAllData();
        } else {
            document.getElementById('register-error').textContent = data.error || 'Registration failed';
        }
    } catch (error) {
        document.getElementById('register-error').textContent = 'Error connecting to server';
        console.error('Register error:', error);
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('authToken');
    currentUser = null;
    showAuthSection();
}

// ==================== UI Navigation ====================

function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('main-section').style.display = 'none';
}

function showMainApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
}

function switchCategory(category) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.category-section').forEach(section => section.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${category}-section`).classList.add('active');
    
    if (category === 'leaderboard') {
        loadLeaderboard('global');
    } else if (category === 'history') {
        loadPredictionHistory();
    }
}

function switchLeaderboard(type) {
    document.querySelectorAll('.leaderboard-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    loadLeaderboard(type);
}

// ==================== Data Loading ====================

async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        if (response.ok) {
            currentUser = data;
            document.getElementById('user-points').textContent = `${data.stats.points} pts`;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadAllData() {
    loadCryptoData();
    loadForexData();
    loadSportsData();
    loadActivePredictions();
}

async function loadCryptoData() {
    try {
        const response = await fetch(`${API_URL}/data/crypto`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        let html = '';
        
        for (let [symbol, info] of Object.entries(data.crypto)) {
            html += `
                <div class="price-item">
                    <span class="price-item-name">${info.symbol}</span>
                    <span class="price-item-value">$${info.price.toFixed(2)}</span>
                </div>
            `;
        }
        
        document.getElementById('crypto-prices').innerHTML = html;
    } catch (error) {
        console.error('Error loading crypto data:', error);
    }
}

async function loadForexData() {
    try {
        const response = await fetch(`${API_URL}/data/forex`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        let html = '';
        
        for (let [pair, info] of Object.entries(data.forex)) {
            html += `
                <div class="price-item">
                    <span class="price-item-name">${info.symbol}</span>
                    <span class="price-item-value">${info.rate.toFixed(4)}</span>
                </div>
            `;
        }
        
        document.getElementById('forex-rates').innerHTML = html;
    } catch (error) {
        console.error('Error loading forex data:', error);
    }
}

async function loadSportsData() {
    try {
        const response = await fetch(`${API_URL}/data/sports`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        let matchesHtml = '';
        let selectHtml = '<option value="">Select Match</option>';
        
        data.matches.forEach(match => {
            matchesHtml += `
                <div class="match-item">
                    <div class="match-teams">${match.team1} vs ${match.team2}</div>
                    <div class="match-date">${new Date(match.date).toLocaleDateString()}</div>
                </div>
            `;
            selectHtml += `<option value="${match.id}">${match.team1} vs ${match.team2}</option>`;
        });
        
        document.getElementById('sports-matches').innerHTML = matchesHtml;
        document.getElementById('sports-match').innerHTML = selectHtml;
    } catch (error) {
        console.error('Error loading sports data:', error);
    }
}

async function loadActivePredictions() {
    try {
        const response = await fetch(`${API_URL}/predictions/active`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        // Group by category
        const byCategory = { crypto: [], forex: [], sports: [] };
        
        data.predictions.forEach(pred => {
            byCategory[pred.category].push(pred);
        });
        
        // Render each category
        Object.keys(byCategory).forEach(category => {
            const container = document.getElementById(`${category}-predictions`);
            if (byCategory[category].length === 0) {
                container.innerHTML = '<p>No active predictions</p>';
            } else {
                container.innerHTML = byCategory[category].map(pred => renderPrediction(pred)).join('');
            }
        });
    } catch (error) {
        console.error('Error loading predictions:', error);
    }
}

async function loadPredictionHistory() {
    try {
        const response = await fetch(`${API_URL}/predictions/history`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        const container = document.getElementById('history-list');
        
        if (data.predictions.length === 0) {
            container.innerHTML = '<p>No prediction history</p>';
        } else {
            container.innerHTML = data.predictions.map(pred => renderPrediction(pred)).join('');
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

async function loadLeaderboard(type) {
    try {
        let url = `${API_URL}/leaderboard/top`;
        if (type !== 'global') {
            url = `${API_URL}/leaderboard/by-category/${type}`;
        }
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        const tbody = document.getElementById('leaderboard-body');
        
        tbody.innerHTML = data.leaderboard.map(user => `
            <tr>
                <td>${user.rank}</td>
                <td>${user.username}</td>
                <td>${user.points || user.total || 0}</td>
                <td>${user.win_rate}%</td>
                <td>${user.current_streak || user.correct || 0}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// ==================== Prediction Submission ====================

async function handlePrediction(event, category) {
    event.preventDefault();
    
    let payload = {
        category: category
    };
    
    if (category === 'crypto') {
        payload.asset = document.getElementById('crypto-asset').value;
        payload.predicted_value = document.getElementById('crypto-direction').value;
        payload.timeframe = document.getElementById('crypto-timeframe').value;
    } else if (category === 'forex') {
        payload.asset = document.getElementById('forex-pair').value;
        payload.predicted_value = document.getElementById('forex-direction').value;
        payload.timeframe = document.getElementById('forex-timeframe').value;
    } else if (category === 'sports') {
        payload.asset = document.getElementById('sports-match').value;
        payload.predicted_value = document.getElementById('sports-outcome').value;
        payload.timeframe = document.getElementById('sports-timeframe').value;
    }
    
    try {
        const response = await fetch(`${API_URL}/predictions/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Prediction submitted successfully!');
            document.getElementById(`${category}-form`).reset();
            loadActivePredictions();
            loadUserProfile();
        } else {
            alert(data.error || 'Failed to submit prediction');
        }
    } catch (error) {
        console.error('Error submitting prediction:', error);
        alert('Error submitting prediction');
    }
}

// ==================== Utilities ====================

function renderPrediction(pred) {
    const statusClass = pred.is_correct === null ? 'pending' : pred.is_correct ? 'correct' : 'incorrect';
    const statusText = pred.is_correct === null ? 'Pending' : pred.is_correct ? 'Correct ✓' : 'Incorrect ✗';
    
    return `
        <div class="prediction-item">
            <div class="prediction-header">
                <span class="prediction-asset">${pred.asset}</span>
                <span class="prediction-status status-${statusClass}">${statusText}</span>
            </div>
            <div class="prediction-details">
                <div class="detail-item">
                    <span class="detail-label">Prediction:</span>
                    <span>${pred.predicted_value}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Timeframe:</span>
                    <span>${pred.timeframe}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Created:</span>
                    <span>${new Date(pred.created_at).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Points:</span>
                    <span>${pred.points_earned || 0}</span>
                </div>
            </div>
        </div>
    `;
}

function showProfile() {
    if (!currentUser) return;
    
    const profileHtml = `
        <div class="profile-stat">
            <span class="profile-stat-label">Username:</span>
            <span class="profile-stat-value">${currentUser.username}</span>
        </div>
        <div class="profile-stat">
            <span class="profile-stat-label">Email:</span>
            <span class="profile-stat-value">${currentUser.email}</span>
        </div>
        <div class="profile-stat">
            <span class="profile-stat-label">Total Predictions:</span>
            <span class="profile-stat-value">${currentUser.stats.total_predictions}</span>
        </div>
        <div class="profile-stat">
            <span class="profile-stat-label">Correct Predictions:</span>
            <span class="profile-stat-value">${currentUser.stats.correct_predictions}</span>
        </div>
        <div class="profile-stat">
            <span class="profile-stat-label">Win Rate:</span>
            <span class="profile-stat-value">${currentUser.stats.win_rate}%</span>
        </div>
        <div class="profile-stat">
            <span class="profile-stat-label">Points:</span>
            <span class="profile-stat-value">${currentUser.stats.points}</span>
        </div>
        <div class="profile-stat">
            <span class="profile-stat-label">Current Streak:</span>
            <span class="profile-stat-value">${currentUser.stats.current_streak}</span>
        </div>
        <div class="profile-stat">
            <span class="profile-stat-label">Longest Streak:</span>
            <span class="profile-stat-value">${currentUser.stats.longest_streak}</span>
        </div>
    `;
    
    document.getElementById('profile-info').innerHTML = profileHtml;
    document.getElementById('profile-modal').style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profile-modal').style.display = 'none';
}

// Refresh data periodically
setInterval(() => {
    if (authToken) {
        loadAllData();
        loadUserProfile();
    }
}, 30000); // Refresh every 30 seconds
