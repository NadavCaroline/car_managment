import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { getProfile, login, register, getDepartments, getRoles, loginWithRefresh, forgot,reset } from './loginAPI';
import { Cred } from '../../models/Cred'
import { ProfileModel } from '../../models/Profile'
import { UserModel } from '../../models/User'


export interface loginState {
  access: any
  refresh: any
  logged: boolean
  remember: boolean
  error: string | null;
  msg: string | null;
  formToShow: string;
}

const initialState: loginState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  logged: localStorage.hasOwnProperty('access') || localStorage.hasOwnProperty('remember'),
  remember: localStorage.hasOwnProperty('refresh'),
  error: "",
  msg: "",
  formToShow: "login",
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
export const forgotAsync = createAsyncThunk(
  'login/forgot',
  async ({ email }: { email: string }) => {
    console.log(email)
    const response = await forgot(email);
    return response;
  }
);
export const resetAsync = createAsyncThunk(
  'login/reset',
  async ({
    uidb64,
    token,
    password,
  }: {
    uidb64: string,
    token: string,
    password: string,
  }) => {
    const response = await reset(
      uidb64,
      token,
      password,
    );
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
interface MyAction {
  type: string;
  payload: string;
}
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
    SetMsg: (state) => {
      state.msg = ""
    },
    SetFormForgot: (state) => {
      state.formToShow = "forgot";
    },
    SetFormReset: (state) => {
      state.formToShow = "reset";
    },
    SetFormLogin: (state) => {
      state.formToShow = "login";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(regAsync.fulfilled, (state, action) => {
        console.log(action);
        if (action.payload.status === "success") {
          state.msg = action.payload.msg;
        }
        else if (action.payload.status === "error") {
          state.error = action.payload.msg;
        }
      })
      .addCase(loginWithRefreshAsync.fulfilled, (state, action) => {
        state.access = action.payload.access;
        localStorage.setItem("access", action.payload.access)
        localStorage.setItem("refresh", action.payload.refresh)
        state.logged = true
      })
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
          state.error = "משתמש לא קיים או סיסמא לא נכונה";
        }

      })
      // .addCase(loginAsync.rejected, (state, action) => {
      //   state.error = action.error.message ?? 'An error occurred.';
      // });
      .addCase(forgotAsync.fulfilled, (state, action) => {
        if (action.payload.status === "success") {
          state.msg = action.payload.msg;
          SetFormReset();
        }
        else if (action.payload.status === "error") {
          state.error = action.payload.msg;
        }
      })
      .addCase(resetAsync.fulfilled, (state, action) => {
        if (action.payload.status === "success") {
          state.msg = action.payload.msg;
          SetFormLogin();
        }
        else if (action.payload.status === "error") {
          state.error = action.payload.msg;
        }

      })
      
  },
});

export const { logout, remember, dontRemember, SetError, SetMsg, SetFormForgot, SetFormLogin, SetFormReset } = loginSlice.actions;
export const loginError = (state: RootState) => state.login.error;
export const loginMsg = (state: RootState) => state.login.msg;
export const userAccess = (state: RootState) => state.login.access;
export const userRefresh = (state: RootState) => state.login.refresh;
export const isLogged = (state: RootState) => state.login.logged;
export const sformToShow = (state: RootState) => state.login.formToShow;
export const userToken = (state: RootState) => state.login.remember ? state.login.refresh : (state.login.logged ? state.login.access : "");
export default loginSlice.reducer;