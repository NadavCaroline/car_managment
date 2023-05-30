import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { DepModel } from '../../models/Deps';
import { addDep, getDeps,updateDep } from './depsAPI';


export interface depsState {
    deps: DepModel[]
    error: string | null
    msg: string | null
}

const initialState: depsState = {
    deps: [],
    error: "",
    msg: ""
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
    async ({ token, dep }: { token: string, dep: DepModel }) => {
        const response = await addDep(token, dep);
        return response;
    }
);
export const updateDepAsync = createAsyncThunk(
    'dep/updateDep',
    async ({ token, dep }: { token: string, dep: DepModel }) => {
      const response = await updateDep(token, dep);
      return response;
    }
  );
export const depsSlice = createSlice({
    name: 'dep',
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
            .addCase(getDepsAsync.fulfilled, (state, action) => {
                state.deps = action.payload;
            })
            .addCase(addDepAsync.fulfilled, (state, action) => {
                if (action.payload.status === 201) {//successfull created
                    state.deps.push(action.payload.data)
                    state.msg = "מחלקה  נוספה בהצלחה"
                  }
                  else if (action.payload.status === 208) {//already exists
                    state.error = action.payload.data;
                  }
                  else if (action.payload.status === 401) {
                    state.error = '';
                  }
            })
            .addCase(updateDepAsync.fulfilled, (state, action) => {
                if (action.payload.status === 200) {//successfull updated
                  state.msg = "מחלקה עודכנה בהצלחה"
                  let temp = state.deps.filter(dep => dep.id === action.payload.data.id)[0]
                  temp.name = action.payload.data.name
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

export const { SetError, SetMsg } = depsSlice.actions;
export const depMessage = (state: RootState) => state.dep.msg;
export const depError = (state: RootState) => state.dep.error;
export const depsSelector = (state: RootState) => state.dep.deps;
export default depsSlice.reducer;
