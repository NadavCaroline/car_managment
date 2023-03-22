import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { ProfileModel } from '../../models/Profile';
import { getProfile } from './profileAPI';


export interface profileState {
    profile: ProfileModel
}

const initialState: profileState = {
    profile: {
        department: 0,
        jobTitle: ' ',
        realID: 0,
        roleLevel: 0,
        user: ' ',
        user_name: '',
        dep_name: ''
    }
};


export const getProfileAsync = createAsyncThunk(
    'profile/getProfile',
    async (token: string) => {
        const response = await getProfile(token);
        return response;
    }
);

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfileAsync.fulfilled, (state, action) => {
                state.profile = action.payload;
            });
    },
});

export const { } = profileSlice.actions;
export const profileSelector = (state: RootState) => state.profile.profile;
export default profileSlice.reducer;
