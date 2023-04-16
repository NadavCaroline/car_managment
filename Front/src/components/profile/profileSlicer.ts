import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { ProfileModel } from '../../models/Profile';
import { getAllProfiles, getProfile, updateProfile } from './profileAPI';


export interface profileState {
    profile: ProfileModel
    allProfiles: ProfileModel[]
    isAdmin: boolean
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
    allProfiles: [],
    isAdmin: false
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
export const updateProfileAsync = createAsyncThunk(
    'profile/updateProfile',
    async ({ token, profile }: { token: string, profile: ProfileModel }) => {
        const response = await updateProfile(token, profile);
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
                action.payload.roleLevel >= 2 && (state.isAdmin = true)
                state.profile = action.payload;
            })
            .addCase(getAllProfilesAsync.fulfilled, (state, action) => {
                state.allProfiles = action.payload;
            });
    },
});
export const { } = profileSlice.actions;
export const profileSelector = (state: RootState) => state.profile.profile;
export const allProfileSelector = (state: RootState) => state.profile.allProfiles;
export const adminSelector = (state: RootState) => state.profile.isAdmin;

export default profileSlice.reducer;
