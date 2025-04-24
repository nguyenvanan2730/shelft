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
        html:createVerificationEmail(token),
    });
}

function createVerificationEmail(token){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
            
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center;">
          
                <tr>
                <td style="padding-bottom: 20px;">
                    <h1 style="color: #333333; font-size: 24px; margin: 0;">Verify Your Email Address</h1>
                </td>
                </tr>

                <tr>
                <td style="padding: 10px 20px;">
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                    Thank you for signing up in Shelft! To complete your registration, please verify your email address by clicking the button below.
                    </p>
                </td>
                </tr>

                <tr>
                <td style="padding: 20px;">
                    <a href="http://127.0.0.1:3000/verify/${token}"
                    style="display: inline-block; padding: 12px 20px; text-decoration: none; background-color: #007BFF; color: #ffffff; font-size: 16px; border-radius: 5px; font-weight: bold;">
                    Verify Email
                    </a>
                </td>
                </tr>

                <tr>
                <td style="padding: 10px 20px;">
                    <p style="color: #555555; font-size: 14px; line-height: 1.5;">
                    If you did not sign up for this account, please ignore this email.
                    </p>
                </td>
                </tr>

                <tr>
                <td style="padding-top: 20px;">
                    <p style="font-size: 12px; color: #777777;">
                    This is an automated email, please do not reply.
                    </p>
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
    </body>
    </html>

    `
}

export async function sendPasswordResetEmail(user_email, token) {
    const resetLink = `http://127.0.0.1:3000/reset-password/${token}`;
  
    return await transporter.sendMail({
      from: 'Shelft. <perette93@gmail.com>',
      to: user_email,
      subject: 'Reset your password',
      html: `
        <h2>Reset your password</h2>
        <p>We received a request to reset your password. Click the button below to reset it.</p>
        <a href="${resetLink}" style="background-color: #007BFF; padding: 10px 15px; text-decoration: none; color: white; border-radius: 5px;">Reset Password</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      `
    });
  }
  