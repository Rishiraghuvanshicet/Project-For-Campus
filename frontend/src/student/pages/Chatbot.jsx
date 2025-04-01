import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import logo from './robot.png';
import './Chat.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        newSocket.emit('get_chat_history');
        newSocket.on('chat_history', (history) => {
            setMessages(history);
        });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socket) return;

        socket.emit('send_message', {
            user: 'Student',
            message: inputMessage,
            timestamp: new Date(),
        });

        setInputMessage('');
    };

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    if (!isOpen) {
        return (
            <button onClick={toggleChatbot} className="chatbot-toggle-btn">
                <img src={logo} alt="Logo" width="30" height="20" />
            </button>
        );
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>📢 Placement Support</h3>
                <button onClick={toggleChatbot} className="close-btn">✖</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.user === 'Placement Bot' ? 'bot-message' : 'user-message'}`}
                    >
                        <strong>{msg.user}: </strong>{msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="chat-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about placements..."
                />
                <button type="submit">➤</button>
            </form>
        </div>
    );
};

export default Chatbot;
