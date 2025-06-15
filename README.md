# 🚀 backend-employee

A RESTful API for managing employees built with NestJS, TypeScript, Prisma, and PostgreSQL. Designed to be robust, scalable, and easy to maintain.

---

## 📋 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Setup & Installation](#setup--installation)  
- [Environment Variables](#environment-variables)  
- [Database & Migrations](#database--migrations)  
- [Running the App](#running-the-app)  
- [Testing](#testing)  
- [File Uploads](#file-uploads)  
- [Linting & Formatting](#linting--formatting)  
- [Project Structure](#project-structure)  
- [API Endpoints](#api-endpoints)  
- [Contribution](#contribution)  
- [License](#license)

---

## ✨ Features

Backend Employee API is developed using the NestJS framework with TypeScript and leverages Prisma for database operations. It provides endpoints for:

- User authentication (login)
- Employee attendance (check-in and check-out)
- Submission of overtime requests
- Reimbursement claims with file uploads
- Payroll runs and payslip generation
- Administrative actions for running payroll

The application also integrates middleware for validation, caching, and file uploads and comes with full API documentation powered by Swagger. This project has been set up with a modular design, including dedicated controllers, services, and data transfer objects (DTOs) following NestJS best practices.

---

## 🧰 Tech Stack

- **NestJS** – Framework for scalable server-side apps  
- **TypeScript** – Strictly typed JavaScript  
- **Prisma** – Modern ORM for database interactions  
- **PostgreSQL** – Relational database  
- **Jest** – Testing framework  
- **ESLint + Prettier** – Code linting and formatting

---

## ✅ Prerequisites

- Node.js ≥ 16.x  
- PostgreSQL  
- Yarn or npm  

---

## 🔧 Setup & Installation

1. **Clone the repo**  
   ```bash
   $ git clone https://github.com/iwansuryaningrat/backend-employee.git
   $ cd backend-employee
   ```
2. Install dependencies
   ```bash
   $ yarn install
   $ or npm install
   ```
3. Copy and configure env
   ```bash
   $ cp .env.example .env
   ```
   Update the `.env` with your database credentials and desired config.

---
## 🗄 Database & Migrations

This project uses **Prisma** for schema and database management.

### Apply Migrations
  ```bash
  $ npx prisma migrate dev --name init
  ```
### Seed Initial Data
  ```bash
  $ npm run db:seed
  ```

### Generate Prisma Client
  ```bash
  $ npx prisma generate
  ```

---
## ▶️ Running the App
```bash
# One-step development setup (installs dependencies, checks database, runs migrations)
$ npm run setup

# Or do the steps manually:

# Install dependencies
$ npm install

# Run database migrations
$ npm run migration:run

# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

---
## 🧪 Testing

This project includes comprehensive test coverage with both unit tests and integration tests.

```bash
# Run all tests (unit tests, coverage, and e2e tests)
$ ./scripts/run-tests.sh

# Run only unit tests
$ npm run test

# Run tests with coverage report
$ npm run test:cov

# Run e2e tests
$ npm run test:e2e
```

For detailed information about the testing approach, see [TESTING.md](TESTING.md).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).