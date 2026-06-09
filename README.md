# Kashf ⚡- Smart Egyptian Electricity Consumption Assistant

An AI-powered electricity management platform that helps Egyptian households monitor electricity consumption, avoid costly Sheriha (billing tier) jumps, and receive personalized energy-saving recommendations through live smart meter integration. Features dedicated user and admin dashboards for consumption tracking, analytics, and management, and can be installed on mobile devices and desktops as a Progressive Web App (PWA) for a seamless app-like experience.


Following the 2026 Egyptian electricity tariff increases, moving from one billing tier to another can significantly impact a household's electricity bill. Most consumers only discover they have crossed into a more expensive tier after receiving their monthly invoice. Kashf solves this problem by providing real-time consumption tracking, bill analysis, and proactive warnings before users exceed their current tier limits.

The application allows users to connect Kashf Smart Nodes to their electricity meters. Advanced embedded systems and AI technologies extract consumption data, calculate the user's current billing tier, estimate costs, and provide localized energy-saving recommendations in Egyptian Arabic.

---

🌐 **Live Demo:** [https://kashf-smart-electricity-assistant.netlify.app](https://kashf-smart-electricity-assistant.netlify.app/)

---

## 🚀 Key Features

### 🔌 Real-Time Smart Node Integration

* Connect embedded Smart Nodes directly to meters.
* Continuous real-time data streaming.
* Automatic sync of meter readings and consumption data.
* Fast and accurate processing powered by AI.

### ⚡ Sheriha (Tier) Tracking

* Detect current electricity billing tier.
* Calculate electricity consumption based on official Egyptian tariff rules.
* Estimate monthly electricity costs.
* Track remaining kilowatt-hours before reaching the next tier.

### 🔔 Proactive Tier Warnings

* Real-time notifications when approaching the next billing tier.
* Visual indicators showing consumption progress.
* Prevent unexpected increases in electricity bills.

### 📊 Interactive User Dashboard

* Mobile-first responsive design.
* Consumption analytics and historical records.
* Progress ring visualization showing current tier status.
* Color-coded alerts for critical consumption levels.

### 🤖 AI-Powered Energy Assistant

* Generates practical electricity-saving tips.
* Recommendations tailored to current consumption patterns.
* Responses delivered in Egyptian Arabic (Ammiya).
* Provides actionable advice rather than generic suggestions.

### 👨‍💼 Admin Dashboard

* User management.
* Consumption monitoring.
* Analytics and reporting.
* Tariff configuration management.
* System activity tracking.

### 📱 Progressive Web App (PWA)

* Installable on Android and iOS devices.
* Mobile app-like experience.
* Fast loading and offline support.
* No app store installation required.

---

## 🏗 Problem Statement

Egypt's electricity billing system uses a tiered pricing model known as "Sheriha." Under this system, increasing consumption can move users into higher pricing tiers, resulting in significantly higher monthly bills.

Many households are unaware of their current consumption status and receive no warning before crossing into a more expensive tier. Kashf addresses this challenge by acting as a smart electricity companion that continuously monitors usage and provides timely alerts before users exceed their current tier limits.

---

## 🎯 Project Objectives

* Simplify electricity bill understanding for Egyptian consumers.
* Prevent unexpected billing increases caused by tier jumps.
* Promote energy-efficient behavior through AI-powered recommendations.
* Provide a user-friendly mobile experience accessible to all households.
* Digitize electricity consumption tracking and analysis.

---

## 🖥️ System Architecture

### Frontend

* React.js
* Vite
* Tailwind CSS v4
* Redux Toolkit (State Management)
* i18n (Arabic & English) with Full RTL Support
* Progressive Web App (PWA)
* Responsive Mobile-First Design
* Dashboard & Analytics Interface

### Backend

* Node.js
* Express.js
* RESTful APIs
* Authentication & Authorization
* File Upload Management

### Database

* MongoDB
* Consumption History Storage
* User Data Management

### AI Layer

* Gemini API
* Real-time Data Sync
* Electricity Consumption Analysis
* Personalized Recommendation Generation

---

## 👤 User Workflow

1. Open Kashf on a mobile device.
2. Connect the Kashf Smart Node to the electricity meter.
3. The embedded system streams live consumption data.
4. The backend calculates:

   * Current Sheriha
   * Estimated monthly cost
   * Remaining kilowatt-hours before the next tier
5. Results are displayed on a visual dashboard.
6. The AI assistant generates three practical energy-saving tips in Egyptian Arabic.
7. Users receive alerts before reaching a higher billing tier.

---

## 📈 Dashboard Features

### User Dashboard

* Current consumption overview (Gauge visualizer)
* Billing tier status
* Remaining kilowatt-hours
* Estimated monthly cost
* Historical consumption trends (Line charts)
* AI recommendations & advice
* My Meters CRUD (Managed via Redux Toolkit state)
* Advanced Consumption Analytics (Usage trends, AI forecast charts)
* Bills Management (Forecasts and history tracking)
* Interactive Alerts Timeline (Mark as read, delete, categorize)

### Admin Dashboard

* User analytics
* Consumption reports
* Tariff management
* System monitoring
* Data insights

---

## 🔒 Security Features

* Secure file uploads
* Protected API endpoints
* User authentication and authorization
* Data validation and sanitization
* Secure storage of user information

---

## 🌟 Future Enhancements

* Smart home device integration
* Electricity consumption forecasting
* Monthly budget planning
* Voice assistant support
* Smart notifications and reminders
* Utility company integration
* Community energy-saving challenges

---

## 💡 Impact

Kashf empowers Egyptian households to make informed decisions about electricity consumption, helping them stay within affordable billing tiers, reduce monthly expenses, and adopt smarter energy usage habits.

By combining smart nodes, AI, analytics, and a mobile-first experience, Kashf transforms complex electricity billing information into simple, actionable insights that every user can understand.

---

## 👨‍💻 Team Project

Kashf was developed as a collaborative project focused on solving a real-world problem faced by millions of Egyptian households after the 2026 electricity tariff updates. The platform combines modern web technologies, artificial intelligence, and user-centered design to create an accessible and impactful digital solution.

### Team Members

* **Ahmed Maher Algohary (Me)** — [LinkedIn 🔗](https://www.linkedin.com/in/ahmed-maher-algohary/) 
* **Mohamed Rashad** — [LinkedIn 🔗](https://www.linkedin.com/in/mohamed-rashad-2bb024288/) 
* **Ahmed Essam** — [LinkedIn 🔗](https://www.linkedin.com/in/ahmed-essam-career2333/) 
* **Mohamed Awadallah** — [LinkedIn 🔗](https://www.linkedin.com/in/mohamed-awadallah-ma/) 
* **Yasser Eid** — [LinkedIn 🔗](https://www.linkedin.com/in/yasser-eid-18a45521a/) 

Together, the team collaborated on designing, developing, and delivering Kashf as an AI-powered electricity management platform that helps Egyptian households monitor consumption, avoid costly Sheriha jumps, and make smarter energy decisions through data-driven insights and personalized recommendations.

