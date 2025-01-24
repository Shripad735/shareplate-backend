# 🍽️ SharePlate - Food Waste Reduction Platform

<div align="center">
  <p>
    <strong>Connecting surplus food with those in need! 🌍</strong>
  </p>

  <!-- Badges -->
  <p>
    <a href="https://github.com/Shripad735/shareplate-frontend">
      <img src="https://img.shields.io/github/last-commit/Shripad735/shareplate-frontend" alt="Last Commit" />
    </a>
    <a href="https://github.com/Shripad735/shareplate-frontend/issues">
      <img src="https://img.shields.io/github/issues/Shripad735/shareplate-frontend" alt="Open Issues" />
    </a>
    <a href="https://github.com/Shripad735/shareplate-frontend/stargazers">
      <img src="https://img.shields.io/github/stars/Shripad735/shareplate-frontend" alt="Stars" />
    </a>
    <a href="https://github.com/Shripad735/shareplate-frontend/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/Shripad735/shareplate-frontend" alt="License" />
    </a>
  </p>

  <p>
    <a href="https://shareplate-frontend.vercel.app/">🌐 Live Demo</a> |
    <a href="https://github.com/Shripad735/shareplate-frontend">💻 Frontend Repo</a> |
    <a href="https://github.com/Shripad735/shareplate-backend">🔧 Backend Repo</a>
  </p>
</div>

---

## 📝 Table of Contents
- [About the Project](#about-the-project)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🚀 About the Project

**SharePlate** is a platform designed to reduce food waste by connecting restaurants with surplus food to NGOs and individuals who can utilize it. The platform focuses on real-time food listing, reservation management, and location-based search to ensure no food goes to waste.

### 🌟 Features
- **User Authentication**: Secure login and registration with JWT tokens 🔐
- **Food Listings**: Restaurants can create and manage food listings 🍕
- **Reservation System**: NGOs/Individuals can reserve available food 🛒
- **Real-time Analytics**: Charts and statistics for admin dashboard 📊
- **Location-based Search**: Google Maps integration for finding nearby listings 🗺️
- **Image Upload**: Cloudflare R2 integration for food listing photos 📸
- **Responsive Design**: Mobile-friendly interface 📱
- **User Roles**: Three user types (Restaurant, NGO/Individual, Admin) 👥

### 🛠️ Tech Stack
#### Frontend
- React.js
- React Router
- Chart.js
- Google Maps API
- Framer Motion
- Notistack (Snackbars)

#### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer (OTP)

#### DevOps
- Vercel (Deployment)
- Cloudflare R2 (Image Storage)
- MongoDB Atlas (Database)

---

## 🛠️ Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Maps API key
- Cloudflare R2 credentials

### Installation
1. **Clone the repositories**:
   ```bash
   git clone https://github.com/Shripad735/shareplate-frontend.git
   git clone https://github.com/Shripad735/shareplate-backend.git
   ```

2. **Install dependencies**:
   - For Frontend:
     ```bash
     cd shareplate-frontend
     npm install
     ```
   - For Backend:
     ```bash
     cd shareplate-backend
     npm install
     ```

3. **Set up environment variables**:
   - Create `.env` files in both `shareplate-frontend` and `shareplate-backend` directories.
   - Add the required environment variables (refer to the respective `.env.example` files).

### Running Locally
1. **Start the backend server**:
   ```bash
   cd shareplate-backend
   npm start
   ```

2. **Start the frontend development server**:
   ```bash
   cd shareplate-frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## 💽 Usage

### User Roles
1. **Restaurants**:
   - Create and manage food listings
   - View reservations
   - Manage active listings
   - View statistics

2. **NGOs/Individuals**:
   - Browse available food listings
   - Make reservations
   - Track pickup status
   - View nearby listings on map

3. **Admin**:
   - Manage all users
   - View platform statistics
   - Monitor all listings and reservations

---

## 📚 API Documentation

The backend API follows RESTful principles and includes the following main endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset initiation
- `POST /api/auth/validate-otp` - OTP validation
- `POST /api/auth/reset-password` - Password reset

### Food Listings
- `GET /api/food-listings` - Get all listings
- `POST /api/food-listings` - Create new listing
- `PUT /api/food-listings/:id` - Update listing
- `DELETE /api/food-listings/:id` - Delete listing

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get all reservations
- `PUT /api/reservations/:id/pickup` - Mark reservation as picked up
- `DELETE /api/reservations/:id` - Cancel reservation

### Statistics
- `GET /api/stats` - Get platform statistics

---

## 🚀 Deployment

The project is deployed on Vercel with the following configuration:

1. **Backend Deployment**:
   - Uses `vercel.json` configuration
   - Environment variables set in Vercel dashboard
   - Automatic deployments from main branch

2. **Frontend Deployment**:
   - Separate Vercel project
   - Environment variables for API endpoints
   - Automatic deployments from main branch

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style guidelines.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Shripad Deshmukh**  
- Email: shripad.khandare@mitaoe.com  
- GitHub: [Shripad735](https://github.com/Shripad735)  
- LinkedIn: [Shripad Khandare](https://www.linkedin.com/in/shripad-khandare-39a2a2203/)

---

## 🙏 Acknowledgments
- [Vercel](https://vercel.com/) for hosting
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) for image storage
- [Google Maps API](https://developers.google.com/maps) for location-based features
- [Chart.js](https://www.chartjs.org/) for analytics
- [Framer Motion](https://www.framer.com/motion/) for animations

