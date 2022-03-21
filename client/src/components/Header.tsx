import * as React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux'; //хуки useSelector(для получения стейта), useDispatch(для экшенов)
import { checkAuthorization } from '../store/actioncreators/authActionCreator'; // санка проверка авторизации
import { setShowAlert, setClearAuth } from '../store/reducers/AuthSlice';
import CustomizedSnackbars from './CustomizedSnackbar';

const Header = () => {
  const navigate = useNavigate();
  const { isAuth, successMessage, errorAuth, showAlert } = useAppSelector(
    (state) => state.authReducer
  );
  const dispach = useAppDispatch();
  React.useEffect(() => {
    dispach(checkAuthorization())
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((e) => {
        dispach(setShowAlert(true));
      });
  }, []);

  const logout = () => {
    dispach(setClearAuth());
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
            <Button color="inherit" onClick={logout}>
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
