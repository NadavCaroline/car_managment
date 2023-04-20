import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import CarModel from '../../models/Car';
import { DatesCheck } from '../../models/DatesCheck';
import OrderModel from '../../models/Order';
import { addOrder, checkOrderDates, getOrders, orderEnded } from './OrdersAPI';

export interface OrderState {
  orders: OrderModel[]
  availableCars: CarModel[]
  notAvilable: CarModel[]
  orderDetails: any[]
  activeOrder: boolean
}

const initialState: OrderState = {
  orders: [],
  availableCars: [],
  notAvilable: [],
  orderDetails: [],
  activeOrder: false
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

export const orderEndedAsync = createAsyncThunk(
  'myOrder/orderEnded',
  async ({ token, id }: { token: string, id: number }) => {
    const response = await orderEnded(token, id);
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
        state.activeOrder = state.orders.find(order => new Date(order.fromDate).getTime() <= new Date().getTime() && new Date(order.toDate).getTime() >= new Date().getTime() && order.ended === false) ? true : false
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        console.log(action.payload)
        state.orders.push(action.payload)
      })
      .addCase(orderEndedAsync.fulfilled, (state, action) => {
        let temp = state.orders.filter(order => order.id === action.payload.id)[0]
        temp.ended = true
      })
      .addCase(checkOrderDatesAsync.fulfilled, (state, action) => {
        console.log(action.payload)
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
export const isActiveOrderSelector = (state: RootState) => state.myOrder.activeOrder;
export default myOrderSlice.reducer;
