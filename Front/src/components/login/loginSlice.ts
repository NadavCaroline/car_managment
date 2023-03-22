import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { getProfile, login, register,getDepartments,getRoles } from './loginAPI';
import {Cred} from '../../models/Cred'
import {ProfileModel} from '../../models/Profile'
import {UserModel} from '../../models/User'


export interface loginState {
  access: any
  refresh:any
  logged:boolean
  remember:boolean
  errorMsg:any
}

const initialState: loginState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  logged:localStorage.hasOwnProperty('refresh'),
  // localStorage.hasOwnProperty('access') || localStorage.hasOwnProperty('refresh') ,
  remember: localStorage.hasOwnProperty('refresh'),
  errorMsg:""
};

export const loginAsync = createAsyncThunk(
  'login/login',
  async (cred: Cred) => {
    console.log(cred)
    const response = await login(cred);
    return response;
  }
);

export const regAsync = createAsyncThunk(
  'login/register',
  async ( {user,profile }: { user: UserModel,profile:ProfileModel  }) => {
    const response = await register(user,profile);
    return response;
  }
);
export const getDepartmentsAsync = createAsyncThunk(
  'login/getDepartments',
  async () => {
    const response = await getDepartments();
    return response;
  }
);
export const getRolesAsync = createAsyncThunk(
  'login/getRoles',
  async () => {
    const response = await getRoles();
    return response;
  }
);

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout:(state)=>{
      state.logged = false
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.access = ""
      state.refresh = ""
    },
    remember:(state)=>{
      console.log("Called remember")
      state.remember = true
    },
    dontRemember:(state)=>{
      console.log("Called donrRemember")
      state.remember = false
      
    },
    SetErrorMsg:(state)=>{
      state.errorMsg = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {  
        if(action.payload.response!=undefined && action.payload.response.data.detail)//error login 
        {
          // action.payload.response.status
          state.errorMsg=action.payload.response.data.detail
        }
        else if(state.remember==true){//success login
          state.refresh = action.payload.refresh
          state.access = ""
          localStorage.setItem("refresh", action.payload.refresh)
          localStorage.removeItem('access');
          state.logged = true
        }
        else{
          state.access= action.payload.access
          state.refresh = ""
          localStorage.setItem("access", action.payload.access)
          localStorage.removeItem('refresh');
          state.logged = true
        }
        
      })
      .addCase(regAsync.fulfilled, (state, action) => { 
        console.log(action);
        // state.errorMsg=action.payload.;
      });
  },
});

export const { logout, remember, dontRemember ,SetErrorMsg} = loginSlice.actions;
export const errorMsg = (state: RootState) => state.login.errorMsg;
// export const userAccess = (state: RootState) => state.login.access;
// export const userRefresh = (state: RootState) => state.login.refresh;
export const isLogged = (state: RootState) => state.login.logged;
export const userToken = (state: RootState) => state.login.remember? state.login.refresh :(state.login.logged? state.login.access:"");
export default loginSlice.reducer;
