# BikeHub - Premium Bike Rental Platform

A modern, full-stack bike rental application built with Django REST Framework and React (Vite + Tailwind CSS).

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **Bike Management**: Users can list their own bikes for rent and manage them.
- **Rental System**: Real-time availability checking and automated price calculation.
- **Premium UI**: Sleek, responsive design with modern animations and micro-interactions.
- **Dashboard**: Comprehensive overview of active rentals and listed bikes.

## Tech Stack

### Backend
- **Framework**: Django 5.2
- **API**: Django REST Framework
- **Auth**: SimpleJWT
- **Database**: SQLite (Development)

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Routing**: React Router 7

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 20+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
BikeRental/
├── backend/            # Django project
│   ├── bike/           # Main application logic
│   └── RentBike/       # Project settings
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth state management
│   │   └── pages/      # Application views
└── requirements.txt    # Backend dependencies
```

## License
MIT
