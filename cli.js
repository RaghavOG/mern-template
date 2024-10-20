#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the directories and files to create
const directories = ['frontend', 'backend'];
const files = {
    
    'backend/server.js': `import express from "express";
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
`,
    'frontend/package.json': JSON.stringify({
        
            "name": "frontend",
            "private": true,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "dev": "vite",
              "build": "vite build",
              "lint": "eslint .",
              "preview": "vite preview"
            },
            "dependencies": {
              "@radix-ui/react-slot": "^1.1.0",
              "class-variance-authority": "^0.7.0",
              "clsx": "^2.1.1",
              "lucide-react": "^0.453.0",
              "react": "^18.3.1",
              "react-dom": "^18.3.1",
              "shadcn-ui": "^0.2.3",
              "tailwind-merge": "^2.5.4",
              "tailwindcss-animate": "^1.0.7"
            },
            "devDependencies": {
              "@eslint/js": "^9.11.1",
              "@types/react": "^18.3.10",
              "@types/react-dom": "^18.3.0",
              "@vitejs/plugin-react": "^4.3.2",
              "autoprefixer": "^10.4.20",
              "eslint": "^9.11.1",
              "eslint-plugin-react": "^7.37.0",
              "eslint-plugin-react-hooks": "^5.1.0-rc.0",
              "eslint-plugin-react-refresh": "^0.4.12",
              "globals": "^15.9.0",
              "postcss": "^8.4.47",
              "tailwindcss": "^3.4.14",
              "vite": "^5.4.8"
            }
          
          
    }, null, 2),
    'package.json': JSON.stringify({
        "name": "backend",
        "version": "2.0.1",
        "description": "A MERN stack template with frontend and backend boilerplate.",
        "main": "backend/server.js",
        "scripts": {
            "dev": " nodemon backend/server.js",
            "start": "node backend/server.js",
            "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
        },
        "keywords": [],
        "author": "",
        "type": "module",
        "license": "ISC",
        "dependencies": {
            "bcryptjs": "^2.4.3",
            "cookie-parser": "^1.4.7",
            "cors": "^2.8.5",
            "dotenv": "^16.4.5",
            "express": "^4.21.1",
            "helmet": "^8.0.0",
            "jsonwebtoken": "^9.0.2",
            "mongoose": "^8.7.1",
            "morgan": "^1.10.0"
        },
        "devDependencies": {
            "nodemon": "^3.1.7"
        }
        
    }
    , null, 2),
};

// Create directories
directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log(`Created directory: ${dirPath}`);
    }
});

// Create files
for (const [filePath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(process.cwd(), filePath), content);
    console.log(`Created file: ${filePath}`);
}

console.log('Project structure initialized.');
