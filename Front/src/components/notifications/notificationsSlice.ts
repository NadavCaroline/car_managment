import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import NotificationModel from '../../models/Notification';
import { getNotification, addNotification, NotificationIsRead,deleteNotification } from './notificationsAPI';

export interface notificationsState {
    notifications: NotificationModel[]
    error: string | null
    msg: string | null


}

const initialState: notificationsState = {
    notifications: [],
    error: "",
    msg: ""
};


export const getNotificationAsync = createAsyncThunk(
    'notifications/getNotifications',
    async (token: string) => {
        const response = await getNotification(token);
        return response;
    }
);
export const addNotificationAsync = createAsyncThunk(
    'notifications/addNotification',
    async ({ token, notification }: { token: string, notification: NotificationModel }) => {
        const response = await addNotification(token, notification);
        return response;
    }
);
export const notificationIsReadAsync = createAsyncThunk(
    'notifications/notificationIsRead',
    async ({ token, id }: { token: string, id: number }) => {
        const response = await NotificationIsRead(token, id);
        return response;
    }
);
export const deleteNotificationAsync = createAsyncThunk(
    'notifications/deleteNotification',
    async ({ token, id }: { token: string, id: number }) => {
        const response = await deleteNotification(token, id);
        return response;
    }
);

export const notificationsSlice = createSlice({
    name: 'notifications',
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
            .addCase(getNotificationAsync.fulfilled, (state, action) => {
                state.notifications = action.payload;
            })
            .addCase(addNotificationAsync.fulfilled, (state, action) => {
                if (action.payload.status === 201) {//successfull created
                    state.notifications.push(action.payload.data)
                    state.msg = "התראה נשמרה"
                }
                // else if (action.payload.status === 208) {//already exists
                //     state.error = action.payload.data;
                // }
                else if (action.payload.status === 401) {
                    state.error = '';
                }

            })

            .addCase(addNotificationAsync.rejected, (state, action) => {
                state.error = action.error.message ?? ''
            })
            .addCase(notificationIsReadAsync.fulfilled, (state, action) => {
                let temp = state.notifications.filter(notification => notification.id === action.payload.id)[0]
                temp.is_read = true
            })
            .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(notification => notification.id !== action.payload.deleted_id);

            });
    },
});
export const { SetError, SetMsg } = notificationsSlice.actions;
export const notificationError = (state: RootState) => state.notifications.error;
export const notificationMessage = (state: RootState) => state.notifications.msg;
export const notificationSelector = (state: RootState) => state.notifications.notifications;
export default notificationsSlice.reducer;
