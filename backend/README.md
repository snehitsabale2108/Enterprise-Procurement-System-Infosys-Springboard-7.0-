# ProcurementMS Test Backend

FastAPI mock backend for testing the React frontend role-based login flow.

## Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Test accounts

Use any of these emails with password `password123`:

- `employee@demo.local`
- `manager@demo.local`
- `senior.manager@demo.local`
- `head@demo.local`
- `procurement.officer@demo.local`
- `finance@demo.local`
- `admin@demo.local`
- `supplier@demo.local`

## API

- `GET /api/health`
- `GET /api/roles`
- `POST /api/login`
- `GET /api/me`
