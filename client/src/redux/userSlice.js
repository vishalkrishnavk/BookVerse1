import { createSlice } from "@reduxjs/toolkit";
import { user } from "../assets/data";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? user,
  edit: false,
  isLoggedIn: false,
  role: localStorage.getItem("role") || "user", // Initialize from localStorage
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.role = action.payload.role; // Set the role from payload
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("id", action.payload._id);
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.role = "user"; // Reset role to default
      localStorage?.removeItem("user");
      localStorage?.removeItem("role");
      localStorage?.removeItem("id");
      localStorage?.removeItem("token");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
    changeRole(state, action) {
      state.role = action.payload;
    },
  },
});
export default userSlice.reducer;
export const authActions = userSlice.actions;

export function UserLogin(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login(user));
  };
}

export function Logout() {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.logout());
  };
}

export function UpdateProfile(val) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.updateProfile(val));
  };
}
