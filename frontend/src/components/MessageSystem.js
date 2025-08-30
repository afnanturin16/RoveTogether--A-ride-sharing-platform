import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const MessageSystem = () => {
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/messages/send-to-all-admins',
                { content: newMessage },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            setNewMessage('');
            setSuccess(`Message sent successfully to ${response.data.adminCount} admin(s)`);
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="message-system">
            <h2>Send Message to Admins</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Message Form */}
            <form onSubmit={sendMessage} className="message-form">
                <div className="message-info">
                    <p>Your message will be sent to all administrators</p>
                </div>
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message to admins..."
                    required
                    disabled={isSending}
                />
                <button type="submit" disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send Message to All Admins'}
                </button>
            </form>
        </div>
    );
};

export default MessageSystem;