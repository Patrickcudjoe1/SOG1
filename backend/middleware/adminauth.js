import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
  
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized. Login again." });
    }

    const token = authHeader.split(" ")[1]; 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Not authorized. Login again." });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;
