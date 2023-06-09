import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import CarModel from '../../models/Car';
import { DatesCheck } from '../../models/DatesCheck';
import OrderModel from '../../models/Order';
import { addOrder, checkOrderDates, checkOrderUpdateDates, getOrders, orderEnded, updateOrder } from './OrdersAPI';

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
export const updateOrderAsync = createAsyncThunk(
  'myOrder/updateOrder',
  async ({ token, order, id }: { token: string, order: OrderModel, id: number }) => {
    const response = await updateOrder(token, id, order);
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
export const checkOrderUpdateDatesAsync = createAsyncThunk(
  'myOrder/checkOrderUpdateDates',
  async ({ token, dates, id }: { token: string, dates: DatesCheck, id: number }) => {
    const response = await checkOrderUpdateDates(token, dates, id);
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
        state.orders.push(action.payload)
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        let temp = state.orders.filter(order => order.id === action.payload.id)[0]
        console.log(temp)
        temp.orderDate = action.payload.orderDate
        temp.fromDate = action.payload.fromDate
        temp.toDate = action.payload.toDate
        temp.car = action.payload.car
        temp.destination = action.payload.destination
        temp.isAllDay = action.payload.isAllDay
      })
      .addCase(orderEndedAsync.fulfilled, (state, action) => {
        let temp = state.orders.filter(order => order.id === action.payload.id)[0]
        temp.ended = true
      })
      .addCase(checkOrderDatesAsync.fulfilled, (state, action) => {
        state.availableCars = action.payload.available
        state.notAvilable = action.payload.notAvilable
        state.orderDetails = action.payload.orderDetails
      })
      .addCase(checkOrderUpdateDatesAsync.fulfilled, (state, action) => {
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
