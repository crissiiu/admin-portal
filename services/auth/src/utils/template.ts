export const forgotPasswordTemplate = (resetLink: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #333333;
                font-size: 24px;
                margin: 0;
            }
            .content {
                padding: 20px 0;
                color: #555555;
                line-height: 1.6;
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .btn {
                background-color: #007bff;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
            }
            .btn:hover {
                background-color: #0056b3;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                border-top: 1px solid #e0e0e0;
                padding-top: 20px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Reset Your Password</h1>
            </div>
            <div class="content">
                <p>Hi There,</p>
                <p>We received a request to reset your password for your Higher Heaven account. Click the button below to choose a new password:</p>
                <div class="button-container">
                    <a href="${resetLink}" class="btn">Reset Password</a>
                </div>
                <p>This link will expire in 15 minutes for security reasons.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>The Higher Heaven Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Higher Heaven. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
