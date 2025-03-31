import { createSlice } from "@reduxjs/toolkit";
import { user } from "../assets/data";
import {
  connectSocket as initSocket,
  getSocket,
  disconnectSocket as closeSocket,
} from "../utils/socketService";

const URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8800" : "/";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? user,
  edit: false,
  isLoggedIn: false,
  role: localStorage.getItem("role") || "user",
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.role = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("id", action.payload._id);
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.role = "user";
      localStorage?.removeItem("user");
      localStorage?.removeItem("role");
      localStorage?.removeItem("id");
      localStorage?.removeItem("token");

      // Disconnect socket on logout
      if (state.socket?.connected) {
        state.socket.disconnect();
      }
      state.socket = null;
      state.onlineUsers = [];
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
    changeRole(state, action) {
      state.role = action.payload;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

// ** Connect to WebSocket **
export const connectSocket = () => (dispatch, getState) => {
  const { user } = getState().user;

  if (!user) return;

  const socket = initSocket(user._id);

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(userSlice.actions.setOnlineUsers(userIds));
  });

  socket.connect();
};

// ** Disconnect WebSocket **
export const disconnectSocket = () => (dispatch, getState) => {
  closeSocket();
  dispatch(userSlice.actions.setOnlineUsers([]));
};

// Export Actions & Reducer
export const { login, logout, updateProfile, changeRole } = userSlice.actions;
export default userSlice.reducer;
