import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { MaintenanceTypeModel } from '../../models/MaintenanceType';
import { getmaintenanceType,addMaintenanceType,updateMaintenanceType } from './maintenanceTypeAPI';

export interface maintenanceTypeState {
    maintenanceType: MaintenanceTypeModel[]
    error: string | null
    msg: string | null
}

const initialState: maintenanceTypeState = {
    maintenanceType:[],
    error: "",
    msg: ""
};


export const getmaintenanceTypeAsync = createAsyncThunk(
    'maintenanceType/getmaintenanceType',
    async (token: string) => {
        const response = await getmaintenanceType(token);
        return response;
    }
);
export const addMaintenanceTypeAsync = createAsyncThunk(
    'maintenanceType/addMaintenanceType',
    async ({ token, maintenanceType }: { token: string, maintenanceType: MaintenanceTypeModel }) => {
      const response = await addMaintenanceType(token, maintenanceType);
      return response;
    }
  );
  export const updateMaintenanceTypeAsync = createAsyncThunk(
    'maintenanceType/updateMaintenanceType',
    async ({ token, maintenanceType }: { token: string, maintenanceType: MaintenanceTypeModel }) => {
      const response = await updateMaintenanceType(token, maintenanceType);
      return response;
    }
  );

export const maintenanceTypeSlice = createSlice({
    name: 'maintenanceType',
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
            .addCase(getmaintenanceTypeAsync.fulfilled, (state, action) => {
                state.maintenanceType = action.payload;
            })
            .addCase(addMaintenanceTypeAsync.fulfilled, (state, action) => {
                if (action.payload.status === 201) {//successfull created
                  state.maintenanceType.push(action.payload.data)
                  state.msg = "סוג תורנות נוסף בהצלחה"
                }
                else if (action.payload.status === 208) {//already exists
                  state.error = action.payload.data;
                }
                else if (action.payload.status === 401) {
                  state.error = '';
                }
              })
              .addCase(updateMaintenanceTypeAsync.fulfilled, (state, action) => {
                if (action.payload.status === 200) {//successfull updated
                  state.msg = "סוג תורנות  עודכן בהצלחה"
                  let temp = state.maintenanceType.filter(maintenanceType => maintenanceType.id === action.payload.data.id)[0]
                  temp.name = action.payload.data.name
                  temp.imgLogo = action.payload.data.imgLogo
                 
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
export const { SetError, SetMsg } = maintenanceTypeSlice.actions;
export const maintenanceTypeSelector = (state: RootState) => state.maintenanceTypes.maintenanceType;
export const maintenanceTypeMessage = (state: RootState) => state.maintenanceTypes.msg;
export const maintenanceTypeError = (state: RootState) => state.maintenanceTypes.error;

export default maintenanceTypeSlice.reducer;
