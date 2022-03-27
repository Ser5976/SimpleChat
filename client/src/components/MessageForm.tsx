import React from 'react';
import { makeStyles } from '@material-ui/core';
import CustomizedInputBase from './CustamizidInput';

const useStyles = makeStyles((theme) => ({
  messages_output: {
    height: '70vh',
    border: '1px solid  #e0e0e0',
    overflow: 'auto',
    marginBottom: '10px',
  },
}));
const MessageForm = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.messages_output}></div>
      <CustomizedInputBase />
    </>
  );
};

export default MessageForm;
