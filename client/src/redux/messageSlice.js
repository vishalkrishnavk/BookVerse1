import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axiosConfig";
/* import { useAuth } from "./authStore.js"; */
import toast from "react-hot-toast";

// Initial state
const initialState = {
  messages: [],
  users: [],
  selectedUser: null,
  isGettingUsers: false,
  isGettingMessages: false,
};

// **Async thunk for fetching users (friends)**
export const getUsers = createAsyncThunk(
  "messages/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/messages/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await axiosInstance.put(
        `/messages/mark-as-read/${userId}`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, messages: res.data };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
      return rejectWithValue(error.response?.data);
    }
  }
);

// **Async thunk for marking messages as read**
export const markMessageAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.put(
        `/messages/mark-as-read/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(getUsers());
      return { userId };
    } catch (error) {
      console.error("Error in marking messages as read:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ selectedUser, messageData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/messages/${selectedUser._id}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    newMessageReceived: (state, action) => {
      const newMessage = action.payload;

      if (
        newMessage.senderId === state.selectedUser?._id ||
        newMessage.receiverId === state.selectedUser?._id
      ) {
        state.messages.push(newMessage);
      } else {
        state.users = state.users.map((user) =>
          user._id === newMessage.senderId
            ? { ...user, hasUnreadMessages: true }
            : user
        );
      }
    },
    messagesRead: (state, action) => {
      const { userId } = action.payload;
      state.users = state.users.map((user) =>
        user._id === userId ? { ...user, hasUnreadMessages: false } : user
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isGettingUsers = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isGettingUsers = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isGettingUsers = false;
      })
      .addCase(getMessages.pending, (state) => {
        state.isGettingMessages = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isGettingMessages = false;
        state.messages = action.payload.messages;
        state.users = state.users.map((user) =>
          user._id === action.payload.userId
            ? { ...user, hasUnreadMessages: false }
            : user
        );
      })
      .addCase(getMessages.rejected, (state) => {
        state.isGettingMessages = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const {
  setSelectedUser,
  newMessageReceived,
  messagesRead,
  connectToMessages,
  disconnectFromMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
