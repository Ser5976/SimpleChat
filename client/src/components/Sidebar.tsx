import React, { useContext, useEffect } from 'react';
import {
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { AppContext } from '../context/appContext';
import { ROOT_URL } from '../constanst/url';

const useStyles = makeStyles((theme) => ({
  list: {
    marginRight: '10px',
  },
}));

const grup = ['первая', 'вторая', 'третья'];

const Sidebar = () => {
  const classes = useStyles();
  const {
    socket,
    members,
    setMembers,
    currentRoom,
    setCurrentRom,
    rooms,
    setRooms,
  } = useContext(AppContext);
  useEffect(() => {
    setCurrentRom('general');
    getRooms();
    socket.emit('join-room', 'general'); //подключаем сокет и посылаем событие 'join-room'
    socket.emit('new-user'); //подключаем сокет и посылаем событие 'new-user'
  }, []);
  socket.off('new-user').on('new-user', (data: any) => {
    setMembers(data);
  }); // получение через сокет списка пользователей(событие'new-user' )

  function getRooms() {
    fetch('http://localhost:7777/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }
  console.log(members);
  console.log(rooms);
  return (
    <>
      {/* <Typography variant="h5">Группы</Typography>
      <List component="nav" className={classes.list}>
        {grup.map((item, index) => {
          return (
            <div key={index}>
              <ListItem button>
                <ListItemText primary={item} />
              </ListItem>
            </div>
          );
        })}
      </List> */}
      <Typography variant="h5">Участники</Typography>
      <List className={classes.list}>
        {members.map((member: any, index: number) => {
          return (
            <ListItem key={index} style={{ cursor: 'pointer' }}>
              <ListItemAvatar>
                {member.avatar ? (
                  <Avatar
                    alt="Remy Sharp"
                    src={`${ROOT_URL}/${member.avatar}`}
                  />
                ) : (
                  <Avatar></Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary={member.login} secondary="Jan 9, 2014" />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default Sidebar;
