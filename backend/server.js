require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const PORT = process.env.PORT || 4000;



// Set up server and socket.io
const server = http.createServer(app);
const io = new Server(server, {
     origin: "*", // Allow all origins
    methods: ["GET", "POST","PUT","DELETE"], // Specify allowed methods
});

// Middleware
app.use(express.json());
const corsOptions = {
    origin: "*", 
    methods: ["GET", "POST","PUT","DELETE"], 
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/college", collegeRoutes);
app.use("/api/v1/job", authMiddleware, jobRoutes);
app.use("/api/v1/application", authMiddleware, applicationRoutes);

const generateChatbotResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    const responseMap = {
        'placement': [
            'Our campus placement drive offers opportunities with top companies.',
            'We have comprehensive placement support for students.',
            'Check our job portal for the latest placement opportunities.'
        ],
        'resume': [
            'A strong resume should highlight your skills, projects, and achievements.',
            'Need resume tips? Focus on relevant experiences and technical skills.',
            'Ensure your resume is well-formatted and error-free.'
        ],
        'interview': [
            'Prepare by researching common interview questions and practicing your responses.',
            'Technical interviews require in-depth knowledge of your field.',
            'Soft skills are just as important as technical skills.'
        ],
        'job': [
            'We have multiple job openings across various sectors.',
            'Browse our job listings to find opportunities matching your skills.',
            'Apply early and prepare thoroughly for each application.'
        ],
        'help': [
            'I can help you with placement-related queries.',
            'Ask me about jobs, resume preparation, or interview tips.',
            'What specific information are you looking for?'
        ]
    };


    for (let key in responseMap) {
        if (lowerMessage.includes(key)) {
            return responseMap[key][Math.floor(Math.random() * responseMap[key].length)];
        }
    }

    // Default response
    return "I'm here to help with your placement-related queries. What would you like to know?";
};


io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);


    socket.on("send_message", (data, callback) => {
        const botResponseText = generateChatbotResponse(data.message);

        // Emit user message immediately (no saving to DB)
        io.emit("receive_message", {
            user: data.user || 'Anonymous',
            message: data.message,
            timestamp: new Date()
        });

 
        io.emit("receive_message", {
            user: 'Placement Bot',
            message: botResponseText,
            timestamp: new Date()
        });


        if (callback && typeof callback === 'function') {
            callback({ success: true, botResponse: botResponseText });
        } else {
            console.error("Callback is not a function");
        }
    });


    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


server.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
