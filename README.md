# 🛵 Real-Time Geospatial Delivery System

A high-performance backend system for a logistics/delivery application. Built to handle **Real-Time Tracking**, **Geospatial Search**, and **High-Concurrency Ordering**.

---

## 🛠️ Architecture & Tech Stack

*   **Core:** Node.js (Express)
*   **Database:** PostgreSQL with **PostGIS** (Geospatial extension)
*   **Caching:** Redis (Geo-caching for sub-millisecond reads)
*   **Real-Time:** Socket.io (Bi-directional events)
*   **Infrastructure:** Docker & Docker Compose
*   **Client:** Flutter (Mobile/Web)

---

## ⚡ Key Engineering Challenges Solved

### 1. 🌍 The "Nearest Driver" Problem (PostGIS)
Instead of calculating distances in code (slow), I utilized **PostGIS** spatial queries.
*   **Query:** `ST_Distance` and `ST_DWithin`
*   **Optimization:** Spatial Indexing (`GIST`) allows finding the nearest points among millions of records in milliseconds.

### 2. 🏎️ The "Race Condition" (Atomic Transactions)
**Problem:** If two users order at the exact same millisecond, they might be assigned the same driver.
**Solution:** Implemented **Pessimistic Locking** in the Database Transaction.
```sql
SELECT * FROM drivers 
WHERE is_available = true 
ORDER BY location <-> restaurant_location 
LIMIT 1 
FOR UPDATE SKIP LOCKED;
```

`FOR UPDATE SKIP LOCKED` ensures one driver cannot be claimed by two concurrent transactions.

### 3. Scale & Performance (Redis)

Geospatial queries on disk are expensive at high throughput, so the system uses a **cache-aside strategy**:

- Search requests hit Redis first
- On cache miss, query PostGIS
- Cache results with TTL (time to live)

---

## Project Structure

```text
src/
 +-- config/         # DB (Pool) and Redis connections
 +-- controllers/    # HTTP request handling
 +-- repositories/   # Raw SQL and PostGIS queries
 +-- services/       # Business logic (transactions, locking)
 +-- routes/         # API definitions
 +-- app.js          # Socket.io and Express setup
```

---

##  How to Run (Docker)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd delivery-api
```

### 2. Start all services

```bash
docker-compose up --build
```

This starts Node.js, PostGIS, and Redis containers.

### 3. Seed data

Connect to the running database container, enable PostGIS, and run your SQL seed scripts (for example, Addis Ababa locations).

### 4. Test an endpoint

```bash
curl "http://localhost:3000/api/restaurants?lat=9.01&long=38.76"
```
