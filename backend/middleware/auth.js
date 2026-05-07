import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export default async function authMiddleware(req, res, next) {
    // 1. Force fail early if environment variables are not loaded yet
    if (!process.env.JWT_SECRET) {
        console.error("CRITICAL ERROR: process.env.JWT_SECRET is undefined. Check your dotenv configuration.");
        return res.status(500).json({ success: false, message: "Internal server configuration error" });
    }

    const authHeader = req.headers.authorization;
    
    // 2. Validate format of the Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not Authorized, token missing" });
    }

    // 3. Extract the token cleanly
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verify using the absolute environment variable
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. Fetch user and exclude password
        const user = await User.findById(payload.id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // 6. Attach user to request object
        req.user = user;
        next();
    } catch (e) {
        console.error("JWT verification failed:", e.message);
        return res.status(401).json({ success: false, message: "Token invalid or expired" });
    }
}
