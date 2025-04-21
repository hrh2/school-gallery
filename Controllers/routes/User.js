const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { extractRoledFromToken, extractUserIdFromToken } = require('../middlewares/Extractors');
const { verifyToken } = require('../middlewares/VerifyToken');
const { User } = require('../../Models/User');
const jwt = require('jsonwebtoken');
const { sendPasswordChangedNotificationEmailOnly } = require('../../utils/Mailer');
require('dotenv').config();

// Read all tasks
router.get('/all-users', verifyToken, async (req, res) => {
    try {
        const role = extractRoledFromToken(req);

        if (role !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied. Only admins can view users.' });
        }

        const { page = 1, pageSize = 10 } = req.query; // Get pagination params
        const skip = (page - 1) * pageSize; // Calculate documents to skip
        const totalCount = await User.countDocuments(); // Total number of users
        const users = await User.find().skip(skip).limit(parseInt(pageSize));

        return res.status(200).json({ users, totalCount });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = extractUserIdFromToken(req); // Extract user ID from the verified token

        const user = await User.findById(userId).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
    }
});

// PUT /profile - Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    const userId = extractUserIdFromToken(req); // Extract user ID from the verified token
    const { firstName, lastName, phone, password } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if(!password)
            return res.status(400).json({message: 'Please enter a password'})

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password .' });
        }

        // Update user fields if provided
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;

        await user.save();

        const token = jwt.sign({ _id: user._id, email: user.email, phone: user.phone ,role:user.role,image:user.image ,name:user.firstName,isVerified:user.isVerified}, process.env.JWT);

        res.status(200).json({ message: 'Profile updated successfully.', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/change-password', verifyToken, async (req, res) => {
    const userId = extractUserIdFromToken(req); // Extract user ID from the verified token
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Save the updated user
        await user.save();

        await sendPasswordChangedNotificationEmailOnly(user.email)

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
