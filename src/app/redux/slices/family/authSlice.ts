import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { NationalityList, Nationality } from "../../types";

const initialState: { isAdmin: boolean } = {
  isAdmin: true,
};


export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
   
    setAuthRole(state, action: PayloadAction<boolean>) {
        console.log("DXD: inside reducer: ", action.payload);
      state.isAdmin = action.payload;
    },

  },
});

export const { setAuthRole } = authSlice.actions;

export default authSlice.reducer;
