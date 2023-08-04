"use strict";
// import fetch from "node-fetch";

import {https} from "firebase-functions";
// import {createTransport} from "nodemailer";

// export const sendNotification = https.onRequest((req, res) => {
//   const pushToken = req.params[0].toString().slice(1);
//   // console.log(req);
//   console.log(pushToken);
//   const messages = {
//     to: pushToken,
//     body: "You got a new message",
//   };
//   console.log("hello");
//   const ret = fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "context-Type": "application/json",
//     },
//     body: JSON.stringify(messages),
//   })
//     .then((res) => res.text())
//     .catch((err) => res.json(err));
//   console.log("https");
//   console.log(ret);
//   return res;
// });

// export const CallNotification = https.onCall((data, context) => {
//   const message = data.message;
//   const ret = fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "context-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });
//   console.log("https");
//   console.log(ret);
//   return ret;
// });

// export const sendMail = https.onCall((data, context) => {
//   const email = data.email;
//   const transporter = createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "mail.sportana@gmail.com",
//       pass: "chxjyjvlvcdvmckj",
//     },
//   });
//   const info = transporter.sendMail({
//     from: "mail.sportana@gmail.com", // sender address
//     to: email, // list of receivers
//     subject: "Sportana ✔", // Subject line
//     text: "Hello world?", // plain text body
//   });
//   Promise.resolve(info)
//     .then(() => {
//       return "done";
//     })
//     .catch((err) => {
//       return err.message;
//     });
// });

export const sendCustomNotification = https.onCall((data, context) => {
  const Token = data.Token;
  const message = data.Message;
  Token.forEach((item) => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "context-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  });
});
