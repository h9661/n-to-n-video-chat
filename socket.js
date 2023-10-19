import * as SocketIO from "socket.io";
import { firestore, db } from "./firebase.js";
import util from "util";

const webSocket = (server, app) => {
  const io = new SocketIO.Server(server, { path: "/socket.io" });
  let rooms = {};
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("새로운 클라이언트 접속", socket.id);

    socket.on("createRoom", async () => {
      console.log("createRoom event received");
      let roomId = generate16randomeString();
      console.log("방 생성", roomId);

      // 방을 만들고, 방에 socketId를 key값으로 가지는 객체를 만들어서 넣어준다.
      rooms[roomId] = {};
      rooms[roomId][socket.id] = {};

      socket.join(roomId);
      socket.emit("createRoom", {
        roomId: roomId,
      });
    });

    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", socket.id);
    });

    socket.on("joinRoom", async (data) => {
      let { roomId } = data;

      // 방이 존재하지 않으면, 에러를 발생시킨다.
      if (!rooms[roomId]) {
        socket.emit("joinRoomResult", {
          result: false,
        });

        return false;
      }

      // 방에 있는 객체를 순회하며, 연결을 구성할 준비를 한다.
      // callercandidate, calleecandidate, offer, answer등의 정보를 주고받을 수 있도록 한다.
      for (let id in rooms[roomId]) {
        rooms[roomId][id][socket.id] = { callercandidates: [], calleecandidates: [], offer: {}, answer: {} };
      }

      // 방에 있는 객체에게 joinRoom 이벤트를 발생시킨다.
      socket.to(roomId).emit("joinRoom", {
        remoteId: socket.id,
      });

      socket.emit("joinRoomResult", {
        result: true,
        roomId: roomId,
      });

      // 객체 inspection
      console.log(util.inspect(rooms, { showHidden: true, depth: Infinity }));
    });
  });
};

function generate16randomeString() {
  return Math.random().toString(16).slice(2).toString();
}

export default webSocket;
