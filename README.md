# Travlr Getaways

A full-stack travel management application with a customer-facing travel site and a protected admin dashboard.

Visitors can browse available vacation packages and view trip details. Authorized admins can log in to add, edit, and delete trip listings.

## Built With

- Angular and TypeScript
- Node.js and Express
- MongoDB and Mongoose
- Handlebars
- Bootstrap
- JWT authentication
- REST APIs

## Features

- Browse and view travel packages
- Retrieve trip data from MongoDB through a REST API
- Admin login with JWT authentication
- Create, update, and delete trip listings
- Shared trip data between the customer site and Angular admin dashboard

## Running Locally

MongoDB must be running locally.

```bash
npm install
npm start
```

The customer site runs at:

```text
http://localhost:3000
```

In a second terminal:

```bash
cd travlr-admin
npm install
npm start
```

The admin dashboard runs at:

```text
http://localhost:4200
```

Create a `.env` file in the root folder:

```env
JWT_SECRET=your-local-secret
MONGODB_URI=mongodb://127.0.0.1:27017/travlr
```

## Project Highlights

This project strengthened my experience connecting multiple frontend interfaces to one backend API, working with MongoDB data, building CRUD functionality, and protecting administrative actions with JWT authentication.
