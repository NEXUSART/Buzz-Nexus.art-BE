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

let buzzedUsers: string[] = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("buzz", (name: string) => {
    if (!buzzedUsers.includes(name)) {
      buzzedUsers.push(name);
      io.emit("buzzed", name);
    }
  });

  socket.on("reset", () => {
    buzzedUsers = [];
    io.emit("reset");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


httpServer.listen(4000, () => {
  console.log("Server running on production");
});
