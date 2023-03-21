import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import CarModel from '../../models/Car';
import { DatesCheck } from '../../models/DatesCheck';
import OrderModel from '../../models/Order';
import { addOrder, checkOrderDates, getOrders } from './OrdersAPI';

export interface OrderState {
  orders: OrderModel[]
  availableCars: CarModel[]
  notAvilable: CarModel[]
  orderDetails: any[]
}

const initialState: OrderState = {
  orders: [],
  availableCars: [],
  notAvilable: [],
  orderDetails: []
};

export const getOrdersAsync = createAsyncThunk(
  'myOrder/getOrders',
  async (token: string) => {
    const response = await getOrders(token);
    return response;
  }
);

export const addOrderAsync = createAsyncThunk(
  'myOrder/addOrder',
  async ({ token, order }: { token: string, order: OrderModel }) => {
    const response = await addOrder(token, order);
    return response;
  }
);

export const checkOrderDatesAsync = createAsyncThunk(
  'myOrder/checkOrderDates',
  async ({ token, dates }: { token: string, dates: DatesCheck }) => {
    const response = await checkOrderDates(token, dates);
    return response;
  }
);

export const myOrderSlice = createSlice({
  name: 'myOrder',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        state.orders.push(action.payload)
      })
      .addCase(checkOrderDatesAsync.fulfilled, (state, action) => {
        state.availableCars = action.payload.available
        state.notAvilable = action.payload.notAvilable
        state.orderDetails = action.payload.orderDetails
      });
  },
});

export const { } = myOrderSlice.actions;
export const ordersSelector = (state: RootState) => state.myOrder.orders;
export const availableCarsSelector = (state: RootState) => state.myOrder.availableCars;
export const notAvilableSelector = (state: RootState) => state.myOrder.notAvilable;
export const orderDetailsSelector = (state: RootState) => state.myOrder.orderDetails;
export default myOrderSlice.reducer;
