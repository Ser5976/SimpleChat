import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import jwt_decode from 'jwt-decode'; //декодировать токен
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux'; //хуки useSelector(для получения стейта), useDispatch(для экшенов)
import {
  checkAuthorization, //проверка авторизации
  logout, // выход из чата
} from '../store/actioncreators/authActionCreator';
import { setShowAlert } from '../store/reducers/AuthSlice';
import CustomizedSnackbars from './CustomizedSnackbar';
import Logout from './Logout';
import { AppContext } from '../context/appContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuth, successMessage, errorAuth, showAlert, user } = useAppSelector(
    (state) => state.authReducer
  );
  const { setMessages, setPrivateMemberMsg, setCurrentRoom } =
    useContext(AppContext);
  const dispach = useAppDispatch();
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      const token: any = localStorage.getItem('token');
      let decoded: any = jwt_decode(token); //декодированный token
      // для того, чтобы вызвать логаут если токен не валиден
      const dataLogout = {
        _id: decoded.id,
      };
      dispach(checkAuthorization(dataLogout))
        // .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);
  //выйти из чата
  const goOut = () => {
    const dataLogout = {
      _id: user.id,
    };
    dispach(logout(dataLogout))
      .then(() => {
        dispach(setShowAlert(true)); // открываем алерт с сообщением о выходе из чата
        //обнуляем стейты
        setMessages([]);
        setPrivateMemberMsg({});
        setCurrentRoom('');
      })
      .catch((e) => {
        dispach(setShowAlert(true));
      });
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h3"
            style={{
              fontFamily: 'Permanent Marker',
              padding: '15px',
              flexGrow: 1,
            }}
          >
            SimpleChat
          </Typography>
          {isAuth && <Logout goOut={goOut} />}
        </Toolbar>
      </AppBar>
      <CustomizedSnackbars
        open={showAlert}
        errorMessage={errorAuth}
        successMessage={successMessage}
      />
    </>
  );
};

export default Header;
