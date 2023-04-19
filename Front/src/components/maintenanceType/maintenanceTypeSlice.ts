import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { MaintenanceTypeModel } from '../../models/MaintenanceType';
// import { getmaintenanceType } from './maintenanceTypeAPI' ;
import { getmaintenanceType } from './maintenanceTypeAPI';

export interface maintenanceTypeState {
    maintenanceType: MaintenanceTypeModel
}

const initialState: maintenanceTypeState = {
    maintenanceType: {
        id: 0,
        name: '',
    }
};


export const getmaintenanceTypeAsync = createAsyncThunk(
    'maintenanceType/getmaintenanceType',
    async (token: string) => {
        const response = await getmaintenanceType(token);
        return response;
    }
);

export const maintenanceTypeSlice = createSlice({
    name: 'maintenanceType',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getmaintenanceTypeAsync.fulfilled, (state, action) => {
                state.maintenanceType = action.payload;
                // state.maintenanceType = action.payload;
            });
    },
});

export const { } = maintenanceTypeSlice.actions;
// export const maintenanceTypeelector = (state: RootState) => state.maintenanceType.maintenanceType;
export default maintenanceTypeSlice.reducer;
