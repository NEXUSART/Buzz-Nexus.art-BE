import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

let buzzedUser: string | null = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("buzz", (name: string) => {
    if (!buzzedUser) {
      buzzedUser = name;
      io.emit("buzzed", buzzedUser);
    }
  });

  socket.on("reset", () => {
    buzzedUser = null;
    io.emit("reset");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
