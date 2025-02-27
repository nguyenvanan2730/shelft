import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:465,
    secure:true,
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

export async function sendVerificationEmail(user_email, token){
    return await transporter.sendMail({
        from:'Shelft. <perette93@gmail.com>',
        to:user_email,
        subject:'Verify your email',
        text:createVerificationEmail(token),
    });
}

function createVerificationEmail(token){
    return `
    
    <!DOCTYPE html>
    <html lang="en">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #333333;
            }
            p {
                color: #555555;
                font-size: 16px;
                line-height: 1.5;
            }
            .button {
                display: inline-block;
                padding: 12px 20px;
                margin: 20px 0;
                text-decoration: none;
                background-color: #007BFF;
                color: #ffffff;
                font-size: 16px;
                border-radius: 5px;
                font-weight: bold;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777777;
            }
        </style>
    <body>
        <div class="container">
            <h1>Verify Your Email Address</h1>
            <p>Thank you for signing up in Shelft.! To complete your registration, please verify your email address by clicking the button below.</p>
            <a href="http://localhost:3000/verify/${token}" class="button">Verify Email</a>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <p class="footer">This is an automated email, please do not reply.</p>
        </div>
    </body>
    </html>
    `
}