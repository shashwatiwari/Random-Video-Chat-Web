import React from 'react';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import SignUpForm from './components/UserForm/SignUpForm';
import LoginForm from './components/UserForm/LoginForm';
import MainPage from './components/ChatWindow/MainPage';
import { VideoChatContextProvider } from './context/VideoChatContext';
import axios from 'axios';

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from storage

    if (token) {
      // Set the token in the Axios headers for authentication
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/signin" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        <Route path="/mainpage" element={
          <VideoChatContextProvider>
            <MainPage />
          </VideoChatContextProvider>
        } />
      </Routes>
    </>
  );
};

export default App;
