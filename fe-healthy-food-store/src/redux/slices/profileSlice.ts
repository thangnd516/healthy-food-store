import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  isUpdated: boolean;
} = {
  isUpdated: true,
};

const profileSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updatedProfile: (state, actions) => {
      return {
        ...state,
        isUpdated: actions?.payload,
      };
    },
  },
});

export const { updatedProfile } = profileSlice.actions;
export default profileSlice.reducer;
