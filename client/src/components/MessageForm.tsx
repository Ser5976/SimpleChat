import React, { useEffect, useRef } from 'react';
import {
  makeStyles,
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  List,
} from '@material-ui/core';
import CustomizedInputBase from './CustamizidInput';
import { MemberType } from './Sidebar';
import MessageList from './MessageList';
import group from '../img/group.jpg';
import { useAppSelector } from '../hooks/redux';
import { UserType } from '../store/reducers/AuthSlice';
import { ROOT_URL } from '../constanst/url';

// типизация пропсов
export type MessageType = {
  content: string;
  date: string;
  from: MemberType;
  time: string;
  to: string;
  _id: string;
};

type PropsType = {
  messages: {
    _id: string;
    messagesByDate: MessageType[];
  }[];
  privateMemberMsg: UserType;
};

const useStyles = makeStyles((theme) => ({
  messages_output: {
    height: '70vh',
    border: '1px solid  #e0e0e0',
    overflow: 'auto',
    marginBottom: '10px',
  },
}));
const MessageForm: React.FC<PropsType> = ({ messages, privateMemberMsg }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const classes = useStyles();
  const messageEndRef = useRef<null | HTMLDivElement>(null); //для скрола,чтобы автоматически прокручивался
  console.log(messages);
  //  для прокрутки скрола вниз автоматически,при переполнении контейнера
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  console.log(privateMemberMsg);
  return (
    <>
      <div className={classes.messages_output}>
        <List style={{ backgroundColor: '#eeeeee' }}>
          <ListItem style={{ justifyContent: 'center' }}>
            {privateMemberMsg?.login ? (
              <>
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src={`${ROOT_URL}/${privateMemberMsg.avatar}`}
                  />
                </ListItemAvatar>
                <Typography variant="h6">{privateMemberMsg.login}</Typography>
              </>
            ) : (
              <>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={group} />
                </ListItemAvatar>
                <Typography variant="h6">Группа</Typography>
              </>
            )}
          </ListItem>
        </List>

        {messages.map((message, inx) => (
          <div key={inx}>
            <Typography
              align="center"
              style={{
                margin: '10px',
              }}
            >
              {message._id}
            </Typography>
            {message.messagesByDate?.map((item: MessageType) => (
              <MessageList item={item} key={item._id} />
            ))}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <CustomizedInputBase />
    </>
  );
};

export default MessageForm;
