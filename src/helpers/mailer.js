import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_HOST,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendConfirmationEmail = async (data) => {

    //send email
    const {username, email, token} = data
    console.log(token);

    const info = await transporter.sendMail({
        from: "CashFlowControl",
        to: email,
        subject: "Verify your account",
        text: "Verify your account",
        html: `<h1>Welcome to CashFlowControl, ${username}!</h1>
            <p>Please verify your account on the link below:</p>
            <a href="${process.env.FRONTEND_URL}/verify-account/${token}" target="_blank">click here to verify your account</a>

            <p>If you didn't create this account, please ignore this email.</p>
        `
    });

}

const sendNewPasswordEmail = async (data) => {
    //send mail
    const {username, email, token} = data

    const info = await transporter.sendMail({
        from: "CashFlowControl",
        to: email,
        subject: "Change password request",
        text: "You requested a change in your password",
        html: `<h1>Hi, ${username}!</h1>
            <p>Please change your password on the link below:</p>
            <a href="${process.env.FRONTEND_URL}/change-password/${token}" target="_blank">click here to verify your account</a>

            <p>If you didn't request this change in your password, click the link and press the cancel button.</p>
        `
    });
}

export {
    sendConfirmationEmail,
    sendNewPasswordEmail
};

