# 🤖 AI Code Review Assistant

An intelligent AI-powered system that automatically reviews code changes from GitHub pull requests and commits, providing real-time feedback, issue detection, and improvement suggestions.

---

## 🚀 Overview

The AI Code Review Assistant automates the traditional code review process by integrating with GitHub. It analyzes code changes using an AI model and generates structured feedback directly on pull requests.

This helps developers:

- Improve code quality  
- Detect bugs early  
- Reduce manual review effort  
- Maintain consistency in coding standards  

---

## ✨ Features

- GitHub OAuth authentication  
- Repository and commit browsing  
- Automated pull request analysis  
- AI-generated code review comments  
- Risk score calculation (Low / Medium / High)  
- Issue detection (style, performance, security)  
- Suggestions for code improvement  
- Webhook-based real-time processing  
- Cloud deployment with Render  

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React.js  
- Axios  
- Tailwind CSS  

### 🔹 Backend
- Node.js  
- Express.js  
- GitHub REST API  

### 🔹 AI Integration
- Large Language Model API  

### 🔹 Database
- MongoDB  

### 🔹 Deployment
- Render  
- Ngrok  

---

## ⚙️ System Architecture
Developer → GitHub → Webhook → Backend Server → AI Model → GitHub (Review Comment)


---

## 🔄 Workflow

1. Developer pushes code to GitHub  
2. Pull Request is created or updated  
3. GitHub triggers a webhook event  
4. Backend server receives webhook  
5. Code differences are fetched using GitHub API  
6. AI model analyzes the code  
7. Review and suggestions are generated  
8. Comment is posted on the Pull Request  

---

## 📸 Screenshots

(Add your screenshots here)

---

## 🧪 Testing

The system was tested for:

- GitHub OAuth login  
- Repository fetching  
- Commit retrieval  
- AI review generation  
- Webhook triggering  
- Comment posting on pull requests  

✔ All test cases passed successfully  

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/deepanshiguptaa/AI-Code-Review-Assistant.git
cd AI-Code-Review-Assistant
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create .env file:
```bash
PORT=5000
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_ai_key
MONGO_URI=your_mongodb_uri
```

Run backend:
```bash
npm start
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

## 🔗 Webhook Setup
1. Go to GitHub → Repository → Settings → Webhooks
2. Add webhook:
    https://your-backend-url/api/github/webhook
4. Select:
    Content type: application/json
    Events: Pull Requests

## 🚀 Deployment
### Backend (Render)
    Connect GitHub repo
    Build command: npm install
    Start command: node server.js
    Add environment variables
### Frontend
    Deploy using Vercel / Netlify

## 📊 Performance
Average response time: 5–15 seconds
Detects:
    Code smells
    Security issues
    Performance inefficiencies

## 🌍 Use Cases
Automated code review in teams
CI/CD pipeline integration
Learning tool for beginners
Improving software quality

## 🎯 Future Enhancements
Multi-language support
CI/CD integration
Advanced static analysis
Team collaboration features
Custom review rules 

## 👩‍💻 Author
Deepanshi Gupta