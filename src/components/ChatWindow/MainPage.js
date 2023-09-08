import React, { useEffect, useRef, useState } from 'react';
import { Container, Grid, Paper, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { VideoCall, Mic, MicOff, VideoCameraBack, VideoCameraFront, Chat, Send, CallEnd } from '@mui/icons-material';
import './MainPage.css';
import { VideoChatContextProvider, useVideoChatContext } from '../../context/VideoChatContext';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { toast } from 'react-toastify';

const MainPage = () => {
    const [peer, setPeer] = useState(null);
    const [userStream, setUserStream] = useState(null);
    const [partnerStream, setPartnerStream] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    const userVideoRef = useRef(null);
    const partnerVideoRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            // Emit the message to the server
            socket.current.emit('message', messageInput);
            // Add the message to the local chatMessages state
            addChatMessage({ content: messageInput, isOwnMessage: true });
            // Clear the input field
            setMessageInput('');
        }
    };

    const endCall = () => {
        if (peer) {
            peer.destroy(); // Close the peer connection
            setUserStream(null);
            setPartnerStream(null);
            setChatMessages('');
            // Notify the server to end the call
        }
        window.location.reload();
        socket.current.disconnect();
    };

    useEffect(() => {
        toast.success('Start meaningful dialogues', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    useEffect(() => {
        if (userStream) {
            userVideoRef.current.srcObject = userStream;
        }
        if (partnerStream) {
            partnerVideoRef.current.srcObject = partnerStream;
        }
    }, [userStream, partnerStream]);

    const socket = useRef(null);
    const { isMicEnabled, isVideoEnabled, chatMessages, toggleMic, toggleVideo, addChatMessage, setChatMessages, setUserMedia, userMedia } = useVideoChatContext();

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SERVER_URL); // Connect to the socket.io server
        // Listen for incoming messages

        socket.current.on('message', (message) => {
            addChatMessage({ content: message, isOwnMessage: false }); // Set isOwnMessage to false for received messages
        });

        const newPeer = new Peer({
            initiator: true, // User 1 starts the call
            trickle: false, // Disable trickle ICE for faster connections
        });
        // Get the user's media stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {

                setUserStream(stream);
                setUserMedia(stream);

                newPeer.addStream(stream); // Attach user's stream to the peer connection
                // Listen for 'signal' event to exchange WebRTC signaling data
                newPeer.on('signal', data => {
                    // Emit the signal data to your server using socket.io
                    socket.current.emit('signal', data);
                });
                // Listen for 'stream' event to receive and display the partner's stream

                newPeer.on('stream', partnerStream => {
                    // console.log('partner stream is received');
                    setPartnerStream(partnerStream);
                });
                setPeer(newPeer); // Set the Peer instance
            })
            .catch(error => {
                console.error('Error accessing user media:', error);
                // Display an error message to the user or handle it appropriately
            });
        // Listen for 'signal' event from socket and feed it into the peer instance
        socket.current.on('signal', signalData => {
            // Feed the signal data received from partner into the peer instance
            newPeer.signal(signalData);
        });

        return () => {
            socket.current.disconnect(); // Disconnect from the socket.io server when the component unmounts
        };
    }, []);

    return (
        <VideoChatContextProvider>
            <Container className="app-container">
                <AppBar position="static" className="app-bar">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <VideoCall />
                        </IconButton>
                        <Typography variant="h6">VawLink</Typography>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={3} className="main-grid">
                    <Grid item xs={12} md={6} lg={4}>
                        <Paper className="video-paper">
                            <div className="video-stream">
                                <video autoPlay playsInline ref={userVideoRef}></video>
                            </div>
                            <div className="controls">
                                <IconButton color="primary" onClick={toggleMic}>
                                    {isMicEnabled ? <Mic /> : <MicOff />}
                                </IconButton>
                                <IconButton color="primary" onClick={toggleVideo}>
                                    {isVideoEnabled ? <VideoCameraFront /> : <VideoCameraBack />}
                                </IconButton>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Paper className="video-paper">
                            <div className="video-stream">
                                <video autoPlay playsInline ref={partnerVideoRef}></video>
                            </div>
                            <div className="controls">
                                <IconButton color="primary">
                                    <Mic />
                                </IconButton>
                                <IconButton color="primary">
                                    <VideoCameraFront />
                                </IconButton>
                            </div>
                        </Paper>
                        <div className="end-call">
                            <IconButton color="error" onClick={endCall}>
                                <CallEnd />
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12} lg={4} className='chat-bar'>
                        <Paper className="chat-paper chat-bar">
                            <div className="chat-messages" ref={messagesContainerRef}>
                                {chatMessages.map((message, index) => (
                                    <div key={index} className={`chat-message ${message.isOwnMessage ? 'own' : 'partner'}`}>
                                        {message.content}
                                    </div>
                                ))}
                            </div>
                            <div className="message-input">
                                <Chat />
                                <input
                                    className='text-msg'
                                    type="text"
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <IconButton color="primary" onClick={handleSendMessage}>
                                    <Send />
                                </IconButton>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </VideoChatContextProvider>
    );
};

export default MainPage;
