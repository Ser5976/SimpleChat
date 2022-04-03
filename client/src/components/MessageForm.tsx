import React, { useEffect, useRef } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import CustomizedInputBase from './CustamizidInput';
import { MemberType } from './Sidebar';
import MessageList from './MessageList';
import { useAppSelector } from '../hooks/redux';

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
};

const useStyles = makeStyles((theme) => ({
  messages_output: {
    height: '70vh',
    border: '1px solid  #e0e0e0',
    overflow: 'auto',
    marginBottom: '10px',
  },
}));
const MessageForm: React.FC<PropsType> = ({ messages }) => {
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

  return (
    <>
      <div className={classes.messages_output}>
        {messages.map((message, inx) => (
          <div key={inx}>
            <Typography align="center">{message._id}</Typography>
            {message.messagesByDate?.map((item: MessageType) => (
              <MessageList
                /* content={item.content}
                time={item.time}
                login={item.from.login}
                avatar={item.from.avatar} */
                item={item}
                key={item._id}
              />
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
