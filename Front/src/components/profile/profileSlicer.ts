import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { ProfileModel } from '../../models/Profile';
import { getAllProfiles, getProfile } from './profileAPI';


export interface profileState {
    profile: ProfileModel
    allProfiles: ProfileModel[]
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
    },
    allProfiles: []
};


export const getProfileAsync = createAsyncThunk(
    'profile/getProfile',
    async (token: string) => {
        const response = await getProfile(token);
        return response;
    }
);
export const getAllProfilesAsync = createAsyncThunk(
    'profile/getAllProfiles',
    async (token: string) => {
        const response = await getAllProfiles(token);
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
                console.log(action.payload)
                state.profile = action.payload;
            })
            .addCase(getAllProfilesAsync.fulfilled, (state, action) => {
                console.log(action.payload)
                state.allProfiles = action.payload;
            });
    },
});

export const { } = profileSlice.actions;
export const profileSelector = (state: RootState) => state.profile.profile;
export const allProfileSelector = (state: RootState) => state.profile.allProfiles;

export default profileSlice.reducer;
