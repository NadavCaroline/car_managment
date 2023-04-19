import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { ShiftModel } from '../../models/Shift';
// import { getShifts } from './shiftsAPI' ;
import { getShifts } from './shiftsAPI';

export interface shiftsState {
    shifts: ShiftModel
}

const initialState: shiftsState = {
    shifts: {
        id: 0,
        user1:'',
        user_name1: '',
        user2:'',
        user_name2: '',
        car: '',
        car_name: '',
        shiftDate:'',
        maintenanceType: '',
        maintenance_name:'',
        comments:''
    }
};


export const getshiftsAsync = createAsyncThunk(
    'shifts/getshifts',
    async (token: string) => {
        const response = await getShifts(token);
        return response;
    }
);

export const shiftsSlice = createSlice({
    name: 'shifts',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getshiftsAsync.fulfilled, (state, action) => {
                state.shifts = action.payload;
                // state.shifts = action.payload;
            });
    },
});

export const { } = shiftsSlice.actions;
export const shiftSelector = (state: RootState) => state.shifts.shifts;
export default shiftsSlice.reducer;
