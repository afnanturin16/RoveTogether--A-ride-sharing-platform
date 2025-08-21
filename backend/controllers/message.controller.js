const Message = require('../models/message.model');
const User = require('../models/user.model');

// Send a message to all admins
exports.sendMessageToAllAdmins = async (req, res) => {
    try {
        const { content } = req.body;
        const senderId = req.user.id;

        // Find all admin users using the role field
        const admins = await User.find({ role: 'admin' });
        
        if (admins.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'No admin users found' 
            });
        }

        // Create messages for each admin
        const messagePromises = admins.map(admin => {
            const message = new Message({
                sender: senderId,
                receiver: admin._id,
                content
            });
            return message.save();
        });

        await Promise.all(messagePromises);
        res.status(201).json({ 
            success: true, 
            message: 'Message sent to all admins',
            adminCount: admins.length 
        });
    } catch (error) {
        console.error('Error sending message to admins:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content
        });

        await message.save();
        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get messages for a user
exports.getUserMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'fullname email role')
        .populate('receiver', 'fullname email role')
        .sort({ createdAt: -1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching user messages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all messages (for admin)
exports.getAdminMessages = async (req, res) => {
    try {
        const adminId = req.user.id;
        const messages = await Message.find({
            $or: [
                { receiver: adminId },
                { sender: adminId }
            ]
        })
        .populate('sender', 'fullname email role')
        .populate('receiver', 'fullname email role')
        .sort({ createdAt: -1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching admin messages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        );
        res.status(200).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};