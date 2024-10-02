# ETAP Learning Management System

## Overview

ETAP Learning Management System is a web application for managing subjects, topics, and learning progress for an online educational platform.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)

## Setup

### Prerequisites

- Node.js and npm installed
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>

   ```

2. Install the dependencies:

   ```bash
   npm install


   ```

3. Set up environment variables. Create a .env file in the root directory and add the following variables:

   ```bash
   # Server configuration
   PORT=3000
   NODE_ENV=local

   # Database configuration
   DATABASE_URL=<Your PostgreSQL URL>
   DB_USERNAME=<Your PostgreSQL USER>
   DB_PASSWORD=<Your PostgreSQL PASSWORD>
   DB_HOST=<Your PostgreSQL HOST>
   DB_PORT=<Your PostgreSQL PORT>

   # JWT configuration
   JWT_SECRET_KEY=<Your JWT Secret>
   JWT_EXPIRATION=<Your JWT Expiration Time>
   REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
   REFRESH_TOKEN_EXPIRATION=<Your Refresh Token Expiration Time>


   # API Key
   API_KEY=<Your API Key>

   # AWS configuration
   AWS_ACCESS_KEY=<Your AWS Access Key>
   AWS_SECRET_KEY=<Your AWS Secret Key>
   AWS_REGION=<Your AWS Region>
   SQS_QUEUE_URL=<Your SQS Queue URL>
   SES_REPLY_TO_EMAIL=<Your SES Reply-To Email>
   SES_SENDER_NAME=<Your SES Sender Name>
   SES_SOURCE_EMAIL=<Your SES Source Email>

   # Server URLs
   LOCAL_SERVER_URL=http://localhost:3000/api/v1
   PRODUCTION_SERVER_URL=https://api.divestbookstore.com/api/v1


   ```

4. Start the Server

   ```bash
    npm run local

   ```

5. API Documentation

   You can view the API documentation by navigating to http://localhost:3000/api/v1/api-docs.

## Usage

### Authentication

- POST /auth/login - Login a user
- POST /auth/register - Register a new user
- POST /auth/change-password - Change user password
- POST /auth/validate-token - Validate token

### Subjects

- POST /subjects - Create a new subject
- GET /subjects - Get all subjects
- GET /subjects/:slug - Get subject by slug
- PUT /subjects/:slug - Update subject
- DELETE /subjects/:slug - Delete subject
- GET /subjects/:slug/topics - Get subject topics
- GET /subjects/:slug/ranked-learners - Get ranked learners for a subject

### Topics

- POST /topics - Create a new topic
- GET /topics/:slug - Get topic by slug
- PUT /topics/:slug - Update topic
- DELETE /topics/:slug - Delete topic
- POST /topics/:slug/complete - Mark topic as completed
- GET /topics/:slug/completion-status - Get topic completion status
- GET /topics/:slug/leaderboard - Get topic leaderboard

### Learning Progress

- GET /progress/user-progress - Get user progress

## API Documentation

### Swagger Doc

- You can view the API documentation by navigating to http://localhost:3000/api/v1/api-docs after starting the server.

## Scripts

### Install Dependencies

    ```bash
    npm install

    ```

### Test

    ```bash
    npm run test

    ```

### Start

    ```bash
    npm run local

    ```
