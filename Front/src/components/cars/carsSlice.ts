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
        if (action.payload.status === 201) {//successfull created
          state.cars.push(action.payload.data)
          state.msg = "מכונית נוספה בהצלחה"
        }
        else if (action.payload.status === 208) {//already exists
          state.error = action.payload.data;
        }
        else if (action.payload.status === 401) {
          state.error = '';
        }
      })
      .addCase(updateCarAsync.fulfilled, (state, action) => {
        if (action.payload.status === 200) {//successfull updated
          state.msg = "רכב  עודכן בהצלחה"

          let temp = state.cars.filter(car => car.id === action.payload.data.id)[0]
          temp.licenseNum = action.payload.data.licenseNum
          temp.nickName = action.payload.data.nickName
          temp.make = action.payload.data.make
          temp.model = action.payload.data.model
          temp.color = action.payload.data.color
          temp.year = action.payload.data.year
          temp.garageName = action.payload.data.garageName
          temp.garagePhone = action.payload.data.garagePhone
          temp.department = action.payload.data.department
          temp.isDisabled = action.payload.data.isDisabled
          // temp.image = action.payload.image
        }
        else if (action.payload.status === 208) {//already exists
          state.error = action.payload.data;
        }
        else if (action.payload.status === 401) {
          state.error = '';
        }

      });
  },
});

export const { SetError, SetMsg } = carsSlice.actions;
export const carsSelector = (state: RootState) => state.myCars.cars;
export const carError = (state: RootState) => state.myCars.error;
export const carMessage = (state: RootState) => state.myCars.msg;
export default carsSlice.reducer;
