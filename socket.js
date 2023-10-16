import * as SocketIO from "socket.io";
import { firestore, db } from "./firebase.js";

const webSocket = (server, app) => {
  const io = new SocketIO.Server(server, { path: "/socket.io" });
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("새로운 클라이언트 접속", socket.id);

    socket.on("createRoom", async () => {
      console.log("createRoom event received");

      const roomRef = await firestore.addDoc(firestore.collection(db, "rooms"), {});
      console.log("방 생성", roomRef.id);
      socket.join(roomRef.id);
      console.log(`${socket.id}는 ${roomRef.id}에 입장`);
    });

    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", socket.id);
    });
  });
};

export default webSocket;
