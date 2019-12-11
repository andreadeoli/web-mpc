const nodemailer = require('nodemailer');
var format = require("string-template");
const modelWrappers = require('../models/modelWrappers.js');
const emailTemplates = require('./emailTemplates.js');
const strftime = require('strftime');

module.exports = {};

const STRFTIME_FORMAT_STRING = "%A %B %e, %Y at %l:%M %p";

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MODERATOR_EMAIL_USER,
    pass: process.env.MODERATOR_EMAIL_PASS
  }
});

module.exports.sendEmail = function (session, email, url) {
  modelWrappers.SessionInfo.get(session).then(function(data) {

    let mailOptions = {
      from: process.env.MODERATOR_EMAIL_USER,
      to: email,
      subject: '[Election] ' + data.title,
      html: format(emailTemplates.participationEmailHTML, {
        title: data.title,
        description: data.description,
        time: strftime(STRFTIME_FORMAT_STRING, data.time) + " EST",
        url: process.env.URL_BASE + url
      }),
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  });
};

module.exports.sendResultEmail = function (session, participants, result, shouldSendParticipants) {
  var promise1 = modelWrappers.SessionInfo.get(session);
  var promise2 = modelWrappers.UserKey.query(session);

  let resultText = "Number of Yes votes: " + result[0] + "<br>\n" +
    "Number of No votes: " + result[1] + "<br>" +
    "Number of Abstentions: " + result[2] + "<br><br>";

  if (shouldSendParticipants) {
    let participantText = participants.join("<br>");
    resultText += "The specified participants submitted votes:<br>" +
      participantText;
  }

  Promise.all([promise1, promise2]).then(function(data) {
    for (let d of data[1]) {
      let title = data[0].title;
      let mailOptions = {
        from: process.env.MODERATOR_EMAIL_USER,
        to: d.email,
        subject: '[Election Result] ' + title,
        html: format(emailTemplates.resultEmailHTML, {
          title: title,
          resultText: resultText,
        }),
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  });
};
