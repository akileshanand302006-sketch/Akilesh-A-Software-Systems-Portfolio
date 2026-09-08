# ✦ Akilesh A — Software Systems Portfolio

<p align="center">
  <strong>Integrated MSc Software Systems Student • Full-Stack Developer • Problem Solver</strong>
</p>

<p align="center">
  A cinematic, interactive developer portfolio built with modern web technologies,
  premium Liquid Glass UI, 3D experiences, and a cloud-backed architecture.
</p>

<p align="center">
  <a href="https://akileshanand302006-sketch.github.io/Akilesh-A-Software-Systems-Portfolio/">
    <img src="https://img.shields.io/badge/🚀%20EXPLORE%20MY%20PORTFOLIO-2563EB?style=for-the-badge&labelColor=0F172A" alt="Explore Portfolio"/>
  </a>
  &nbsp;
  <a href="https://github.com/akileshanand302006-sketch/Akilesh-A-Software-Systems-Portfolio" target="_blank">
    <img src="https://img.shields.io/badge/💻%20SOURCE%20CODE-GitHub-111827?style=for-the-badge&logo=github&logoColor=white" alt="Source Code">
  </a>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-FF0055?logo=framer)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github)
![License](https://img.shields.io/badge/License-MIT-green.svg)

</p>

---

## ✨ Overview

This portfolio is designed as a **professional internship-ready developer portfolio**, combining software engineering, full-stack development, databases, algorithms, and interactive UI into a single immersive experience.

Instead of a traditional static portfolio, it provides a cinematic interface featuring:

- Premium Liquid Glass UI
- Interactive 3D visuals
- Smooth Framer Motion animations
- Dynamic light/dark themes
- Interactive project showcase
- Animated skills ticker
- Coding profile integrations
- Cloud-backed portfolio data
- Working contact system
- Responsive design across devices

---

### 🌐 Explore the Portfolio

<p align="center">
  <a href="https://akileshanand302006-sketch.github.io/Akilesh-A-Software-Systems-Portfolio/">
    <img src="https://img.shields.io/badge/✨%20EXPLORE%20MY%20PORTFOLIO-Click%20to%20Visit%20→-2563EB?style=for-the-badge&labelColor=0F172A" alt="Explore Portfolio">
  </a>
</p>

> **Live:** [Akilesh A — Software Systems Portfolio](https://akileshanand302006-sketch.github.io/Akilesh-A-Software-Systems-Portfolio/)

---

## 🚀 Key Features

### 🎨 Premium UI/UX
- Liquid Glass / Glassmorphism design
- Transparent surfaces and backdrop blur
- Electric blue glow effects
- Animated gradients
- Micro-interactions
- Smooth transitions
- Responsive layouts
- Premium light & dark themes

### 🌌 Interactive Experience
- Three.js 3D hero environment
- Floating glass objects
- Orbital rings
- Interactive particles
- Mouse-based parallax
- Cinematic section transitions
- Custom cursor effects
- Scroll progress indicator

### 💻 Developer Showcase
- About & engineering philosophy
- Technical skills
- Animated skill ticker
- Project showcase
- Experience / learning timeline
- Achievements
- Coding profiles
- Social profiles
- Resume access

### 📬 Contact
- Real-time form validation
- Nodemailer + Gmail SMTP backend delivery
- MongoDB-backed contact messages
- Animated submission feedback

### ☁️ Cloud Backend
- Node.js + Express REST API
- MongoDB Atlas cloud database
- Profile and project data stored in MongoDB
- Cloud-based resume/image storage
- API-driven portfolio content

---

## 🧩 Featured Projects

The portfolio showcases projects including:

| Project | Focus |
|---|---|
| **Smart Hospital Bed Management System** | 8086 Assembly, PHP, JavaScript, resource allocation |
| **RouteVeda-Smart Travel Planning Platform** | Angular, Node.js, PostgreSQL/PostGIS, Google Places |
| **Finora** | Java, JavaFX, MySQL, personal finance management |
| **QuoteVerse** | React, Node.js, MySQL, interactive quote discovery |

Each project highlights its:

- Problem
- Solution
- Technologies
- Key features
- GitHub repository
- Live demonstration where available

---

## 🛠️ Technology Stack

| Area | Technologies |
|---|---|
| **Frontend** | React 19, Vite, JavaScript / JSX |
| **UI** | Bootstrap 5.3, Custom CSS, Liquid Glass |
| **Animations** | Framer Motion |
| **3D** | Three.js, React Three Fiber, Drei |
| **Particles** | tsParticles |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **File Storage** | MongoDB GridFS |
| **Contact** | Nodemailer + Gmail SMTP |
| **Deployment** | GitHub Pages + Backend Hosting |
| **Version Control** | Git & GitHub |

---

## 🏗️ Architecture

```text
                    PORTFOLIO
                        │
                        ▼
                 React + Vite
                        │
                  Axios / HTTP
                        │
                        ▼
               Node.js + Express
                        │
                        ▼
                  MongoDB Atlas
                        │
              ┌─────────┴─────────┐
              │                   │
          Application           GridFS
             Data                │
              │          ┌───────┼────────┐
              │          │       │        │
          Profile      Resume  Images   Media
          Projects
          Skills
          Experience
          Contact
          Analytics


Frontend Deployment:

GitHub Repository
        ↓
   GitHub Pages
        ↓
   React Application
````

## 🗄️ MongoDB Atlas

Portfolio application data is stored in **MongoDB Atlas** instead of static JSON files.

Stored data includes:

* Profile information
* Projects
* Skills
* Experience
* Achievements
* Coding profiles
* Social links
* Contact messages
* Portfolio analytics

Large files such as:

* Resume PDF
* Profile image
* Project images

can be stored through **MongoDB GridFS**, with their file references maintained in MongoDB documents.

### Data Flow

```text
React
  ↓
Express API
  ↓
MongoDB Atlas
  ↓
Portfolio Data
```

MongoDB credentials are stored only in backend environment variables.

---

## 📁 Project Structure

```text
Portfolio/
│
├── src/
│   ├── components/
│   │   ├── About/
│   │   ├── Achievements/
│   │   ├── BackgroundEffects/
│   │   ├── Contact/
│   │   ├── CodingProfiles/
│   │   ├── Experience/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── Navbar/
│   │   ├── ProfileImage/
│   │   ├── Projects/
│   │   ├── Resume/
│   │   ├── Skills/
│   │   └── ThemeToggle/
│   │
│   ├── hooks/
│   ├── services/
│   ├── data/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── config/
│   └── server.js
│
├── public/
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd Portfolio
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure backend

```bash
cd server
npm install
```

Create:

```text
server/.env
```

Example:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

Never commit `.env`.

### 4. Start the backend

```bash
npm run dev
```

### 5. Start the frontend

From the project root:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

### Frontend (`.env`)

```env
# Optional in local dev (Vite proxies /api to backend localhost:5000)
# In production, set to your deployed backend URL:
VITE_API_URL=https://your-backend-api.com/api
```

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=https://akileshanand302006.github.io

# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=akileshanand302006@gmail.com
SMTP_PASS=your_16_character_google_app_password
CONTACT_TO=akileshanand302006@gmail.com
```

> [!WARNING]
> **Never commit your `.env` file or hardcode SMTP/MongoDB credentials.**  
> `SMTP_PASS` must be a 16-character Google App Password (not your personal Google account password).  
> GitHub Pages cannot execute the Node.js SMTP server, so SMTP credentials must remain exclusively on the separately deployed backend.

---

## 📧 Contact Email Configuration

The portfolio uses a secure decoupled architecture for the contact system:

* **Frontend**: React 19 + Vite (dispatches `POST /api/contact` with `{ name, email, subject, message }`)
* **Backend**: Node.js + Express (`POST /api/contact` with rate limiting, sanitization, and input validation)
* **Email Service**: Nodemailer + Gmail SMTP (`smtp.gmail.com:465` SSL/TLS)
* **Storage**: MongoDB Atlas (stores contact messages upon verified dispatch)

### Required Backend Environment Variables

| Variable | Description | Example / Recommended Value |
|---|---|---|
| `SMTP_HOST` | Gmail SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | Secure SSL/TLS port | `465` |
| `SMTP_SECURE` | Use SSL/TLS encryption | `true` |
| `SMTP_USER` | Authenticated Gmail address | `akileshanand302006@gmail.com` |
| `SMTP_PASS` | 16-character Google App Password | `your_16_character_app_password` |
| `CONTACT_TO` | Destination inbox for inquiries | `akileshanand302006@gmail.com` |

### Generating a Google App Password
1. Navigate to your **Google Account** (`https://myaccount.google.com/`).
2. Go to **Security** and confirm that **2-Step Verification** is turned ON.
3. Search for or navigate to **App Passwords** (`https://myaccount.google.com/apppasswords`).
4. Create a new App Password named "Portfolio".
5. Copy the 16-character password and paste it as `SMTP_PASS` in `server/.env` (without spaces).

### Important Architectural Principles
* **Sender & Recipient Flow**: The email is sent from the authenticated account (`SMTP_USER`) to `CONTACT_TO`. The visitor's email is set as `Reply-To`, allowing you to click "Reply" in Gmail and respond directly to the visitor.
* **Separation of Concerns**: GitHub Pages only serves static frontend assets and cannot run Node.js/Express. The backend must be hosted on a Node-capable platform (e.g., Render, Railway, Fly.io, Cloud Run) with the SMTP environment variables configured in its environment settings.

---

## 🌐 Deployment

### Frontend — GitHub Pages

Build the React application:

```bash
npm run build
```

Configure Vite with the correct GitHub Pages base path if the repository is not using a custom domain.

Then deploy the generated `dist/` directory using GitHub Pages.

Recommended deployment flow:

```text
GitHub Repository
       ↓
GitHub Actions
       ↓
npm run build
       ↓
dist/
       ↓
GitHub Pages
```

### Backend

GitHub Pages cannot execute Node.js/Express.

Deploy the backend separately using a Node-compatible hosting provider.

Production architecture:

```text
GitHub Pages
     │
     │ HTTPS API requests
     ▼
Node.js + Express
     │
     ▼
MongoDB Atlas
```

Set the production frontend URL in the backend CORS configuration.

---

## 📱 Responsive Design

The portfolio is optimized for:

* Desktop
* Laptop
* Tablet
* Mobile

The 3D background and particle system automatically reduce visual complexity on smaller devices to maintain smooth performance.

The application also respects:

```text
prefers-reduced-motion
```

for accessibility.

---

## 🎯 Engineering Highlights

This portfolio demonstrates practical knowledge of:

* Component-based architecture
* REST API integration
* Cloud database architecture
* MongoDB data modeling
* File storage with GridFS
* Responsive frontend development
* 3D web graphics
* Animation systems
* API-based content management
* Form validation
* Accessibility
* SEO
* Git/GitHub workflows
* Production deployment

---

## 📄 License

This project is available under the **MIT License**.

---

<p align="center">

### ✦ Build systems. Solve problems. Create experiences.

**Akilesh A**

</p>
