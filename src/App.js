import React from 'react';
import { AuthContextProvider } from './Components/AuthContext';
import { MyRoutes } from './Components/routes';

function App() {
  return (
    <AuthContextProvider>
        <MyRoutes />
    </AuthContextProvider>
  );
}

export default App;
