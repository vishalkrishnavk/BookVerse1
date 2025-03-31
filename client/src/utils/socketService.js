import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8800" : "/";
let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(URL, {
      query: { userId },
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
