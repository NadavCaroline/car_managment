import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { DepModel } from '../../models/Deps';
import { addDep, getDeps } from './depsAPI';


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

export const addDepAsync = createAsyncThunk(
    'dep/addDep',
    async ({token, dep}: {token: string, dep: DepModel}) => {
        const response = await addDep(token, dep);
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
            })
            .addCase(addDepAsync.fulfilled, (state, action) => {
                state.deps.push(action.payload);
            });
    },
});

export const { } = depsSlice.actions;
export const depsSelector = (state: RootState) => state.dep.deps;
export default depsSlice.reducer;
