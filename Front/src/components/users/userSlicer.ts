import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { getUsers, updateUser,getUsersOfDep } from './usersAPI';
import { UserModel } from '../../models/User';


export interface usersState {
    users: UserModel[]
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
export const updateUserAsync = createAsyncThunk(
    'users/updateUser',
    async ({token, user}: {token: string, user: UserModel}) => {
        const response = await updateUser(token, user);
        return response;
    }
);
export const getUsersOfDepAsync = createAsyncThunk(
    'users/getUsersOfDep',
    async (token: string) => {
        const response = await getUsersOfDep(token);
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
                state.users = action.payload;
            })
            .addCase(getUsersOfDepAsync.fulfilled, (state, action) => {
                state.users = action.payload;
            });
    },
});

export const usersSelector = (state: RootState) => state.users.users;
export default usersSlice.reducer;