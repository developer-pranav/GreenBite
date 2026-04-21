# <img src="assets/logo.png" alt="GreenBite" align="center" height="35"> GreenBite – Smart Hostel Meal Decision System

GreenBite is a smart web-based application designed to reduce food wastage in hostels by allowing students to make informed meal decisions. It enables users to mark whether they will eat or skip meals and rewards responsible behavior through a points-based system.


## 🚀 Features

* **Role-Based System**: Separate dashboards for Admin and Students.
* **Meal Decision System**: Students can mark meals as *Eat* or *Skip*.
* **Reward System**: Earn points for responsible meal decisions.
* **Real-Time Meal Tracking**: Track meal counts dynamically.
* **Admin Controls**: Manage users, meals, bookings, and coupons.
* **REST APIs**: Smooth communication between frontend and backend.





## 🛠️ Tech Stack

* **Frontend**: React.js
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Authentication**: JWT
* **API**: REST APIs


## 💾 Installation

### Prerequisites

* Node.js & npm
* MongoDB (local or cloud e.g. MongoDB Atlas)

---

### Steps

1. Clone the repository:

```bash
git clone https://github.com/your-username/greenbite.git
cd greenbite
```


2. Setup Backend:

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```


3. Setup Frontend:

```bash
cd client
npm install
npm start
```


## 📡 Usage

1. Register/Login as a student or admin.
2. Students can select meals (Eat/Skip).
3. Admin can monitor meal data and manage system.
4. Earn points for smart meal decisions.


## 🔧 Configuration

* Set your MongoDB URI and JWT secret in `.env` file.
* Ensure backend runs on correct port before starting frontend.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.


## 🤝 Contributing

Want to contribute? Follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

We appreciate your contributions!

## 📞 Contact

For any questions or suggestions, please open an issue or contact
[Developer Pranav](mailto:developer.pranav3306@gmail.com)

---
