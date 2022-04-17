import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { SendSharp } from '@material-ui/icons';
import { AppContext } from '../context/appContext';
import { useAppSelector } from '../hooks/redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',

      backgroundColor: '#eeeeee',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },

    divider: {
      height: 28,
      margin: 4,
    },
  })
);

export default function CustomizedInputBase() {
  const classes = useStyles();
  const { socket, currentRoom, privateMemberMsg } = useContext(AppContext);
  const { user } = useAppSelector((state) => state.authReducer);
  const [message, setMessage] = React.useState(''); //данные из импута
  // форматирование даты
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    let day = date.getDate().toString();

    month = month.length > 1 ? month : '0' + month;
    day = day.length > 1 ? day : '0' + day;

    return `${day}/${month}/${year}`;
  };
  //----------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  let todayDate = getFormattedDate();

  const handleSubmit = () => {
    if (!message.trim()) return;
    // console.log(message);
    // форматирование времени
    let today = new Date();
    let minutes =
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    let time = `${today.getHours()}:${minutes}`;
    let roomId = currentRoom; // текущая комната
    // отправка данных(текущая комната,сообщение,данные пользователя,время,дата,privateMemberMsg-это получатель сообщения,нужно для уведомления тех кто не в сети) на сервер
    socket.emit(
      'message-rom',
      roomId,
      message,
      user,
      time,
      todayDate,
      privateMemberMsg
    );
    setMessage(''); // очистка инпута
    // console.log(' текущая комната:', currentRoom);
    // console.log('получатель:', privateMemberMsg);
  };
  return (
    <div className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="ваше сообщение"
        value={message}
        onChange={handleChange}
      />

      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        color="primary"
        disabled={!currentRoom}
        className={classes.iconButton}
        aria-label="directions"
        onClick={handleSubmit}
      >
        <SendSharp />
      </IconButton>
    </div>
  );
}
