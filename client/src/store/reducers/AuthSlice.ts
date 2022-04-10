import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode'; //декодировать токен
import {
  registration,
  login,
  checkAuthorization,
  logout,
  handleAddNotification,
  handleResetAddNotification,
} from './../actioncreators/authActionCreator'; //санки

//типизация пользователя
export type UserType = {
  id: string;
  login: string;
  email: string;
  status: string;
  newMessage: any; //уведомление о пропущенных сообщениях
  avatar?: string;
};
//типизация response
export type ResType = {
  successMessage: string;
  token: string;
};
//типизация стейта
export type AuthType = {
  isAuth: boolean; //показатель авторизации
  loading: boolean; // показатель загрузки
  errorAuth: string; //  ошибки авторизации и регистрации
  successMessage: string; // сообщение о удачной авторизации и регистрации
  user: UserType; //данные о пользователе
  token: string; //токен
  showAlert: boolean; // показывает  сообщения клиенту,успешные и ошибки,авторизации и регистрации
};

const initialState: AuthType = {
  isAuth: false,
  loading: true,
  errorAuth: '',
  successMessage: '',
  user: {} as UserType,
  token: '',
  showAlert: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //здесь можно создавать синхронные экшены
    // открытие алерта
    setShowAlert(state, action: PayloadAction<boolean>) {
      state.showAlert = action.payload;
    },
    // очистка стейта
    setClearAuth(state) {
      state.isAuth = false;
      state.loading = true;
      state.successMessage = '';
      state.token = '';
      state.user = {} as UserType;
    },
    //добавляем уведомление о непрочитанных сообщениях
    addNotifications(state, action: PayloadAction<any>) {
      if (state.user.newMessage[action.payload]) {
        state.user.newMessage[action.payload] =
          state.user.newMessage[action.payload] + 1;
      } else state.user.newMessage[action.payload] = 1;
    },
    //удаление уведомление о непрочитанных сообщениях
    resetNotifications(state, action: PayloadAction<any>) {
      delete state.user.newMessage[action.payload];
    },
  },
  extraReducers: {
    //======= асинхронные экшены =======
    //------- регистрация --------------
    [registration.pending.type]: (state) => {
      state.loading = true;
    },
    [registration.fulfilled.type]: (state, action: PayloadAction<ResType>) => {
      state.loading = false;
      state.isAuth = true;
      state.errorAuth = '';
      state.successMessage = action.payload.successMessage;
      state.token = action.payload.token;
      let decoded: UserType = jwt_decode(action.payload.token); //декодированный token
      state.user = decoded;
    },
    [registration.rejected.type]: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuth = false;
      state.errorAuth = action.payload;
    },
    //------ авторизация -----------------
    [login.pending.type]: (state) => {
      state.loading = true;
    },
    [login.fulfilled.type]: (state, action: PayloadAction<ResType>) => {
      state.loading = false;
      state.isAuth = true;
      state.errorAuth = '';
      state.successMessage = action.payload.successMessage;
      state.token = action.payload.token;
      let decoded: UserType = jwt_decode(action.payload.token); //декодированный token
      console.log(decoded);
      state.user = decoded;
    },
    [login.rejected.type]: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuth = false;
      state.errorAuth = action.payload;
    },
    //-------выход из чата  ----------------
    [logout.fulfilled.type]: (state, action: PayloadAction<string>) => {
      state.isAuth = false;
      state.loading = true;
      state.successMessage = action.payload;
      state.token = '';
      state.user = {} as UserType;
      localStorage.removeItem('token');
    },
    //------ проверка авторизации -----------
    [checkAuthorization.pending.type]: (state) => {
      state.loading = true;
    },

    [checkAuthorization.fulfilled.type]: (
      state,
      action: PayloadAction<ResType>
    ) => {
      state.isAuth = true;
      state.loading = false;
      state.errorAuth = '';
      state.token = action.payload.token;
      let decoded: UserType = jwt_decode(action.payload.token); //декодированный token
      console.log(decoded);
      state.user = decoded;
    },
    [checkAuthorization.rejected.type]: (
      state,
      action: PayloadAction<string>
    ) => {
      state.isAuth = false;
      state.loading = false;
      state.errorAuth = action.payload;
    },
    //непрочитанное уведомление(записываем данные о количестве непрочитанных сообщений )
    [handleAddNotification.fulfilled.type]: (
      state,
      action: PayloadAction<UserType>
    ) => {
      state.user.newMessage = action.payload.newMessage;
    },
    //непрочитанное уведомление(удаляем данные о количестве непрочитанных сообщений )
    [handleResetAddNotification.fulfilled.type]: (
      state,
      action: PayloadAction<UserType>
    ) => {
      state.user.newMessage = action.payload.newMessage;
    },
  },
});

export const {
  setShowAlert,
  setClearAuth,
  addNotifications,
  resetNotifications,
} = authSlice.actions; // можно экспартировать синхронные экшены
export default authSlice.reducer;
