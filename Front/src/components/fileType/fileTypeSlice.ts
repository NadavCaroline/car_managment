import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import FileTypesModel from '../../models/FileTypes';
import { getFileTypes, addFileTypes, updateFileTypes } from './fileTypeAPI';

export interface FileTypesState {
  FileTypes: FileTypesModel[]
  error: string | null
  msg: string | null
}

const initialState: FileTypesState = {
  FileTypes: [],
  error: "",
  msg: ""
};

export const getFileTypesAsync = createAsyncThunk(
  'FileTypes/getFileTypes',
  async (token: string) => {
    const response = await getFileTypes(token);
    return response;
  }
);
export const addFileTypesAsync = createAsyncThunk(
  'FileTypes/addFileTypes',
  async ({ token, fileTypes }: { token: string, fileTypes: FileTypesModel }) => {
    const response = await addFileTypes(token, fileTypes);
    return response;
  }
);
export const updateFileTypesAsync = createAsyncThunk(
  'FileTypes/updateFileTypes',
  async ({ token, fileTypes }: { token: string, fileTypes: FileTypesModel }) => {
    const response = await updateFileTypes(token, fileTypes);
    return response;
  }
);

export const FileTypesSlice = createSlice({
  name: 'FileTypes',
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
      .addCase(getFileTypesAsync.fulfilled, (state, action) => {
        state.FileTypes = action.payload
      })
      .addCase(addFileTypesAsync.fulfilled, (state, action) => {
        if (action.payload.status === 201) {//successfull created
          state.FileTypes.push(action.payload.data)
          state.msg = "סוג מסמך נוסף בהצלחה"
        }
        else if (action.payload.status === 208) {//already exists
          state.error = action.payload.data;
        }
        else if (action.payload.status === 401) {
          state.error = '';
        }
      })
      .addCase(updateFileTypesAsync.fulfilled, (state, action) => {
        if (action.payload.status === 200) {//successfull updated
          state.msg = "סוג תורנות  עודכן בהצלחה"
          let temp = state.FileTypes.filter(fileType => fileType.id === action.payload.data.id)[0]
          temp.name = action.payload.data.name
          temp.fileFolderName = action.payload.data.fileFolderName
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
export const { SetError, SetMsg } = FileTypesSlice.actions;
export const fileTypeMessage = (state: RootState) => state.fileType.msg;
export const fileTypeError = (state: RootState) => state.fileType.error;
export const fileTypesSelector = (state: RootState) => state.fileType.FileTypes
export default FileTypesSlice.reducer;
