import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyRouter from './router/MyRoter';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MyRouter />
    </BrowserRouter>
  );
};

export default App;
