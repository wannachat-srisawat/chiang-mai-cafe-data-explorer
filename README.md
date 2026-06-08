# ☕ Chiang Mai Cafe Data Explorer

An interactive geospatial cafe analytics platform for exploring coffee shops across Chiang Mai.

The application combines **mapping, analytics, location intelligence, and recommendation scoring** to help users discover cafes and analyze district-level opportunities.

---

## 🚀 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- SWR
- Tailwind CSS

### Mapping & Analytics

- Leaflet
- React Leaflet
- Recharts

### Backend

- Go
- Gin

### Database & Storage

- Supabase PostgreSQL
- Supabase Storage

---

## 📦 Features

### ☕ Cafe Management

- ✅ Create cafe
- ✅ Edit cafe
- ✅ Delete cafe
- ✅ Cafe detail page
- ✅ Image upload
- ✅ Search cafes
- ✅ Pagination
- ✅ Multi-filter support

### 🗺️ Map Experience

- ✅ Interactive cafe map
- ✅ Marker clustering
- ✅ Heatmap visualization
- ✅ District filtering
- ✅ Popup cafe information
- ✅ Direct navigation to cafe detail

### 📊 Analytics Dashboard

- ✅ Summary metrics
- ✅ Cafes by district
- ✅ Price distribution
- ✅ Feature distribution
- ✅ Top vibes analysis
- ✅ Top areas overview

### 🧠 Location Intelligence

- ✅ Opportunity score
- ✅ District comparison
- ✅ Area insights
- ✅ Recommendation engine

---

## 🧩 Backend Features

The backend provides REST APIs for cafe management and geospatial data exploration.

### API Capabilities

- ✅ Cafe CRUD operations
- ✅ Search and filtering
- ✅ Pagination
- ✅ District filtering
- ✅ Vibe filtering
- ✅ Price level filtering
- ✅ Latitude / longitude support

### API Endpoints

```txt
GET     /cafes
GET     /cafes/:id
POST    /cafes
PUT     /cafes/:id
DELETE  /cafes/:id
```

---

## 🎯 Recommendation Engine

Users can discover cafes based on different preferences:

- 💻 Remote Work
- 📚 Study
- 🌿 Nature
- 💰 Budget
- ⭐ High Rated

Each cafe is scored using a weighted recommendation model based on:

- Wi-Fi availability
- Quiet environment
- Study-friendly signals
- Nature atmosphere
- Rating quality
- Price level

---

## 📈 Analytics Capabilities

### District Insights

- Most competitive district
- Highest density district
- Best rated district
- Most study-friendly district

### Opportunity Analysis

The system evaluates districts using:

- Cafe density
- Average ratings
- Study-friendly ratio
- Nature-friendly ratio
- Wi-Fi availability

to generate an **Opportunity Score** for potential expansion areas.

## 🚀 Getting Started

### Clone repository

```bash
git clone https://github.com/wannachat-srisawat/chiang-mai-cafe-data-explorer.git

cd chiang-mai-cafe-data-explorer
```

### Frontend

Install dependencies:

```bash
cd frontend

npm install
```

Start development server:

```bash
npm run dev
```

Frontend will be available at:

```txt
http://localhost:5173
```

---

### Backend

Install dependencies:

```bash
cd backend

go mod tidy
```

Start server:

```bash
go run main.go
```

Backend will be available at:

```txt
http://localhost:8080
```

---

## 📂 Project Structure

```txt
chiang-mai-cafe-data-explorer
│
├── backend
│   ├── config
│   ├── handlers
│   ├── models
│   ├── repositories
│   ├── routes
│   └── main.go
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   │   ├── dashboard
│   │   │   └── ui
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   ├── types
│   │   └── utils
│   │
│   └── public
│
└── README.md
```

---

## 👨‍💻 Developer

Developed by **Fluke (Wannachat Srisawat)**
