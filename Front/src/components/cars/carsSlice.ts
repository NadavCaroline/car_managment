import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import CarModel from '../../models/Car';
import OrderModel from '../../models/Order';
import { getAllCars, getCars } from './carsAPI';
// import { getOrders } from './carssAPI';

export interface CarState {
  cars: CarModel[]
}

const initialState: CarState = {
  cars: []
};

export const getCarsAsync = createAsyncThunk(
  'myCars/getCars',
  async (token: string) => {
    const response = await getCars(token);
    return response;
  }
);

export const getAllCarsAsync = createAsyncThunk(
  'myCars/getAllCars',
  async (token: string) => {
    const response = await getAllCars(token);
    return response;
  }
);

export const carsSlice = createSlice({
  name: 'myCars',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(getAllCarsAsync.fulfilled, (state, action) => {
      state.cars = action.payload
    })
      .addCase(getCarsAsync.fulfilled, (state, action) => {
        state.cars = action.payload
      });
  },
});

export const { } = carsSlice.actions;
export const carsSelector = (state: RootState) => state.myCars.cars;
export default carsSlice.reducer;
