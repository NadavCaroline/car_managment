import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import carsReducer from '../components/cars/carsSlice';
import  depsReducer  from '../components/deps/depsSlicer';
import  driveReducer from '../components/drivings/drivesSlicer';
import loginReducer  from '../components/login/loginSlice';
import  logReducer  from '../components/logs/logsSlice';
import  myOrderReducer  from '../components/orders/OrdersSlice';
import  profileReducer  from '../components/profile/profileSlicer';
import userReducer from '../components/users/userSlicer';

export const store = configureStore({
  reducer: {
    myOrder: myOrderReducer,
    myCars: carsReducer,
    login: loginReducer,
    drive: driveReducer,
    profile: profileReducer,
    dep: depsReducer,
    log: logReducer,
    users: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
