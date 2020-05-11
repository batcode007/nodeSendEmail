"use strict";

const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
// const UserModel = require("./lib/dbModels/UserModel");     Assuming we have a userModel
const COUNTERTIME = 15 * 60 * 1000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uname@gmail.com",
    pass: "passwd"
  }
});
const mailOptions = {
  from: "uname@gmail.com",
  to: "receiver@gmail.com",
  subject: "List of Similar Questions",
  text: "PFA list of similar questions in pdf format!"
};

/**
 *
 * @param event {
 *   userActivity : onKeyboardPress, onMouseHover, onMouseClick,
 *   fileData : ''  //string in json format
 *   userEmail : ''
 * }
 */
module.exports.handler = (event) => {
  let dataToSave;
  if (!event || !event.fileData || !event.userActivity || !event.userEmail) {
    throw new Error("Missing one or more required parameters");
  }

  dataToSave = event.fileData;
  // assuming UserModel returns a Promise
  return UserModel.getUserFromEmail(event.userEmail)
    .then(user => {
      if (user.isTimerInProgress) {
        clearTimeout(user.timer);
      }
      let timer = setTimeout(saveToPDF, COUNTERTIME, dataToSave, event.userEmail);

      user.timer = timer;
      user.isTimerInProgress = true;
      return UserModel.create(user).dbSave();
    });
};

const saveToPDF = (fileData, email) => {
  /**
   save file to s3 or on any other cloud location.
   Read from there and send via mail

   OR

   format data using html and send mail
   * */
  return pdf.create(fileData, {format: "Letter"}).toFile("/Users/user/Desktop/testFile.pdf", (err, res) => {
    if (err) {
      throw new Error("QWERT");
    } else {
      return sendEmail(email);
    }
  });
};

const sendEmail = (emailId) => {
  mailOptions.to = emailId;
  mailOptions.attachments = [{
    "filename": "/Users/user/Desktop/testFile.pdf"
  }];
  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// https://stackoverflow.com/questions/32941366/how-to-export-json-data-to-pdf-file-with-specify-format-with-nodejs