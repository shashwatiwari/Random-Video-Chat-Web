import React, { useEffect, useRef, useState } from 'react';
import { Container, Grid, Paper, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { VideoCall, Mic, MicOff, VideoCameraBack, VideoCameraFront, Chat, Send, CallEnd } from '@mui/icons-material';
import './MainPage.css';
import { useVideoChatContext } from '../../context/VideoChatContext';
import Peer from 'simple-peer';
import Pusher from 'pusher-js';

const MainPage = () => {
    const [peer, setPeer] = useState(null);
    const [userStream, setUserStream] = useState(null);
    const [partnerStream, setPartnerStream] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const userVideoRef = useRef(null);
    const partnerVideoRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const pusher = useRef(null);
    const channel = useRef(null);

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            fetch('https://websocket-server-roan.vercel.app/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageInput, id: localStorage.getItem('userId') })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Parse the JSON response
                })
                .then(data => {
                    // Add the message to the local chatMessages state
                    addChatMessage({ content: messageInput, isOwnMessage: true });
                    // Clear the input field
                    setMessageInput('');
                })
                .catch(error => {
                    console.error('Error sending message:', error);
                });
        }
    };

    const endCall = () => {
        setIsConnected(false);
        if (peer) {
            peer.destroy(); // Close the peer connection
            setUserStream(null);
            setPartnerStream(null);
            setChatMessages([]);
            // Notify the server to end the call
        }
        // window.location.reload();
        fetch('https://websocket-server-roan.vercel.app/disconnect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: localStorage.getItem('userId') })
        })
            .then(() => {
                pusher.current.disconnect();
            })
            .catch(error => {
                console.error('Error disconnecting:', error);
            });
    };

    useEffect(() => {
        if (userStream) {
            userVideoRef.current.srcObject = userStream;
        }
        if (partnerStream) {
            partnerVideoRef.current.srcObject = partnerStream;
        }
    }, [userStream, partnerStream]);

    const { isMicEnabled, isVideoEnabled, chatMessages, toggleMic, toggleVideo, addChatMessage, setChatMessages, setUserMedia, userMedia } = useVideoChatContext();

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const newChat = () => {
        setIsConnected(true);
        pusher.current = new Pusher('2202a930a6cdae8b3963', {
            cluster: 'ap2',
            authEndpoint: 'https://websocket-server-roan.vercel.app/pusher/auth',
            // auth: {
            //     headers: {
            //         Authorization: `Bearer ${localStorage.getItem('your-auth-token')}`
            //     }
            // }
        });

        channel.current = pusher.current.subscribe('my-channel');
        channel.current.bind('message', data => {
            // Ensure messages are not added as own messages for the receiving user
            if (data.partnerId === localStorage.getItem('userId')) {
                addChatMessage({ content: data.message, isOwnMessage: false });
            }
        });

        channel.current.bind('partnerConnected', ({ id, partnerId }) => {
            console.log(`Connected to partner: ${partnerId}`);
        });

        channel.current.bind('partnerDisconnected', ({ partnerId }) => {
            console.log(`Partner ${partnerId} disconnected`);
            setPartnerStream(null);
        });

        fetch('https://websocket-server-roan.vercel.app/connect', {
            method: 'POST'
        })
            .then(response => response.json())
            .then(({ id, partnerId }) => {
                localStorage.setItem('userId', id);
                if (partnerId) {
                    console.log(`Partner found: ${partnerId}`);
                } else {
                    console.log('No partner found. Waiting for a partner...');
                }
            })
            .catch(error => {
                console.error('Error connecting:', error);
            });

        // Get the user's media stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setUserStream(stream);
                setUserMedia(stream);

                const newPeer = new Peer({
                    initiator: true, // User starts the call
                    trickle: false, // Disable trickle ICE for faster connections
                    stream: stream,
                });

                newPeer.addStream(stream); // Attach user's stream to the peer connection

                newPeer.on('signal', (data) => {
                    channel.current.trigger('client-signal', { signal: data, id: localStorage.getItem('userId') });
                });

                newPeer.on('stream', (partnerStream) => {
                    setPartnerStream(partnerStream);
                });

                setPeer(newPeer); // Set the Peer instance
                setIsConnected(true);
            })
            .catch((error) => {
                console.error('Error accessing user media:', error);
                // Display an error message to the user or handle it appropriately
            });

        return () => {
            pusher.current.unsubscribe('my-channel');
        };
    };

    // Handle user disconnect on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            endCall();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
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
                            {isConnected && <Button color="error" onClick={endCall}>
                                <span>End Call</span>
                            </Button>}
                            {!isConnected && <Button color="primary" onClick={newChat}>
                                <span>New Chat</span>
                            </Button>}
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
    );
};

export default MainPage;
