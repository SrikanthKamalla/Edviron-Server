# EduPay Server

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express, mongoDB, webhooks



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
## Endpoints 
  - USER_SIGNUP: "/auth/signUp"
  - USER_LOGIN: "/auth/login"
  - CREATE_PAYMENT: "/payment/createPayment"
  - GET_SCHOOLS: "schools"
  - PAYMENT_STATUS: (id, school_id) =>
    `/payment/createPayment/${id}?school_id=${school_id}`,

  - GET_TRANSACTIONS: "/transactions"

  - GET_TRANSACTION_BY_SCHOOL: (school_id) => `/transactions/school/${school_id}`

  - GET_TRANSACTION_STATUS: (id) => `/payment/status/${id}`
  
