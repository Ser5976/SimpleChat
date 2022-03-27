import React from 'react';
import { makeStyles, Container, Grid } from '@material-ui/core';
import { useAppSelector } from '../hooks/redux';
import Sidebar from '../components/Sidebar';
import MessageForm from '../components/MessageForm';

const useStyles = makeStyles((theme) => ({}));
const ChatPage = () => {
  const classes = useStyles();
  const { user, loading } = useAppSelector((state) => state.authReducer);

  return (
    <>
      {loading && <div style={{ margin: '50px' }}> Идёт загрузка...</div>}

      <Container maxWidth="lg">
        <Grid container style={{ marginTop: '15px' }}>
          <Grid item xs={4}>
            <Sidebar />
          </Grid>
          <Grid item xs={8}>
            <MessageForm />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ChatPage;
