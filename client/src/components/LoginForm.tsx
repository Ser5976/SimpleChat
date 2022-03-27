import React, { useContext } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Grid, makeStyles } from '@material-ui/core';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux'; // типизированные хуки useDispath и useSelector
import { login } from '../store/actioncreators/authActionCreator'; // санка
import { setShowAlert } from '../store/reducers/AuthSlice'; //экшен для показа алерта
import { AppContext } from '../context/appContext';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  link: {
    marginBottom: theme.spacing(2),
  },
}));

//схема валидации---------------------
const schema = yup.object().shape({
  login: yup.string().required('Обязательное поле'),
  password: yup
    .string()
    .required('Обязательное поле')
    .min(5, 'Минимальное количество символов'),
});
//-----------------------------------------
// типизация пропсов
type PropsType = {};
type LoginType = {
  login: string;
  password: string;
};
//--------------------------------------------

const LoginForm: React.FC<PropsType> = ({}) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { socket } = useContext(AppContext);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // получение данных из форма и отправка на сервак
  const onSubmit: SubmitHandler<LoginType> = (data: LoginType): void => {
    // санку запускаем в асинхронном режиме,чтобы если запрос пройдёт перейти на chatPage и запустить алерт
    dispatch(login(data))
      // .unwrap()
      .then(() => {
        socket.emit('new-user'); //подключаем сокет и посылаем событие 'new-user'
        navigate('/'); // переход на главную страницу
        dispatch(setShowAlert(true)); //открывает алерт с успешным сообщение
      })
      .catch(
        (e) => dispatch(setShowAlert(true)) // открывает алерт с ошибкой
      );
  };

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="login"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            autoComplete="text"
            autoFocus
            error={!!errors.login}
            helperText={errors.login ? errors.login?.message : null}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password ? errors.password?.message : null}
          />
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Войти
      </Button>
      <Grid container>
        <Grid item>
          <Link to="/registration">
            {'Нет учетной записи? Зарегистрироваться'}
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};
export default LoginForm;
