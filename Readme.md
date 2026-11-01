# Finland Cybersecurity Assistant

A cybersecurity assistance platform built using React, Node.js,
Google Dialogflow ES and Firebase.

The application provides intent-based cybersecurity guidance,
incident reporting, and an administrator dashboard for managing
submitted incidents.

## Features

- Dialogflow ES-powered cybersecurity chatbot
- Predefined cybersecurity intents and responses
- Firebase Authentication
- Email verification
- Role-based access for users and administrators
- Cybersecurity incident reporting
- Cloud Firestore incident storage
- Incident search and status management
- Live dashboard statistics
- Protected backend API endpoints

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide React
- Firebase Authentication SDK

### Backend
- Node.js
- Express.js
- Firebase Admin SDK
- Google Dialogflow ES Node.js client

### Database and Services
- Google Dialogflow ES
- Firebase Authentication
- Cloud Firestore

## Project Structure

```text
finland-cyber-chatbot/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── credentials/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── .gitignore
└── README.md