import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import setupSwagger from "./utils/swagger.js";
import changeRole from './routes/changeRole.js';
import path from "path";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth/user",changeRole);
app.use('/uploads', express.static(path.resolve("src", "uploads")));
 
app.get('/api/auth/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.clearCookie('connect.sid', { path: '/' }); // Clear the session cookie
            res.redirect('https://accounts.google.com/logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000');
        });
    });
});



setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}, Docs at /api-docs`));
