import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useAppDispatch } from '../hooks/redux'; //хуки useSelector(для получения стейта), useDispatch(для экшенов)
import { setShowAlert } from '../store/reducers/AuthSlice'; //экшен для открытия алерта
//----типизация пропсов----
type PropsType = {
  open: boolean;
  errorMessage: string;
  successMessage: string;
};
//-------------------------

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomizedSnackbars: React.FC<PropsType> = ({
  open, // открывает алерт */
  errorMessage, // сообщение ошибки
  successMessage, //сообщение удачных действий
}) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(setShowAlert(false));
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {errorMessage ? (
          <Alert onClose={handleClose} severity="error">
            {errorMessage}
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="success">
            {successMessage}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};
export default CustomizedSnackbars;
