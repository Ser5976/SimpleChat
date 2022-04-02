import React, { useContext } from 'react';
import {
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
} from '@material-ui/core';
import group from '../img/group.jpg';
import { ROOT_URL } from '../constanst/url';
import { AppContext } from '../context/appContext';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  resetNotifications,
  addNotifications,
} from '../store/reducers/AuthSlice';

// типизация member
export type MemberType = {
  _id: string;
  avatar: string;
  createdAt: string;
  email: string;
  login: string;
  password?: string;
  status: string;
  updatedAt: string;
  newMessage: any;
};

const useStyles = makeStyles((theme) => ({
  list: {
    marginRight: '10px',
  },
  hideListItem: { display: 'none' },
}));

const Sidebar = () => {
  const classes = useStyles();
  const { user } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();
  const {
    setCurrentRoom,
    currentRoom,
    members,
    socket,
    setPrivateMemberMsg,
    privateMemberMsg,
  } = useContext(AppContext);
  // выбор группы или участника(тоесть подключение комнаты(room)
  const joinRoom = (room: string, isPublick = true) => {
    console.log('сработало');
    socket.emit('join-room', room);
    setCurrentRoom(room);
    if (isPublick) {
      setPrivateMemberMsg(null);
    }
    dispatch(resetNotifications(room)); // при открытии комнаты удаляется непрочитанное сообщение
  };
  socket.off('notifications').on('notifications', (room: string) => {
    if (currentRoom !== room) {
      dispatch(addNotifications(room));
    }

    //добавляем уведомление,что получено сообщение в конату
    console.log('сработало2');
  });
  // формируем название комнаты из приватных участников(чтобы название сохранялось одно
  // при изменении пользователь - участник,участник-пользователь)
  const orderIds = (id1: string, id2: string) => {
    if (id1 > id2) {
      return `${id1}-${id2}`;
    } else {
      return `${id2}-${id1}`;
    }
  };
  //выбор участника
  const handelePrivateMemberMsg = (member: MemberType) => {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user.id, member._id);
    console.log('roomId:', roomId);
    joinRoom(roomId, false);
  };
  // console.log('currentRoom', currentRoom);
  console.log('user', user);
  return (
    <>
      <Typography variant="h5">Участники</Typography>
      <List className={classes.list}>
        <ListItem
          button
          style={{ cursor: 'pointer' }}
          selected={'general' === currentRoom}
          onClick={() => joinRoom('general')}
        >
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={group} />
          </ListItemAvatar>
          <ListItemText primary="Группа" secondary="Jan 9, 2014" />
          {currentRoom !== 'general' && (
            <Badge color="primary" badgeContent={user.newMessage['general']}>
              <Typography></Typography>
            </Badge>
          )}
        </ListItem>
        {members.map((member: MemberType) => {
          return (
            <ListItem
              button
              key={member._id}
              selected={member._id === privateMemberMsg?._id}
              style={{ cursor: 'pointer', marginBottom: '15px' }}
              className={
                member._id === user.id ? classes.hideListItem : undefined
              }
              onClick={() => handelePrivateMemberMsg(member)}
            >
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
              <ListItemText
                primary={member.login}
                // secondary={member.createdAt}
              />
              {privateMemberMsg?._id !== member._id && (
                <Badge
                  color="primary"
                  badgeContent={user.newMessage[orderIds(user.id, member._id)]}
                >
                  <Typography></Typography>
                </Badge>
              )}
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default Sidebar;
