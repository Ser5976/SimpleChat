import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import CustomizedInputBase from './CustamizidInput';
import { MemberType } from './Sidebar';
import MessageList from './MessageList';

// типизация пропсов
type MessageType = {
  content: string;
  date: string;
  from: MemberType;
  time: string;
  to: string;
};

type PropsType = {
  messages: {
    _id: string;
    messagesByDate: MemberType[];
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
  const classes = useStyles();
  console.log(messages);
  return (
    <>
      <div className={classes.messages_output}>
        {messages.map((message, inx) => (
          <div key={inx}>
            <Typography align="center">{message._id}</Typography>
            {message.messagesByDate?.map((item: any) => (
              <div
                key={item._id}
                style={{ display: 'flex', alignItems: 'flex-end' }}
              >
                <MessageList
                  content={item.content}
                  time={item.time}
                  login={item.from.login}
                  avatar={item.from.avatar}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <CustomizedInputBase />
    </>
  );
};

export default MessageForm;
