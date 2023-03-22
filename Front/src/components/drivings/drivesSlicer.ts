import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { getDrives, startDrive } from './drivesAPI';
import { DriveModel } from '../../models/Drive'

export interface DriveState {
  drives: DriveModel[]
}

const initialState: DriveState = {
  drives: []
};

export const getDrivesAsync = createAsyncThunk(
  'myOrder/getDrives',
  async (token: string) => {
    const response = await getDrives(token);
    return response;
  }
);

export const startDriveAsync = createAsyncThunk(
  'drive/startDrive',
  async ({ token, drive }: { token: string, drive: DriveModel }) => {
    const response = await startDrive(token, drive);
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
      .addCase(getDrivesAsync.fulfilled, (state, action) => {
        state.drives = action.payload
      })
      .addCase(startDriveAsync.fulfilled, (state, action) => {
        state.drives.push(action.payload)
      });
  },
});

export const { } = driveSlice.actions;
export const drivesSelector = (state: RootState) => state.drive.drives;
export default driveSlice.reducer;
