require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Banking System" <${process.env.EMAIL_USER}>`, // sender address
            to,
            subject,
            text,
            html,

        });


        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
async function registerEmail(userEmail, name) {
    const subject = "🎉 Welcome to Banking System — Your Account is Ready!";
    const text = `Hello ${name}, Welcome to Banking System! Your account has been successfully created. We're thrilled to have you on board.`;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
    <body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#6c63ff,#3b82f6);padding:40px;text-align:center;">
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;color:rgba(255,255,255,0.8);text-transform:uppercase;">Welcome to</p>
                <h1 style="margin:0;font-size:32px;font-weight:800;color:#ffffff;">🏦 Banking System</h1>
                <p style="margin:12px 0 0;font-size:14px;color:rgba(255,255,255,0.75);">Secure • Smart • Seamless</p>
              </td>
            </tr>

            <!-- Body -->
            <tr><td style="padding:40px;">
              <p style="margin:0 0 4px;font-size:13px;color:#6c63ff;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Hello,</p>
              <h2 style="margin:0 0 20px;font-size:26px;color:#ffffff;font-weight:700;">${name} 👋</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#a0aec0;line-height:1.8;">
                We're absolutely thrilled to welcome you to <strong style="color:#ffffff;">Banking System</strong> — your all-in-one platform for secure and intelligent financial management. Your account has been <strong style="color:#6c63ff;">successfully created</strong> and is ready to use!
              </p>

              <div style="height:1px;background:linear-gradient(to right,transparent,#6c63ff,transparent);margin:28px 0;"></div>

              <p style="margin:0 0 16px;font-size:13px;color:#6c63ff;text-transform:uppercase;letter-spacing:2px;font-weight:600;">What you can do</p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
                    <div style="background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.2);border-radius:12px;padding:20px;">
                      <p style="margin:0 0 6px;font-size:22px;">💸</p>
                      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Transfers</p>
                      <p style="margin:0;font-size:12px;color:#718096;">Send & receive money instantly</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
                    <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:20px;">
                      <p style="margin:0 0 6px;font-size:22px;">📊</p>
                      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Analytics</p>
                      <p style="margin:0;font-size:12px;color:#718096;">Track your spending & savings</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:0 8px 0 0;vertical-align:top;">
                    <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px;">
                      <p style="margin:0 0 6px;font-size:22px;">🔐</p>
                      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Security</p>
                      <p style="margin:0;font-size:12px;color:#718096;">Bank-grade encryption always on</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 0 8px;vertical-align:top;">
                    <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:20px;">
                      <p style="margin:0 0 6px;font-size:22px;">🏧</p>
                      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Accounts</p>
                      <p style="margin:0;font-size:12px;color:#718096;">Manage multiple accounts easily</p>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="height:1px;background:linear-gradient(to right,transparent,#3b82f6,transparent);margin:28px 0;"></div>

              <p style="margin:0 0 24px;font-size:15px;color:#a0aec0;line-height:1.8;">
                You're all set! Log in now and take full control of your finances. If you ever need help, our support team is always here for you. 💙
              </p>

              <table cellpadding="0" cellspacing="0" width="100%">
                <tr><td align="center">
                  <a href="http://localhost:3000" style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#3b82f6);color:#ffffff;text-decoration:none;padding:14px 48px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:1px;box-shadow:0 8px 24px rgba(108,99,255,0.4);">
                    🚀 Get Started Now
                  </a>
                </td></tr>
              </table>
            </td></tr>

            <!-- Footer -->
            <tr>
              <td style="background:rgba(0,0,0,0.3);padding:24px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0 0 8px;font-size:13px;color:#4a5568;">This email was sent to <strong style="color:#6c63ff;">${userEmail}</strong></p>
                <p style="margin:0;font-size:12px;color:#2d3748;">© 2026 Banking System. All rights reserved.</p>
                <p style="margin:8px 0 0;font-size:11px;color:#2d3748;">If you didn't create this account, please ignore this email.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
    `;
    await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendEmail, registerEmail };