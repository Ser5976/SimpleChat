import React, { useContext } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Grid, makeStyles } from '@material-ui/core';
import { useNavigate, Link } from 'react-router-dom';
import { DropzoneArea } from 'material-ui-dropzone'; // загрузка файлов
import { useAppDispatch } from '../hooks/redux'; // типизированные хуки useDispath и useSelector
import { setShowAlert } from '../store/reducers/AuthSlice'; //экшен для открытия алерта
import { registration } from '../store/actioncreators/authActionCreator'; //санка
import { AppContext } from '../context/appContext';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  dropzone: {
    minHeight: 50,
    border: '0px',
    '& 	.MuiDropzoneArea-text': { fontSize: '1.00rem' },
    '& 	.MuiDropzoneArea-icon': {
      color: theme.palette.primary.main,
      marginBottom: 25,
    },
  },
  link: {
    marginBottom: theme.spacing(2),
  },
}));

//схема валидации---------------------
const schema = yup.object().shape({
  login: yup.string().required('Обязательное поле'),
  email: yup
    .string()
    .email('Введите правильный email')
    .required('Обязательное поле'),
  password: yup
    .string()
    .required('Обязательное поле')
    .min(5, 'Минимальное количество символов'),
});
//-----------------------------------------
// типизация пропсов
export type RegistrationType = {
  login: string;
  password: string;
  email: string;
  avatar?: any;
};
//--------------------------------------------

const RegistrationForm: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { socket } = useContext(AppContext);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistrationType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // получение данных из формы ,помещение их в newFormData()(т.к. есть файл) и отправка на сервак
  const onSubmit: SubmitHandler<RegistrationType> = (
    data: RegistrationType
  ): void => {
    const registrationData: any =
      data.avatar.length !== 0
        ? {
            login: data.login,
            email: data.email,
            password: data.password,
            avatar: data.avatar[0],
          }
        : { login: data.login, email: data.email, password: data.password };

    const formData = new FormData();
    let key: any;
    for (key in registrationData) {
      formData.append(key, registrationData[key]);
    }
    // санку запускаем в асинхронном режиме,чтобы если запрос пройдёт перейти на chatPage и
    dispatch(registration(formData))
      // .unwrap()
      .then((data) => {
        // console.log(data);
        socket.emit('new-user'); //подключаем сокет и посылаем событие 'new-user'
        dispatch(setShowAlert(true)); //открывает алерт с успешным сообщение
        navigate('/');
      })
      .catch(
        (e) => dispatch(setShowAlert(true)) // открывает алерт с ошибкой
      );
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Controller
        name="login"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            variant="outlined"
            required
            fullWidth
            id="login"
            label="Login"
            autoComplete="text"
            error={!!errors.login}
            helperText={errors.login ? errors.login?.message : null}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email ? errors.email?.message : null}
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
            margin="normal"
            variant="outlined"
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
      <Controller
        name="avatar"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <DropzoneArea
            dropzoneClass={classes.dropzone}
            {...field}
            filesLimit={1}
            dropzoneText="Перетащите сюда файл или щелкните"
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
        Зарегистрироваться
      </Button>
      <Grid container justifyContent="flex-end" className={classes.link}>
        <Grid item>
          <Link to="/login">Уже есть аккаунт? Войти </Link>
        </Grid>
      </Grid>
    </form>
  );
};
export default RegistrationForm;
