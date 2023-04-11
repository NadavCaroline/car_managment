import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { getUsers } from './usersAPI';


export interface usersState {
    users: any[]
}

const initialState: usersState = {
    users: []

};

export const getUsersAsync = createAsyncThunk(
    'users/getUsers',
    async (token: string) => {
        const response = await getUsers(token);
        return response;
    }
);


export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsersAsync.fulfilled, (state, action) => {
                console.log(action.payload)
                state.users = action.payload;
            });
    },
});

export const usersSelector = (state: RootState) => state.users.users;
export default usersSlice.reducer;