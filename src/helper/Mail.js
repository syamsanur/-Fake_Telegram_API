const nodemailer = require('nodemailer')
const env = require('../helper/env')

const sendMail = (email, token) => {
  // <td align="center" style="border-radius: 3px;" bgcolor="#2395FF"><a href="${env.HOSTURL}${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #2395FF; display: inline-block;">Confirm Account</a></td>
    const output = `<!DOCTYPE html>
    <html>
    
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    
    <body>
    
    <div class="container-fluid">
      <div class="row">
        <a href="${env.HOSTURL}${token}"
        class="btn btn-primary btn-lg active" 
        role="button" 
        aria-pressed="true">
          Primary link
        </a>
      </div>
    </div>

    </body>
    
    </html>
                `
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: env.USEREMAIL,
            pass: env.USERPASS
        }
    });

    let Mail = {
        from: '"App Chat Team" <app_chat.com>',
        to: email,
        subject: "Verification Email",
        text: "Plaintext version of the message",
        html: output
    };
    transporter.sendMail(Mail)
}

module.exports = sendMail