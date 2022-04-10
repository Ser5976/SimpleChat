import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyRouter from './router/MyRoter';
import { AppContext, socket } from './context/appContext';

const App: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState(''); //выбор комнаты
  const [members, setMembers] = useState([]); // участники
  const [messages, setMessages] = useState([]); //сообщения
  const [privateMemberMsg, setPrivateMemberMsg] = useState({}); //данные о выбранном учаснике(user)
  //  const [newMessage, setNewMessage] = useState({}); //

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
        //  newMessage,
        //setNewMessage,
      }}
    >
      <BrowserRouter>
        <MyRouter />
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
