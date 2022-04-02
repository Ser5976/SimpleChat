import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyRouter from './router/MyRoter';
import { AppContext, socket } from './context/appContext';

const App: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState('');
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessage, setNewMessage] = useState({});

  const [] = useState();
  return (
    <AppContext.Provider
      value={{
        socket,
        currentRoom,
        setCurrentRoom,
        members,
        setMembers,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        newMessage,
        setNewMessage,
      }}
    >
      <BrowserRouter>
        <MyRouter />
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
