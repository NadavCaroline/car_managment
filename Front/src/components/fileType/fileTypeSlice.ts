import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import FileTypesModel from '../../models/FileTypes';
import { getFileTypes } from './fileTypeAPI';

export interface FileTypesState {
  FileTypes: FileTypesModel[]
}

const initialState: FileTypesState = {
    FileTypes: []
};

export const getFileTypesAsync = createAsyncThunk(
  'FileTypes/getFileTypes',
  async (token: string) => {
    const response = await getFileTypes(token);
    return response;
  }
);

export const FileTypesSlice = createSlice({
  name: 'FileTypes',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(getFileTypesAsync.fulfilled, (state, action) => {
      state.FileTypes = action.payload
    })
  },
});

export const { } = FileTypesSlice.actions;
export const fileTypesSelector = (state: RootState) => state.fileType.FileTypes
export default FileTypesSlice.reducer;
