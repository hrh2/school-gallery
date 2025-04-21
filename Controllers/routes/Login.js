require('dotenv').config();
const router = require('express').Router();
const { User, validateOnLogin } = require('../../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        const { error } = validateOnLogin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        // Remove whitespace from email/phone input
        const email_phone = req.body.email_phone.replace(/\s/g, "");
        // Check if email_phone contains only digits (valid phone number)
        const isNumeric = /^\d+$/.test(email_phone);
        let user;
        if (isNumeric) {
            user = await User.findOne({ phone: parseInt(email_phone) });
        } else {
            user = await User.findOne({ email: email_phone });
        }
        if (!user) return res.status(401).json({ message: 'Invalid Email/Phone or Password' });
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid Email/Phone or Password' });

        const token = jwt.sign({ _id: user._id, email: user.email, phone: user.phone ,role:user.role,image:user.image ,name:user.firstName,isVerified:user.isVerified}, process.env.JWT);
        res.status(200).json({ token: token,message:"Successfully Logged in" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
