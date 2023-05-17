import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import CarMaintenanceModel from '../../models/CarMaintenance';
import { getCarMaintenance, getCarMaintenanceByCar } from './carMaintenanceAPI';

export interface CarMaintenanceState {
  carMaintenance: CarMaintenanceModel[]
}

const initialState: CarMaintenanceState = {
    carMaintenance: []
};

export const getCarMaintenanceByCarAsync = createAsyncThunk(
  'carMaintenance/getCarMaintenanceByCar',
  async ({token, carid}: {token: string, carid: string}) => {
    const response = await getCarMaintenanceByCar(token,carid);
    return response;
  }
);
export const getCarMaintenanceAsync = createAsyncThunk(
  'carMaintenance/getCarMaintenance',
  async (token: string) => {
    const response = await getCarMaintenance(token);
    return response;
  }
);

export const carMaintenanceSlice = createSlice({
  name: 'carMaintenance',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(getCarMaintenanceAsync.fulfilled, (state, action) => {
      state.carMaintenance = action.payload
    })
  },
});

export const { } = carMaintenanceSlice.actions;
export const carMaintenanceSelector = (state: RootState) => state.carMaintenance.carMaintenance;
export default carMaintenanceSlice.reducer;
