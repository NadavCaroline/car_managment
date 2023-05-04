import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import ShiftModel from '../../models/Shift';

// import { getShifts } from './shiftsAPI' ;
import { getShifts, addShift } from './shiftsAPI';

export interface shiftsState {
    shifts: ShiftModel[]
    error: string | null
    msg:string | null


}

const initialState: shiftsState = {
    shifts: [],
    error: "",
    msg:""
};


export const getshiftsAsync = createAsyncThunk(
    'shifts/getshifts',
    async (token: string) => {
        const response = await getShifts(token);
        return response;
    }
);
export const addShiftAsync = createAsyncThunk(
    'myCars/addShift',
    async ({ token, shift }: { token: string, shift: ShiftModel }) => {
        const response = await addShift(token, shift);
        return response;
    }
);

export const shiftsSlice = createSlice({
    name: 'shifts',
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
            .addCase(getshiftsAsync.fulfilled, (state, action) => {
                state.shifts = action.payload;
            })
            .addCase(addShiftAsync.fulfilled, (state, action) => {
                if (action.payload.status === 201) {//successfull created
                    state.shifts.push(action.payload.data)
                    state.msg = "תורנות נוצרה ונשלחה בהצלחה"
                }
                else if (action.payload.status === 208) {//already exists
                    state.error = action.payload.data;
                }
                else if (action.payload.status === 401) {
                    state.error = '';
                }
                
            })
            .addCase(addShiftAsync.rejected, (state, action) => {
                state.error = action.error.message ?? ''
            });
    },
});
export const { SetError,SetMsg } = shiftsSlice.actions;
export const shiftError = (state: RootState) => state.shifts.error;
export const shiftMessage = (state: RootState) => state.shifts.msg;
export const shiftSelector = (state: RootState) => state.shifts.shifts;
export default shiftsSlice.reducer;
