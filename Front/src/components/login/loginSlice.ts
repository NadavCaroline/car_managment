import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { getProfile, login, register, getDepartments, getRoles, loginWithRefresh } from './loginAPI';
import { Cred } from '../../models/Cred'
import { ProfileModel } from '../../models/Profile'
import { UserModel } from '../../models/User'


export interface loginState {
  access: any
  refresh: any
  logged: boolean
  remember: boolean
  error: string | null;
}

const initialState: loginState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  logged: localStorage.hasOwnProperty('access') || localStorage.hasOwnProperty('remember'),
  remember: localStorage.hasOwnProperty('refresh'),
  error: ""
};


export const loginAsync = createAsyncThunk(
  'login/login',
  async (cred: Cred) => {
    const response = await login(cred);
    return response;
  }
);
export const loginWithRefreshAsync = createAsyncThunk(
  'login/loginWithRefresh',
  async (refresh: string) => {
    const response = await loginWithRefresh(refresh);
    return response;
  }
);

export const regAsync = createAsyncThunk(
  'login/register',
  async ({ user, profile }: { user: UserModel, profile: ProfileModel }) => {
    const response = await register(user, profile);
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
    logout: (state) => {
      state.logged = false
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.access = ""
      state.refresh = ""
    },
    remember: (state) => {
      state.remember = true
    },
    dontRemember: (state) => {
      state.remember = false

    },
    SetError: (state) => {
      state.error = ""
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(regAsync.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          state.error="משתמש נוצר בהצלחה"
        }
        // else{
        //     state.error=action.payload.status;
        // }
        
       
        // state.error=action.payload.;
      })
      .addCase(regAsync.rejected, (state, action) => {
        // state.isLoading = false;
        state.error ="error";
      //  state.error = action.error.message ?? 'An error occurred.';
      })
      .addCase(loginWithRefreshAsync.fulfilled, (state, action) => {
        console.log(action.payload.access)
        state.access = action.payload.access;
        localStorage.setItem("access", action.payload.access)
        localStorage.setItem("refresh", action.payload.refresh)
        state.logged = true
      })
      // .addCase(loginWithRefreshAsync.rejected, (state, action) => {
      //   state.error = action.error.message ?? 'An error occurred.';
      // })
      .addCase(loginAsync.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          let d = action.payload.data;
          state.access = d.access;
          state.refresh = d.refresh;
          localStorage.setItem("access", d.access)
          state.remember && localStorage.setItem("refresh", d.refresh)
          state.logged = true
        }
        else if (action.payload.status === 401) {
          state.error ="משתמש לא קיים או סיסמא לא נכונה";
        }

      })
    // .addCase(loginAsync.rejected, (state, action) => {
    //   state.error = action.error.message ?? 'An error occurred.';
    // });
  },
});

export const { logout, remember, dontRemember, SetError } = loginSlice.actions;
export const loginError = (state: RootState) => state.login.error;
export const userAccess = (state: RootState) => state.login.access;
export const userRefresh = (state: RootState) => state.login.refresh;
export const isLogged = (state: RootState) => state.login.logged;
export const userToken = (state: RootState) => state.login.remember ? state.login.refresh : (state.login.logged ? state.login.access : "");
export default loginSlice.reducer;
