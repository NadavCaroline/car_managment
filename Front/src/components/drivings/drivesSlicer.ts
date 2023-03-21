import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { addDrive } from './drivesAPI';
import { DriveModel } from '../../models/Drive'

export interface DriveState {
  drives: DriveModel[]
}

const initialState: DriveState = {
  drives: []
};

// export const getOrdersAsync = createAsyncThunk(
//   'myOrder/getOrders',
//   async (token: string) => {
//     const response = await getOrders(token);
//     return response;
//   }
// );

export const addOrderAsync = createAsyncThunk(
  'drive/addDrive',
  async ({ token, drive }: { token: string, drive: DriveModel }) => {
    const response = await addDrive(token, drive);
    return response;
  }
);

export const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    //   .addCase(getOrdersAsync.fulfilled, (state, action) => {
    //     state.orders = action.payload
    //   })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        console.log(action.payload)
      });
  },
});

export const { } = driveSlice.actions;
export const ordersSelector = (state: RootState) => state.drive.drives;
export default driveSlice.reducer;
