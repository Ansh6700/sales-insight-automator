# 📊 Sales Insight Automator — Rabbitt AI

An AI-powered tool that analyzes sales CSV/Excel files and delivers 
executive summaries directly to your inbox.

## 🚀 Live Demo
- **Frontend:** https://sales-insight-automator.vercel.app
- **API Docs (Swagger):** https://sales-insight-backend.onrender.com/docs

## 🛠️ Tech Stack
- **Frontend:** Next.js + Tailwind CSS → Vercel
- **Backend:** FastAPI + Python → Render
- **AI Engine:** Groq (Llama 3.3 70B)
- **Email:** Resend
- **CI/CD:** GitHub Actions

## ⚙️ Run Locally with Docker
```bash
# Clone the repo
git clone https://github.com/Ansh6700/sales-insight-automator.git
cd sales-insight-automator

# Copy env file and fill in your keys
cp .env.example .env

# Start everything
docker compose up --build
```
Then open http://localhost:3000

## 🔒 Security Measures
- ✅ Rate Limiting — 5 requests/min per IP via slowapi
- ✅ CORS Whitelist — Only frontend origin allowed
- ✅ File Type Guard — Only .csv / .xlsx accepted
- ✅ File Size Limit — Max 5MB enforced server-side
- ✅ Input Validation — Email & file validated before processing
- ✅ No API Keys exposed — All secrets via environment variables

## 🔑 Environment Variables
See `.env.example` for all required keys:
```env
GROQ_API_KEY=           # Groq LLM API key
RESEND_API_KEY=         # Resend email API key
ALLOWED_ORIGIN=         # Frontend URL (CORS)
NEXT_PUBLIC_API_URL=    # Backend URL
```

## 📁 Project Structure
```
sales-insight-automator/
├── backend/            # FastAPI app
│   ├── main.py
│   ├── routers/
│   └── services/
├── frontend/           # Next.js app
│   └── app/
├── .github/workflows/  # CI/CD
├── docker-compose.yml
└── .env.example
```