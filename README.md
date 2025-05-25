# 🚩 Attack and Defense CTF Platform

> A comprehensive, real-time Capture The Flag (CTF) platform designed for Attack-Defense style competitions with advanced scoring, team management, and administrative features.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## 🎯 Overview

The **Attack and Defense CTF Platform** is a modern, full-stack web application built for hosting competitive cybersecurity events. It provides a complete ecosystem for running Attack-Defense style CTF competitions with real-time scoring, team management, and comprehensive administrative controls.

![img6](screenshots/image6.png)
![img3](screenshots/Image3.png)
![img4](screenshots/Image4.png)
![img1](screenshots/Image1.png)
![img2](screenshots/Image2.png)
![img5](screenshots/Image5.png)



### 🌟 Core Functionalities

- **🏆 Real-time Scoring System** – Dynamic point calculation with multiple scoring mechanisms
- **👥 Team Management** – Complete team registration, authentication, and monitoring
- **🚩 Flag Management** – Comprehensive flag creation, assignment, and tracking
- **⚡ Passive Points System** – Automated scoring based on flag ownership
- **📊 Live Scoreboard** – Real-time competition standings and statistics
- **💬 Team Communication** – Built-in chat system with moderation tools
- **🔧 Admin Dashboard** – Powerful administrative interface with full control
- **📱 Responsive Design** – Works seamlessly on desktop and mobile devices

## 🚀 Features

### 🎮 Competition Features
- **Attack-Defense Format** – Teams attack others while defending their own flags
- **Real-time Updates** – Live scoreboard and instant score updates
- **Multiple Scoring Types** – Self-flag penalties, attack rewards, defense bonuses
- **Configurable Timing** – Customizable competition duration and intervals
- **Automated Scoring** – Passive points system for continuous engagement

### 👨‍💼 Administrative Features
- **🔐 Secure Admin Panel** – JWT-based authentication with role management
- **📈 Real-time Analytics** – Comprehensive competition statistics and insights
- **⚙️ Dynamic Configuration** – Live system configuration without restarts
- **👥 Team Management** – Bulk operations, score adjustments, and monitoring
- **🚩 Flag Operations** – Mass flag creation, assignment, and tracking
- **💬 Chat Moderation** – Message monitoring and content management
- **🔄 Competition Control** – Start, stop, and manage competition phases

### 🛡️ Security Features
- **🔒 Secure Authentication** – bcrypt password hashing and JWT tokens
- **🚫 Rate Limiting** – API abuse prevention and submission throttling
- **🛡️ Input Validation** – Comprehensive data sanitization and validation
- **📝 Audit Logging** – Complete activity tracking and monitoring
- **🔐 Session Management** – Secure session handling and timeout controls

### 🎨 User Experience
- **📱 Responsive Design** – Mobile-first, works on all devices
- **🌙 Modern UI** – Clean, intuitive interface with Tailwind CSS
- **⚡ Real-time Updates** – Live data without page refreshes
- **🔔 Notifications** – In-app notifications for important events
- **📊 Visual Analytics** – Charts and graphs for performance tracking

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with secure cookies
- **Deployment**: Docker containerization
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons

## 📋 Prerequisites

Before running the application, ensure you have:

- **Node.js** (v18 or higher) 📦
- **MongoDB** (v5 or higher) 🍃
- **npm** or **yarn** package manager 📥
- **Docker** (optional, for containerized deployment) 🐳

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

start by changing the default admin user name and password in `setup-database.js` file:

```js
// Create default admin account with plaintext password
// We'll handle password hashing in the application
db.admins.insertOne({
  username: "admin",
  password: "admin", // Plaintext password for initial login
  createdAt: new Date(),
  updatedAt: new Date(),
})
```

after that run the following commands:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t ctf-platform .

# Run the container
docker run -p 3000:3000 --env-file .env.local ctf-platform
```

## ⚡ Quick Start

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/Alter-N0X/ctf-attack-defense-platform.git
cd ctf-attack-defense-platform
```

### 2. 📦 Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. 🔧 Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ctf-platform

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key

# Scoring Configuration
SELF_FLAG_POINTS=10
ATTACK_POINTS=200
DEFENSE_PENALTY=50
PASSIVE_POINTS_VALUE=1
PASSIVE_POINTS_INTERVAL=1200000

# Rate Limiting
MAX_SUBMISSIONS_PER_MINUTE=10
RATE_LIMIT_WINDOW=60000

# Competition Settings
NEXT_PUBLIC_COMPETITION_NAME="CTF Competition 2024"
NEXT_PUBLIC_COMPETITION_START="2024-01-01T00:00:00Z"
NEXT_PUBLIC_COMPETITION_END="2024-01-01T23:59:59Z"
```

### 4. 🗄️ Database Setup

Initialize the database with the setup script:

```bash
npm run setup-db
```

This creates the initial admin account:
- **Username**: `admin`
- **Password**: `admin`

⚠️ **Important**: Change these credentials immediately after first login!

### 5. 🚀 Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. 🔐 Admin Access

Navigate to `http://localhost:3000/admin/login` and use the default credentials to access the admin panel.


## 📖 Usage Guide

### 🏁 Setting Up a Competition

1. **🔐 Admin Login**: Access the admin panel at `/admin/login`
2. **⚙️ Configure Settings**: Set scoring rules and timing in the Configuration section
3. **👥 Create Teams**: Add teams manually or import via CSV
4. **🚩 Add Flags**: Create flags and assign them to teams
5. **🎮 Initialize Competition**: Use the initialization wizard for quick setup
6. **▶️ Start Competition**: Enable passive points and monitor progress

### 👥 Team Participation

1. **📝 Team Registration**: Teams register with unique names and passwords
2. **🔐 Login**: Access team dashboard at `/login`
3. **🚩 Submit Flags**: Submit captured flags for points
4. **📊 Monitor Progress**: View real-time scoreboard and statistics
5. **💬 Team Chat**: Communicate with team members
6. **📈 Track Performance**: Monitor submission history and statistics

### 🎯 Scoring System

- **🎯 Attack Points**: Earn points by capturing other teams' flags
- **🛡️ Defense Penalty**: Lose points when your flags are captured
- **⚠️ Self-Flag Penalty**: Penalty for submitting your own flags
- **⏰ Passive Points**: Automatic points based on flag ownership
- **📊 Real-time Updates**: Scores update instantly across the platform

## 🔧 Configuration

### 📊 Scoring Configuration

All scoring parameters are configurable through the admin panel:

| Setting              | Description                         | Default   |
|----------------------|-----------------------------------|-----------|
| Attack Points        | Points for capturing enemy flags   | 200       |
| Defense Penalty      | Points lost when flag is captured  | 50        |
| Self Flag Points     | Penalty for own flag submission    | 10        |
| Passive Points Value | Points per flag per interval       | 1         |
| Passive Points Interval| Time between passive awards       | 20 minutes|

### ⏱️ Timing Configuration

- **Competition Duration**: Set start and end times
- **Passive Points Interval**: Frequency of passive points awarding
- **Rate Limits**: Max submissions per minute to prevent abuse

## 🤝 Contribution

Contributions are welcome! Please follow these guidelines:

- Fork the repository and create your feature branch
- Write clear, concise commit messages
- Ensure code passes linting and tests
- Submit a pull request for review

## 🙏 Acknowledgments

- Thanks to [Next.js](https://nextjs.org/) for the awesome framework
- Inspired by real-world CTF platforms and community input
- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)



### 🌟 Star this repository if you found it helpful!
