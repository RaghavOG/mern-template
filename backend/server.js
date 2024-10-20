import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.route.js";


import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
app.use(cors({
    origin: ENV_VARS.CLIENT_URL, // Specify your frontend URL
    credentials: true
}));

if (ENV_VARS.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json()); 
app.use(cookieParser());
app.use(helmet());


app.use("/api/v1/auth", authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});



if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
	// console.clear();
});
