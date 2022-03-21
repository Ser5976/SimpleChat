import React from 'react';

import { useAppSelector } from '../hooks/redux';

const ChatPage = () => {
  const { user, loading } = useAppSelector((state) => state.authReducer);
  console.log(loading);
  return (
    <>
      {loading && <div style={{ margin: '50px' }}> Идёт загрузка...</div>}

      <div>
        Chat
        <h1> {user.id}</h1>
      </div>
    </>
  );
};

export default ChatPage;
