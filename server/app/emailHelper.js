const nodemailer = require('nodemailer');
module.exports = {};

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MODERATOR_EMAIL_USER,
    pass: process.env.MODERATOR_EMAIL_PASS
  }
});

module.exports.sendEmail = function (name, email, url) {
  let mailOptions = {
    from: process.env.MODERATOR_EMAIL_USER,
    to: email,
    subject: 'Election Participation URL',
    text: "Hello " + name
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
