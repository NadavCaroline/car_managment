import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { LogModel } from '../../models/Log';
import { getLogs } from './logsAPI';


export interface depsState {
    logs: LogModel[]
}

const initialState: depsState = {
    logs: []
};


export const getLogsAsync = createAsyncThunk(
    'log/getLogs',
    async (token: string) => {
        const response = await getLogs(token);
        return response;
    }
);

export const logSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLogsAsync.fulfilled, (state, action) => {
                state.logs = action.payload;
            });
    },
});

export const { } = logSlice.actions;
export const logsSelector = (state: RootState) => state.log.logs;
export default logSlice.reducer;
