import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import CarMaintenanceModel from '../../models/CarMaintenance';
import { getCarMaintenance, getCarMaintenanceByCar, addCarMaintenance, updateCarMaintenance } from './carMaintenanceAPI';

export interface CarMaintenanceState {
  carMaintenance: CarMaintenanceModel[]
  error: string | null
  msg: string | null
}

const initialState: CarMaintenanceState = {
  carMaintenance: [],
  error: "",
  msg: ""
};

export const getCarMaintenanceByCarAsync = createAsyncThunk(
  'carMaintenance/getCarMaintenanceByCar',
  async ({ token, carid }: { token: string, carid: string }) => {
    const response = await getCarMaintenanceByCar(token, carid);
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

export const addCarMaintenanceAsync = createAsyncThunk(
  'carMaintenance/addCarMaintance',
  async ({ token, carMaintenance }: { token: string, carMaintenance: CarMaintenanceModel }) => {
    const response = await addCarMaintenance(token, carMaintenance);
    return response;
  }
);
export const updateCarMaintenanceAsync = createAsyncThunk(
  'carMaintenance/updateCarMaintenance',
  async ({ token, carMaintenance }: { token: string, carMaintenance: CarMaintenanceModel }) => {
    const response = await updateCarMaintenance(token, carMaintenance);
    return response;
  }
);
export const carMaintenanceSlice = createSlice({
  name: 'carMaintenance',
  initialState,
  reducers: {
    SetErrorCarMaintenance: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    SetMsgCarMaintenance: (state) => {
      state.msg = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCarMaintenanceAsync.fulfilled, (state, action) => {
        state.carMaintenance = action.payload
      })
      .addCase(addCarMaintenanceAsync.fulfilled, (state, action) => {
        if (action.payload.status === 201) {//successfull created
          state.carMaintenance.push(action.payload.data)
          state.msg = "מסמך נוסף בהצלחה"
        }
        else if (action.payload.status === 208) {//already exists
          state.error = action.payload.data;
        }
        else if (action.payload.status === 401) {
          state.error = '';
        }
      })
      .addCase(updateCarMaintenanceAsync.fulfilled, (state, action) => {
        if (action.payload.status === 200) {//successfull updated
          state.msg = "מסמך  עודכן בהצלחה"
        }
        else if (action.payload.status === 208) {//already exists
          state.error = action.payload.data;
        }
        else if (action.payload.status === 401) {
          state.error = '';
        }
      })
  },
});

export const { SetErrorCarMaintenance, SetMsgCarMaintenance } = carMaintenanceSlice.actions;
export const carMaintenanceSelector = (state: RootState) => state.carMaintenance.carMaintenance;
export const carMaintenanceError = (state: RootState) => state.carMaintenance.error;
export const carMaintenanceMessage = (state: RootState) => state.carMaintenance.msg;
export default carMaintenanceSlice.reducer;
