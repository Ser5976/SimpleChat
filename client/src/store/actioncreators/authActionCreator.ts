import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ModelUrls } from '../../constanst/url';
import { setClearAuth } from '../reducers/AuthSlice';

// регистрация
export const registration = createAsyncThunk(
  'auth/registration',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(ModelUrls.REGISTRATION, data); //посылаем запрос
      localStorage.setItem('token', response.data.token); //записываем токен в localStorage

      return response.data;
    } catch (e: any) {
      // console.log(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);
// авторизация
export const login = createAsyncThunk(
  'auth/login',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(ModelUrls.LOGIN, data); //посылаем запрос
      localStorage.setItem('token', response.data.token); //записываем токен в localStorage

      return response.data;
    } catch (e: any) {
      // console.log(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);
// выход из чата
export const logout = createAsyncThunk(
  'auth/logout',
  async (data: any, { rejectWithValue }) => {
    // console.log(data);
    try {
      const response = await axios.post(ModelUrls.LOGOUT, data); //посылаем запрос
      console.log(response.data);
      return response.data;
    } catch (e: any) {
      // console.log(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);
// проверка авторизации,получение нового токина, или выход из авторизации, если токен не валиден
export const checkAuthorization = createAsyncThunk(
  'auth/checkAuthorization',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('token'); //получаем токен из localStorage

    if (!token) {
      return;
    }

    try {
      const { data } = await axios.get(ModelUrls.CHECK, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); //посылаем запрос
      localStorage.setItem('token', data.token); //записываем токен в localStorage

      return data;
    } catch (e: any) {
      localStorage.removeItem('token'); //удаляем токен из localStorage
      dispatch(setClearAuth()); //очистка стейта
      return rejectWithValue(e.response.data.message);
    }
  }
);

//непрочитанное уведомление(записываем данные о количестве непрочитанных сообщений )
export const handleAddNotification = createAsyncThunk(
  'auth/notification',
  async (data: { _id: string; room: string }) => {
    // console.log(data);
    try {
      const response = await axios.post(ModelUrls.NOTIFICATION, data);
      console.log(response.data);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
//непрочитанное уведомление(удаляем данные о количестве непрочитанных сообщений )
export const handleResetAddNotification = createAsyncThunk(
  'auth/resetNotification',
  async (data: { _id: string; room: string }) => {
    // console.log(data);
    try {
      const response = await axios.post(ModelUrls.RESETNOTIFICATION, data);
      console.log(response.data);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
