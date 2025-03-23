const admin = require("firebase-admin");
const db = require('../config/db')
const checkRole = (requiredRole) => async (req, res, next) => {

  const token = req.headers.authorization.split(" ")[1]
      try {
        // Xác thực ID Token bằng Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
    
        // Lấy user từ database
        const [user] = await db.query("SELECT * FROM users WHERE firebase_user_id = ?", [uid]);

        console.log(user)
        if (!user) return res.status(404).send("User not found");

        if (user[0].role !== requiredRole) {
          return res.status(403).send("Forbidden");
        }

        req.user = user;
        next();
      } catch (error) {
        res.status(401).send("Unauthorized");
      }
};

module.exports = checkRole;
