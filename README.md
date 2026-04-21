# GreenBite – Smart Hostel Meal Decision System

GreenBite is a smart web-based solution designed to help hostels reduce food waste by enabling students to make informed meal choices. The system allows users to mark whether they will eat or skip meals, while rewarding responsible decisions through a points-based system.

---

## 🚀 Features

* **Role-Based System**
  Separate dashboards for **Admin** and **Students** to manage meals and user interactions efficiently.

* **Meal Decision System**
  Students can mark meals as *Eat* or *Skip* in advance.

* **Reward System**
  Points-based rewards to encourage reduced food wastage.

* **Real-Time Meal Tracking**
  Admins can monitor meal counts and manage food preparation accordingly.

* **Admin Controls**
  Manage users, meals, bookings, and coupons easily.

* **REST API Integration**
  Efficient backend communication using RESTful APIs.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/developer-pranav/greenbite.git
cd greenbite
```

---

### 2. Setup Backend (Server)

```bash
cd server
npm install
```

Create a `.env` file in the server folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:

```bash
npm start
```

---

### 3. Setup Frontend (Client)

```bash
cd client
npm install
npm start
```

---

## 🧰 Tech Stack

* **Frontend**: React.js
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Authentication**: JWT
* **API**: REST APIs

---

## 🔄 Project Workflow

```text
User (React Frontend)
        ↓
API Request (Fetch)
        ↓
Express Routes
        ↓
Controllers
        ↓
MongoDB (Database)
```

---

## 📊 Use Case

* Helps hostels estimate exact meal demand
* Reduces unnecessary food preparation
* Encourages students to make responsible decisions
* Tracks participation through reward points

---

## 📜 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Want to contribute? Follow these steps:

1. Fork the repository
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to GitHub (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📩 Contact

For any queries or suggestions, feel free to open an issue or reach out [Developer Pranav](mailto:developer.pranav3306@gmail.com)..

---
