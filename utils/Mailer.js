const nodemailer = require('nodemailer');
// const { Resend } =require("resend");
require('dotenv').config()
// const resend = new Resend(process.env.MAILER_TOKEN);
const { generateOneTimeCode } = require('../Models/OneTimeCode');

// /*
const transporter = nodemailer.createTransport({
    // service: 'hotmail',
    host:"smtp.gmail.com" ,
    port: 465,
    secure:true,
    auth: {
        user: process.env.MAILER,
        pass: process.env.MAILER_PASSWORD
    }
});
// */

async function sendVerificationEmail(email) {
    const verificationCode = await generateOneTimeCode(email);
    const mailOptions = {
        from: `B-School <${process.env.MAILER}>`,
        to: email,
        subject: 'B-School Verification Code',
        text: `Hello,\n\nThank you for signing up with B-School! To complete your registration, please verify your email address using the code below:\n\nVerification Code: ${verificationCode}\n\nAlternatively, you can click the following link to verify your email:\nhttps://buu-backend.onrender.com/verify/email?email=${email}&code=${verificationCode}\n\nIf you did not sign up for this account, please ignore this email.\n\nBest regards,\nBYOSE Team`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #4CAF50; text-align: center;">Welcome to B-School!</h1>
                <p>Hello,</p>
                <p>Thank you for signing up with <strong>B-School</strong>! To complete your registration, please verify your email address using the code below:</p>
                <p style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center;">${verificationCode}</p>
                <p>Alternatively, you can click the following link to verify your email:</p>
                <p style="text-align: center;">
                    <a href="https://buu-backend.onrender.com/verify/email?email=${email}&code=${verificationCode}" 
                       style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
                       Verify My Email
                    </a>
                </p>
                <p>If you did not sign up for this account, please ignore this email.</p>
                <p>Best regards,<br>BYOSE Team</p>
            </div>
        `
    };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}
async function sendVerificationEmailOnly(email,code) {
    const mailOptions = {
        from: `B-School <${process.env.MAILER}>`,
        to: email,
        subject: 'Re-verify Your Email Address',
        text: `Hello,\n\nWe noticed that you need to re-verify your email address for your B-School account. Please use the code below to complete the process:\n\nVerification Code: ${code}\n\nIf you did not request this, please contact our support team immediately.\n\nBest regards,\nB-School Team`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #4CAF50; text-align: center;">Re-verify Your Email Address</h1>
                <p>Hello,</p>
                <p>We noticed that you need to re-verify your email address for your <strong>B-School</strong> account. Please use the code below to complete the process:</p>
                <p style="font-size: 30px; font-weight: bold; color: #4CAF50; text-align: center;">${code}</p>
                <p>If you did not request this, please contact our support team immediately.</p>
                <p>Best regards,<br>B-School Team</p>
            </div>
        `
    };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

async function sendPasswordChangedNotificationEmailOnly(email) {
    const mailOptions = {
        from: `B-School <${process.env.MAILER}>`,
        to: email,
        subject: 'Your Password Has Been Changed',
        text: 'We wanted to let you know that the password for your account on B-School has been successfully changed.',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #4CAF50;">Password Changed Successfully</h1>
                <p>Hello,</p>
                <p>This is a confirmation that the password for your account on <strong>B-School</strong> has been successfully changed.</p>
                <p>If you did not make this change, please contact our support team immediately to secure your account.</p>
                <p>Best regards,<br>B-School Team</p>
            </div>
        `
    };    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

async function sendAdminAlert(subject, message) {
    const mailOptions = {
        from: `B-School <${process.env.MAILER}>`,
        to: process.env.MAILER,
        subject,
        text: message,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">${message}</div>`
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) reject(error);
            else resolve(info);
        });
    });
}

async function sendClassNotification(email){
    const mailOptions = {
        from: `B-School <${process.env.MAILER}>`,
        to: email,
        subject: 'Update on Your Class Enrollment Request',
        text: `Hello,\n\nWe wanted to inform you that the status of your request to join different classes has been updated. Please log in to B-School to check the current status of your request.\n\nIf you have any questions or need assistance, please feel free to reach out to our support team.\n\nBest regards,\nB-School Team`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #4CAF50; text-align: center;">Your Class Enrollment Request Status Has Been Updated</h1>
                <p>Hello,</p>
                <p>We wanted to inform you that the status of your request to join different classes has been updated. Please log in to <strong>B-School</strong> to check the current status of your request:</p>
                <p style="text-align: center;">
                    <a href="https://b-School.vercel.app/requests" 
                       style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
                       Check Status on B-School
                    </a>
                </p>
                <p>If you have any questions or need assistance, please feel free to reach out to our support team.</p>
                <p>Best regards,<br>B-School Team</p>
            </div>
        `
    
    };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) reject(error);
            else resolve(info);
        });
    });

}


// sendVerificationEmail("hopehirwa50@gmail.com","User")
module.exports = {
sendVerificationEmail,
sendVerificationEmailOnly,
sendPasswordChangedNotificationEmailOnly,
sendAdminAlert,
sendClassNotification
}