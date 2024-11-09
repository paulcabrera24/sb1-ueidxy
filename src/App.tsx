import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Calendar from './pages/Calendar';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import OnlineToggle from './components/OnlineToggle';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <OnlineToggle />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/calendar" element={<Calendar />} />
        </Route>
      </Routes>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;