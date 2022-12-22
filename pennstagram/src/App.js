import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/home/home';
import Connection from './routes/connection/connection';
import Registration from './routes/registration/registration';
import Login from './routes/login/login';
import Profile from './routes/profile/profile';

export default function App() {
  // check sessionStorage for previous
  const [connected] = useState(sessionStorage.getItem('app-token') !== null);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/home/:userId" element={connected ? <Home /> : <Login />} />
        <Route path="/profile/:userId" element={connected ? <Profile /> : <Login />} />
        <Route path="/connection/:userId" element={connected ? <Connection /> : <Login />} />
      </Routes>
    </div>
  );
}
