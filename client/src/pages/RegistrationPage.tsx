import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  Container,
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import RegistrationForm from '../components/RegistrationForm';

const useStyles = makeStyles((theme) => ({
  box: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

const RegistrationPage = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box className={classes.box}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Зарегистрироваться
        </Typography>
        <RegistrationForm />
      </Box>
    </Container>
  );
};

export default RegistrationPage;
