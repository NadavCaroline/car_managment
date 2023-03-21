import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { DepModel } from '../../models/Deps';
import { getDeps } from './depsAPI';


export interface depsState {
    deps: DepModel[]
}

const initialState: depsState = {
    deps: []
};


export const getDepsAsync = createAsyncThunk(
    'dep/getDeps',
    async (token: string) => {
        const response = await getDeps(token);
        return response;
    }
);

export const depsSlice = createSlice({
    name: 'dep',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepsAsync.fulfilled, (state, action) => {
                state.deps = action.payload;
            });
    },
});

export const { } = depsSlice.actions;
export const depsSelector = (state: RootState) => state.dep.deps;
export default depsSlice.reducer;
