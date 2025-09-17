# EduPay Server 
## School Fee Payment Management System

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express, mongoDB, webhooks

### Overview

This project is a backend system built on the MERN stack to help trustees and administrators handle school fee payments.
It integrates with an external payment gateway to generate payment requests, track real-time transaction updates, and manage schools, students, and transactions securely.

## Core Highlights

- Secure login & signup for trustees and admins.

- Register and manage schools under each trustee.

- Generate fee collection requests for students.

- Track payment status (Pending / Success / Failed) with live updates.

- Webhook support to automatically update final payment results.

- Dashboard APIs to analyze transactions and collections.



## Installation

### Project Setup

#### Prerequisites
- Node.js
- npm 
- MongoDB

### Install my-project with npm
#### Frontend
  - git clone https://github.com/SrikanthKamalla/Edviron-Client
  - cd edupay
  - npm i
  - npm run dev

#### Backend
 - git clone https://github.com/SrikanthKamalla/Edviron-Server
  - cd edupay
  - npm i
  - npm run dev


## Environment Variables
#### Frontend
```
  VITE_API_URL ->your backend url 
```
#### Backend
```
  PORT
  MONGODB_URI
  JWT_SECRET_KEY
  FRONTEND_URL
  CALLBACK_URL
  SCHOOL_ID
  PG_SECRET
  API_KEY
  PG_URL
```

## Database Models (MongoDB + Mongoose)
```
1. User Model (user.model.js)

Fields: name, email, password (encrypted), role (admin/trustee).

Uses bcrypt for password hashing.

Each user can own/manage multiple schools and their transactions.

2. School Model (school.model.js)

Fields: name, email, gateway_id, user_id (ref User).

Linked with the trustee who created it.

Represents each institution where fees are collected.

3. Order Model (order.model.js)

Fields: school_id, trustee_id, student_info {id, name, email}, gateway_name.

Stores a single fee collection request.

Connects with OrderStatus for transaction details.

4. OrderStatus Model (orderStatus.model.js)

Fields: collect_id (ref Order), collect_request_id, order_amount, transaction_amount,
status (Pending/Success/Failed), payment_mode, bank_reference,
payment_message, error_message, payment_time.

Monitors the full lifecycle of a transaction.

Continuously updated via gateway APIs and webhook notifications.

```

## Controllers
### User Controller (user.controller.js)

- POST /api/users/signup → Register user & issue JWT.

- POST /api/users/login → Authenticate & return JWT.

### School Controller (school.controller.js)

- GET /api/schools → Fetch schools created by logged-in trustee.

### Payment Controller (payment.controller.js)

- POST /api/payments/create → Create payment request, store Order + OrderStatus, return gateway link.

- GET /api/payments/status/:collect_request_id → Get/update status from gateway.

### Webhook Controller (webhook.controller.js)

- POST /api/webhook/payment → Payment gateway callback to finalize transaction result.

### Transactions Controller (transactions.controller.js)

- GET /api/transactions → List all transactions of trustee (with filters).

- GET /api/transactions/school/:schoolId → Get transactions of a specific school.

- GET /api/transactions/:custom_order_id/status → Fetch single transaction status.

## Workflow

Authentication → Trustees/Admins sign up or log in using JWT.

School Management → Trustees register/manage their schools.

Payment Creation → Trustee/parent initiates payment → Order & OrderStatus created → Redirected to gateway.

Webhook Handling → Gateway confirms payment → Server updates OrderStatus.

Transaction Insights → Trustees retrieve reports & statuses via transaction APIs.
