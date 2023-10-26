import * as SocketIO from "socket.io";

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

      rooms[roomId] = [];
      rooms[roomId].push(socket.id);

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

      // 방에 있는 객체에게 joinRoom 이벤트를 발생시킨다.
      socket.to(roomId).emit("joinRoom", {
        remoteId: socket.id,
      });

      rooms[roomId].push(socket.id);
      socket.join(roomId);

      console.log("방 참여", roomId);
      console.log("방에 입장한 사람들: ", rooms[roomId]);

      socket.emit("joinRoomResult", {
        result: true,
        roomId: roomId,
      });
    });

    socket.on("offer", async (data) => {
      let { roomId, localId, remoteId, offer } = data;

      // remoteId에게 offer를 전달한다.
      socket.to(remoteId).emit("offer", {
        offer: offer,
        remoteId: localId,
      });
    });

    socket.on("answer", async (data) => {
      let { roomId, localId, remoteId, answer } = data;

      // remoteId에게 answer를 전달한다.
      socket.to(remoteId).emit("answer", {
        answer: answer,
        remoteId: localId,
      });
    });

    socket.on("iceFromRoom", (data) => {
      let { roomId, localId, remoteId, candidate } = data;

      socket.to(remoteId).emit("iceFromRoom", {
        candidate: candidate,
        remoteId: localId,
      });
    });

    socket.on("iceFromUser", (data) => {
      let { roomId, localId, remoteId, candidate } = data;

      socket.to(remoteId).emit("iceFromUser", {
        candidate: candidate,
        remoteId: localId,
      });
    });
  });
};

function generate16randomeString() {
  return Math.random().toString(16).slice(2).toString();
}

export default webSocket;
