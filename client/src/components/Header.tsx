import * as React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux'; //хуки useSelector(для получения стейта), useDispatch(для экшенов)
import {
  checkAuthorization, //проверка авторизации
  logout, // выход из чата
} from '../store/actioncreators/authActionCreator';
import { setShowAlert } from '../store/reducers/AuthSlice';
import CustomizedSnackbars from './CustomizedSnackbar';
import { AppContext } from '../context/appContext';

const Header = () => {
  const navigate = useNavigate();
  const { newMessage } = React.useContext(AppContext);
  const { isAuth, successMessage, errorAuth, showAlert, user } = useAppSelector(
    (state) => state.authReducer
  );
  const dispach = useAppDispatch();
  React.useEffect(() => {
    dispach(checkAuthorization())
      // .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((e) => {
        if (errorAuth || successMessage) {
          dispach(setShowAlert(true));
        }
      });
  }, []);
  //выйти из чата
  const goOut = () => {
    const dataLogout = { _id: user.id, newMessage };
    dispach(logout(dataLogout))
      .then(() => {
        dispach(setShowAlert(true));
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
          {isAuth && (
            <Button color="inherit" onClick={goOut}>
              Выйти
            </Button>
          )}
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
