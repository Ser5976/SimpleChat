import React, { useContext, useEffect } from 'react';
import { Container, Grid } from '@material-ui/core';
import { useAppSelector } from '../hooks/redux';
import { AppContext } from '../context/appContext';
import Sidebar from '../components/Sidebar';
import MessageForm from '../components/MessageForm';

const ChatPage = () => {
  const { loading } = useAppSelector((state) => state.authReducer);
  const {
    socket,
    setMembers,
    currentRoom,
    privateMemberMsg,
    setMessages,
    messages,
  } = useContext(AppContext);
  useEffect(() => {
    // console.log(currentRoom);
    socket.emit('new-user'); // посылаем событие 'new-user',для получения всех пользователей
  }, []);
  //============ получение сообщений от сокета ===========
  socket.off('new-user').on('new-user', (data: any) => {
    setMembers(data);
  }); // получение списка пользователей(событие'new-user' )

  socket.off('room-messages').on('room-messages', (roomMessages: any) => {
    setMessages(roomMessages);
  }); // получение данных с сервера(отсортированных сообщений, событие 'room-messages')

  //==============================================================

  return (
    <>
      {loading && <div style={{ margin: '50px' }}> Идёт загрузка...</div>}

      <Container maxWidth="lg">
        <Grid container style={{ marginTop: '15px' }}>
          <Grid item xs={4}>
            <Sidebar />
          </Grid>
          <Grid item xs={8}>
            <MessageForm
              messages={messages}
              privateMemberMsg={privateMemberMsg}
              currentRoom={currentRoom}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ChatPage;
