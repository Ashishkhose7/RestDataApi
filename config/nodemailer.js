const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.USERMAIL,
        pass: process.env.CLIENTID
    }
});

module.exports = {
    transporter: transporter,
}