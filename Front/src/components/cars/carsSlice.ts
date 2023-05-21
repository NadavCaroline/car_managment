import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import CarModel from '../../models/Car';
import OrderModel from '../../models/Order';
import { getAllCars, getCars, addCar, updateCar } from './carsAPI';
// import { getOrders } from './carssAPI';

export interface CarState {
  cars: CarModel[]
  error: string | null
  msg: string | null
}

const initialState: CarState = {
  cars: [],
  error: "",
  msg: ""
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
export const addCarsAsync = createAsyncThunk(
  'myCars/addCar',
  async ({ token, car }: { token: string, car: CarModel }) => {
    const response = await addCar(token, car);
    return response;
  }
);
export const updateCarAsync = createAsyncThunk(
  'myCars/updateCar',
  async ({ token, car }: { token: string, car: CarModel }) => {
    const response = await updateCar(token, car);
    return response;
  }
);

export const carsSlice = createSlice({
  name: 'myCars',
  initialState,
  reducers: {
    SetError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    SetMsg: (state) => {
      state.msg = ""
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCarsAsync.fulfilled, (state, action) => {
        state.cars = action.payload
      })
      .addCase(getCarsAsync.fulfilled, (state, action) => {
        state.cars = action.payload
      })
      .addCase(addCarsAsync.fulfilled, (state, action) => {
        state.cars.push(action.payload)
        state.msg = "מכונית נוספה בהצלחה"
      })
      .addCase(updateCarAsync.fulfilled, (state, action) => {
        let temp = state.cars.filter(car => car.id === action.payload.id)[0]
        temp.department = action.payload.department
      });
  },
});

export const {SetError, SetMsg } = carsSlice.actions;
export const carsSelector = (state: RootState) => state.myCars.cars;
export const carError = (state: RootState) => state.myCars.error;
export const carMessage = (state: RootState) => state.myCars.msg;
export default carsSlice.reducer;
