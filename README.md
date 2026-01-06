# AddisBike - Bike Rental Platform

AddisBike is a comprehensive, role-based bike rental application designed to modernize urban transportation. It serves as a bridge between bike owners looking to monetize their idle assets and renters seeking efficient, eco-friendly city transit.

The platform features a distinctive "Tech Grid" aesthetic—a futuristic, high-contrast interface with sharp corners and technical design elements—providing a premium and responsive user experience.

## 🚀 Key Features

### 👥 Role-Based Access Control
The system is built around two distinct user roles, each with a tailored dashboard and feature set:

**1. Bike Owners**
*   **Fleet Management:** Add, edit, and delete bikes from your personal fleet.
*   **Rental Tracking:** View active and past bookings for all your listed units.
*   **Revenue Monitoring:** Track earnings from completed rentals.
*   **Availability Control:** Real-time status updates for your bikes.

**2. Renters**
*   **Smart Search:** Filter bikes by type (Road, Mountain, Electric, etc.) and price.
*   **Seamless Booking:** Intuitive booking flow with immediate cost estimation.
*   **Rental History:** Keep track of all your rides and expenditures.
*   **Active Ride Management:** Monitor ongoing rentals and complete them with a single click.

### 🎨 User Interface 
*   **Futuristic Design:** Sharp corners, technical borders, and a grid-based layout.
*   **Responsive:** Fully optimized for desktop and mobile devices.
*   **Interactive:** Dynamic hover effects, status badges, and smooth transitions.
*   **Dark/Light Mode Ready:** Built with Tailwind CSS variables for easy theming.

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS v4
*   **Routing:** React Router DOM
*   **Icons:** Lucide React
*   **State Management:** React Context API (AuthContext)

### Backend
*   **Framework:** Django REST Framework (DRF)
*   **Authentication:** JWT (JSON Web Tokens) via `simplejwt`
*   **Database:** SQLite (Development Default)
*   **CORS:** `django-cors-headers` for secure frontend-backend communication

## 🔌 API Endpoints

The backend exposes a comprehensive REST API. Key endpoints include:

*   **Auth:** `/api/register/`, `/api/login/`, `/api/token/refresh/`
*   **Bikes:** `/api/bikes/` (List/Create), `/api/bikes/<id>/` (Detail/Delete)
*   **Rentals:** `/api/rentals/` (List/Create), `/api/rentals/<id>/` (Complete)
*   **User:** `/api/profile/`, `/api/my_bikes/`, `/api/owner_rentals/`

## 💻 Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
*   Node.js (v16+)
*   Python (v3.8+)

### 1. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```
The backend will run at `http://127.0.0.1:8000`.

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the React app.

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will run at `http://localhost:5173`.

## 📂 Project Structure

```
BikeRental/
├── backend/                # Django Project
│   ├── RentBike/          # Project settings
│   ├── bike/              # Main app (models, views, serializers)
│   └── manage.py
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/    # Reusable UI components (NavBar, Forms)
│   │   ├── context/       # AuthContext provider
│   │   ├── pages/         # Page components (Home, Dashboard, Login)
│   │   └── index.css      # Global styles & Tailwind theme
│   └── package.json
│
└── README.md
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.
