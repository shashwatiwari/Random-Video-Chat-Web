import React, { createContext, useContext, useState, useEffect } from 'react';

const VideoChatContext = createContext();

export const useVideoChatContext = () => useContext(VideoChatContext);

export const VideoChatContextProvider = ({ children }) => {
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);
    const [userMedia, setUserMedia] = useState(null);

    const toggleMic = () => {
        setIsMicEnabled((prev) => !prev);
    };

    const toggleVideo = () => {
        setIsVideoEnabled((prev) => !prev);
    };

    const addChatMessage = (message) => {
        setChatMessages((prevMessages) => [...prevMessages, message]);
    };

    useEffect(() => {
        // Access the user's media stream and tracks
        if (userMedia) {
            // Loop through each track to enable or disable them based on state
            userMedia.getTracks().forEach((track) => {
                if (track.kind === 'audio') {
                    track.enabled = isMicEnabled;
                } else if (track.kind === 'video') {
                    track.enabled = isVideoEnabled;
                }
            });
        }
    }, [isMicEnabled, isVideoEnabled, userMedia]);

    const contextValue = {
        isMicEnabled,
        isVideoEnabled,
        chatMessages,
        toggleMic,
        toggleVideo,
        addChatMessage,
        setChatMessages,
        userMedia,
        setUserMedia,
    };

    return (
        <VideoChatContext.Provider value={contextValue}>
            {children}
        </VideoChatContext.Provider>
    );
};
