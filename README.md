# EPS Procurement System — React + Spring Boot

## Backend (Java 17 + Spring Boot 3.3)
    cd backend
    mvn spring-boot:run        # starts on http://localhost:8080
Data is seeded in memory (users, requests, suppliers, POs, GRNs, payments, audit logs),
so no database install is needed for the demo.

## Frontend (React + Vite)
    cd front-end
    npm install
    npm run dev                # http://localhost:5173
Set `VITE_API_BASE_URL` in `front-end/.env` if the API runs on another port.

## Demo logins (password: password123)
ravi@company.com (employee) · anand@company.com (manager) · sunita@company.com (senior manager)
vikram@company.com (head) · deepa@company.com (procurement) · lakshmi@company.com (finance) · mohit@company.com (admin)
