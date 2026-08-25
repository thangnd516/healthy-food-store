import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addMealToCart,
  getUser,
  removeAllProduct,
  removeMealFromCart,
} from "../../services/user";

export const fetchDataUser = createAsyncThunk(
  "user/fetchDataUser",
  async (uid: string) => {
    const response: any = await getUser(uid);
    return response?.userData?.cart;
  }
);

export const createMealToCart = createAsyncThunk(
  "user/addMealToCart",
  async (dataMeal: { mid: string; quantity: number; actions: string }) => {
    const response: any = await addMealToCart(dataMeal);
    return response.addToCartData;
  }
);

export const removeMeal = createAsyncThunk(
  "user/removeMealFromCart",
  async (mid: string) => {
    const response: any = await removeMealFromCart(mid);
    return response.data;
  }
);

export const removeAllMeal = createAsyncThunk(
  "user/removeAllMealFromCart",
  async () => {
    const response: any = await removeAllProduct();
    return response?.response?.cart;
  }
);
const initialState: {
  isCreated: boolean;
  isRemoved: boolean;
  listCarts: [];
} = {
  isCreated: true,
  isRemoved: true,
  listCarts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataUser.fulfilled, (state, action) => {
        state.listCarts = action?.payload;
      })
      .addCase(createMealToCart.pending, (state) => {
        state.isCreated = false;
      })
      .addCase(createMealToCart.fulfilled, (state, action) => {
        if (action.payload?.cart) {
          state.listCarts = action.payload?.cart;
        } else state.listCarts = state.listCarts;
        state.isCreated = true;
      })
      .addCase(createMealToCart.rejected, (state) => {
        state.isCreated = true;
      })
      .addCase(removeMeal.fulfilled, (state, action) => {
        if (action.payload?.cart) {
          state.listCarts = action.payload?.cart;
        }
        state.isRemoved = true;
      })
      .addCase(removeAllMeal.fulfilled, (state, action) => {
        if (action) {
          state.listCarts = action.payload?.cart;
        }
        state.isRemoved = false;
      });
  },
});
export default cartSlice.reducer;
