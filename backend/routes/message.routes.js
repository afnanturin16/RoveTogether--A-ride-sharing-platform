const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/send-to-all-admins', authMiddleware.authUser, messageController.sendMessageToAllAdmins);
router.post('/send', authMiddleware.authUser, messageController.sendMessage);
router.get('/user-messages', authMiddleware.authUser, messageController.getUserMessages);
router.get('/admin-messages', authMiddleware.authUser, messageController.getAdminMessages);
router.put('/mark-read/:messageId', authMiddleware.authUser, messageController.markAsRead);

module.exports = router;