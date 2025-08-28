import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"; // ✅ pour décoder le JWT
import { registerUserSocket } from "./services/notificationService.js"; // ✅

dotenv.config();

const PORT = process.env.PORT || 5000;

// Créer un serveur HTTP à partir d’Express
const server = http.createServer(app);

// Attacher Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ en prod, remplace par ton frontend (ex: "http://localhost:3000")
    methods: ["GET", "POST"]
  }
});

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
  console.log("🟢 Client connecté:", socket.id);

  // ✅ Lorsqu’un client envoie son token pour s’authentifier
  socket.on("auth", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      registerUserSocket(socket, userId); // mappe socket ↔ userId
    } catch (err) {
      console.log("❌ Token invalide pour socket:", socket.id);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client déconnecté:", socket.id);
  });
});

// Rendre accessible io dans toute l’app
app.set("io", io);

// Lancer le serveur
server.listen(PORT, () => {
  console.log(`🚀 Kalyptia Backend running on http://localhost:${PORT}`);
});
