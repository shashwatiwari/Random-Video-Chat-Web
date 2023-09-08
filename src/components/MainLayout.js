import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import GuestLogin from './UserForm/GuestLogin';
import './MainLayout.css';
import img from '../images/pngegg (2).png'
const MainLayout = () => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const text = [
        `"Welcome to our vibrant corner of the internet!"`,
        `"Experience the pleasure of genuine human interaction."`,
        `"Start meaningful dialogues that could change your perspective."`,
        `"Step into a world of infinite connections"`,
        `"where every chat is a new adventure waiting to unfold."`,
        `"Discover the joy of meeting new people and engaging in meaningful conversations."`,
        `"Your next great conversation is just a click away."`,
        `"Explore endless possibilities in our online community."`
    ];
    const speed = 30;

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(text[currentIndex].substring(0, currentText.length + 1));
                if (currentText === text[currentIndex]) {
                    clearTimeout(timeout);
                    setTimeout(() => {
                        setCurrentText('');
                        setCurrentIndex((prevIndex) => (prevIndex + 1) % text.length);
                    }, 500);
                }
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, currentText, text, speed]);

    return (
        <>
            <div className="auth-buttons">
                <Link to="/signin">
                    <Button variant="contained" color="primary">
                        Sign In
                    </Button>
                </Link>
                <Link to="/signup">
                    <Button variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
                        Sign Up
                    </Button>
                </Link>
            </div>
            <div className="main-container">
                <div className="left-section">
                    <div className="image-title">
                        <img src={img} alt="images" />
                        <h1 className='title'>VawLink</h1>
                    </div>
                    <h1 className='typescript'>{currentText}</h1>
                </div>
                <div className="right-section">
                    <GuestLogin />
                </div>
            </div>
        </>
    );
};

export default MainLayout;
