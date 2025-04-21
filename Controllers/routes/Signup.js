const router = require('express').Router();
const { User, validateUser } = require('../../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../../utils/Mailer');
const { uploadToCloudinary } = require('../../utils/cloudinaryUploader');
require('dotenv').config();


router.post('/', async (req, res) => {
    try {
        // Validate user input
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if email or phone number is already in use
        const existingUser = await User.findOne({ email: req.body.email });
        const existingUserByPhone = await User.findOne({ phone: req.body.phone });

        if (existingUser) {
            return res.status(400).json({ message: 'That email is already in use.' });
        }

        if (existingUserByPhone) {
            return res.status(400).json({ message: 'That phone number is already in use.' });
        }
        if (!req.body.image)
            return res.status(500).json({ message: 'Profile image Required Plz' });

        const uploadResult = await uploadToCloudinary(req.body.image, `${req.body.phone}`);

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user instance
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            role:'NORMAL',
            image: uploadResult.url,
            isVerified: false,
        });



        // Send verification email
        try {
            await sendVerificationEmail(req.body.email);

            // Save the user to the database
            await user.save();

            const user_token_object = user.toObject();
            user_token_object.password = "";

            // Generate JWT token
            const token = jwt.sign(
                user_token_object,
                process.env.JWT,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ token, message: 'Validation code sent. Check your email.' });
        } catch (emailError) {
            return res.status(500).json({ message: emailError.message });
        }
    } catch (serverError) {
        return res.status(500).json({ message: serverError.message });
    }
});

module.exports = router;
