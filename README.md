# AddisBike - Role-Based Bike Rental Platform

## Overview
AddisBike is a comprehensive bike rental platform with role-based access control, supporting both bike owners and renters.

## User Roles

### 1. **Bike Owner**
- List and manage bikes
- View bookings for their bikes
- Track revenue from rentals
- Add/delete bikes from inventory

### 2. **Bike Renter**
- Browse available bikes
- Book bikes with specific dates and times
- View rental history
- Complete active rentals

## Key Features

### Backend Updates

#### Models (`bike/models.py`)
1. **UserProfile** - Stores user role (owner/renter) and additional info
2. **Bike** - Enhanced with type choices, descriptions, timestamps
3. **Rental** - Updated with status tracking (pending, active, completed, cancelled)

#### API Endpoints
- `POST /api/register/` - Register with role selection
- `GET/PUT /api/profile/` - Manage user profile
- `GET /api/my_bikes/` - Owner's bikes
- `GET /api/owner_rentals/` - Rentals for owner's bikes
- `GET /api/rentals/` - Renter's rentals
- `POST /api/rentals/` - Create new rental
- `PUT /api/rentals/<id>/` - Complete rental
- `DELETE /api/rentals/<id>/` - Cancel rental

### Frontend Updates

#### 1. **Registration with Role Selection**
- Users choose between "Rent Bikes" or "List Bikes"
- Visual role selector with icons
- Role is saved to user profile

#### 2. **Improved Booking Form**
- Separate date and time inputs for better UX
- Pickup Date + Pickup Time
- Return Date + Return Time
- Real-time duration and price calculation
- Input validation

#### 3. **Role-Based Dashboard with Sidebar**

**Sidebar Navigation:**
- Overview
- My Bikes (Owner) / My Rentals (Renter)
- Bookings (Owner)
- Settings
- Logout

**Owner Dashboard:**
- **Overview Tab:**
  - Total bikes count
  - Active bookings count
  - Total revenue
  - Quick action: Add New Bike

- **My Bikes Tab:**
  - Grid view of all bikes
  - Availability status badges
  - Delete bike functionality
  - Add new bike modal

- **Bookings Tab:**
  - Table view of all rentals for owned bikes
  - Renter information
  - Rental status tracking
  - Revenue per booking

**Renter Dashboard:**
- **Overview Tab:**
  - Total rentals count
  - Active rentals count
  - Total spent
  - Quick action: Browse Bikes

- **My Rentals Tab:**
  - Card view of all rentals
  - Rental status (active/completed)
  - Pickup and return times
  - Complete rental button for active rentals

**Settings Tab (Both):**
- View profile information
- Username, email, role display

## Design Features

### Color Scheme
- **Primary:** Burnt Orange (#F97316)
- **Secondary:** Coral (#FB923C)
- **Accent:** Terracotta (#EA580C)
- **Background:** Warm peachy-white with subtle orange tints

### UI Components
- **Shadows:** Warm orange-tinted shadows throughout
- **Cards:** Clean white cards with subtle shadows
- **Buttons:** Solid colors with hover lift effects
- **Inputs:** Inset shadows for depth
- **Badges:** Color-coded status indicators

### Responsive Design
- Mobile-friendly sidebar (hamburger menu)
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## How to Use

### For Bike Owners:
1. Register and select "List Bikes"
2. Login to dashboard
3. Add bikes via "Add New Bike" button
4. View bookings in "Bookings" tab
5. Track revenue in overview

### For Bike Renters:
1. Register and select "Rent Bikes"
2. Browse bikes on home page
3. Click "Book Now" on desired bike
4. Select pickup and return dates/times
5. Confirm booking
6. View rentals in dashboard
7. Complete rental when done

## Technical Stack

### Backend
- Django REST Framework
- JWT Authentication
- PostgreSQL/SQLite
- Role-based permissions

### Frontend
- React
- React Router
- Lucide Icons
- Tailwind CSS (custom theme)
- Warm orange color palette

## API Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <access_token>
```

Token refresh endpoint available at `/api/token/refresh/`

## Status Tracking

### Rental Statuses:
- **pending** - Booking created, not started
- **active** - Currently renting
- **completed** - Rental finished
- **cancelled** - Booking cancelled

### Bike Availability:
- Automatically updated when rental is created/completed
- Owners can see availability status in dashboard

## Future Enhancements
- Payment integration
- Bike ratings and reviews
- Advanced search filters
- Bike photos upload
- Rental calendar view
- Email notifications
- Damage reports
- Insurance options
