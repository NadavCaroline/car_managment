import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { getUsers, updateUser,getUsersOfDep, getUsersOfDepByShifts } from './usersAPI';
import { UserModel } from '../../models/User';


export interface usersState {
    users: UserModel[]
    error: string | null
    msg: string | null
}

const initialState: usersState = {
    users: [],
    error: "",
    msg: ""

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
export const getUsersOfDepByShiftsAsync = createAsyncThunk(
    'users/getUsersOfDepByShifts',
    async (token: string) => {
        const response = await getUsersOfDepByShifts(token);
        return response;
    }
);

export const usersSlice = createSlice({
    name: 'users',
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
            .addCase(getUsersAsync.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(getUsersOfDepAsync.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(getUsersOfDepByShiftsAsync.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                if (action.payload.status === 200) {//successfull updated
                  state.msg = "משתמש  עודכן בהצלחה"
        
                //   let temp = state.cars.filter(car => car.id === action.payload.data.id)[0]
                //   temp.licenseNum = action.payload.data.licenseNum
                //   temp.nickName = action.payload.data.nickName
                //   temp.make = action.payload.data.make
                //   temp.model = action.payload.data.model
                //   temp.color = action.payload.data.color
                //   temp.year = action.payload.data.year
                //   temp.garageName = action.payload.data.garageName
                //   temp.garagePhone = action.payload.data.garagePhone
                //   temp.department = action.payload.data.department
                //   temp.isDisabled = action.payload.data.isDisabled
                }
                else if (action.payload.status === 208) {//already exists
                  state.error = action.payload.data;
                }
                else if (action.payload.status === 401) {
                  state.error = '';
                }
        
              });
            
    },
});
export const { SetError, SetMsg } = usersSlice.actions;
export const usersSelector = (state: RootState) => state.users.users;
export const userError = (state: RootState) => state.users.error;
export const userMessage = (state: RootState) => state.users.msg;
export default usersSlice.reducer;