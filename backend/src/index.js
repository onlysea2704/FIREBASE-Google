const express = require("express");
const admin = require("firebase-admin")
const cors = require("cors");
const serviceAccount = require("../serviceAccountKey.json"); // 🔥 Firebase Admin Key
const checkRole = require("../src/Middleware/check_role")

const db = require("../src/config/db");

// Khởi tạo Firebase Admin
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const app = express();
app.use(express.json());
app.use(cors());

// API để lấy danh sách users
app.get("/users", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM users");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// 📌 API Đăng ký - Lưu role vào MongoDB
app.post("/api/register", async (req, res) => {
  const { uid, email, role } = req.body;
  try {
    await db.query("INSERT INTO users (email, firebase_user_id, role) VALUES (?, ?, ?)", [email, uid, role]);
    res.status(201).send("User registered!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 📌 API Đăng nhập - Xác thực token & lấy role từ database
app.post("/api/login", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    try {
      // Xác thực ID Token bằng Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;
  
      // Lấy user từ database
      const user = await db.query("SELECT * FROM users WHERE firebase_user_id = ?", [uid]);
      if (!user) return res.status(404).send("User not found");
      res.json({ role: user[0][0].role }); 
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
});

// 📌 API chỉ Admin mới được truy cập
app.get("/api/admin-data", checkRole("admin"), (req, res) => {
    res.json({status: 'SUCCESS', message: `This is admin data of admin ${req}` });
  });

app.listen(5000, () => console.log("Server is running on port 5000"));
