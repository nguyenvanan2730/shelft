import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL;

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

function createVerificationEmail(token) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Outfit', sans-serif;">
  
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center;">
              
              <tr>
                <td style="padding-bottom: 20px;">
                  <img src="../../public/images/logo.svg" alt="Shelft Logo" width="50" />
                </td>
              </tr>
              <tr>
                <td style="color: #1a1a1a; font-size: 22px; font-weight: bold;">
                  Welcome to <span style="color: #D97852;">Shelft</span>, reader!
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0; color: #444; font-size: 16px;">
                  We're excited to have you on board. To get started, please confirm your email by clicking the button below.
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <a href="${BASE_URL}/verify/${token}" style="background-color: #D97852; padding: 14px 28px; border-radius: 6px; color: #fff; text-decoration: none; font-size: 16px; font-weight: bold;">
                    Verify My Email
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 30px; color: #999; font-size: 13px;">
                  If you didn't sign up, you can safely ignore this email.
                </td>
              </tr>
              <tr>
                <td style="padding-top: 10px; color: #ccc; font-size: 12px;">
                  Shelft © 2025 · Read beautifully 📚
                </td>
              </tr>
  
            </table>
          </td>
        </tr>
      </table>
  
    </body>
    </html>`;
  }
  

  export async function sendPasswordResetEmail(user_email, token) {
    const resetLink = `${BASE_URL}/reset-password/${token}`;
  
    return await transporter.sendMail({
      from: 'Shelft. <perette93@gmail.com>',
      to: user_email,
      subject: 'Reset your password',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Outfit', sans-serif;">
  
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center;">
                
                <tr>
                  <td style="padding-bottom: 20px;">
                    <img src="../../public/images/logo.svg" alt="Shelft Logo" width="50" />
                  </td>
                </tr>
                <tr>
                  <td style="color: #1a1a1a; font-size: 22px; font-weight: bold;">
                    Reset your password 🔐
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0; color: #444; font-size: 16px;">
                    Forgot your password? Don't worry — just click the button below to set a new one.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <a href="${resetLink}" style="background-color: #D97852; padding: 14px 28px; border-radius: 6px; color: #fff; text-decoration: none; font-size: 16px; font-weight: bold;">
                      Reset Password
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 30px; color: #999; font-size: 13px;">
                    Didn't request a password change? Just ignore this email.
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 10px; color: #ccc; font-size: 12px;">
                    Shelft © 2025 · We care about your privacy 🌐
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
  
      </body>
      </html>
      `
    });
  }
  