import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { endDrive, getAllDrives, getDrives, startDrive } from './drivesAPI';
import { DriveModel } from '../../models/Drive'

export interface DriveState {
  drives: DriveModel[]
  allDrives: DriveModel[]
}

const initialState: DriveState = {
  drives: [],
  allDrives: []
};

export const getDrivesAsync = createAsyncThunk(
  'myOrder/getDrives',
  async (token: string) => {
    const response = await getDrives(token);
    return response;
  }
);

export const getAllDrivesAsync = createAsyncThunk(
  'myOrder/getAllDrives',
  async (token: string) => {
    const response = await getAllDrives(token);
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

export const endDriveAsync = createAsyncThunk(
  'drive/endDrive',
  async ({ token, drive }: { token: string, drive: DriveModel }) => {
    const response = await endDrive(token, drive);
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
        // Sort the user's drives by the start date
        state.drives = state.drives.sort((a: DriveModel, b: DriveModel) => {
          if (a.startDate! < b.startDate!) {
            return -1;
          } else if (a.startDate! > b.startDate!) {
            return 1;
          } else {
            return 0;
          }
        })
      })
      .addCase(getAllDrivesAsync.fulfilled, (state, action) => {
        state.allDrives = action.payload
      })
      .addCase(startDriveAsync.fulfilled, (state, action) => {
        state.drives.push(action.payload)
      })
      .addCase(endDriveAsync.fulfilled, (state, action) => {
        let temp = state.drives.filter(drive => drive.id === action.payload.id)[0]
        temp.endDate = action.payload.endDate
        temp.endImg1 = action.payload.endImg1
        temp.endImg2 = action.payload.endImg2
        temp.endImg3 = action.payload.endImg3
        temp.comments = action.payload.comments
        temp.endKilometer = action.payload.endKilometer
      });
  },
});

export const { } = driveSlice.actions;
export const drivesSelector = (state: RootState) => state.drive.drives;
export const allDrivesSelector = (state: RootState) => state.drive.allDrives;
export default driveSlice.reducer;
