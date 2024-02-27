var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var roleRouter = require('./routes/role');
var serviceRouter = require('./routes/service');

var offerRouter = require('./routes/offer');
var depenseRouter = require('./routes/depense');

var protectedRouter = require('./routes/protected');
var rdvRouter = require('./routes/rdv');
var workScheduleRouter = require('./routes/workSchedule');
var preferenceRouter = require('./routes/preference');

var cors = require('cors')

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Rdv = require('./models/Rdv');

const Offer = require('./models/Offer');

require('./models/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true
}
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/protected', protectedRouter);
app.use('/role', roleRouter);
app.use('/service', serviceRouter);

app.use('/depense', depenseRouter);
app.use('/offer', offerRouter);
app.use('/rdv', rdvRouter);
app.use('/workSchedule', workScheduleRouter);
app.use('/preference', preferenceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// cron.schedule('* * * * *', async () => {
//   console.log('llllll');
//   // Find all appointments 1 hour from now
//   const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
//   const rdvs = await Rdv.find({ date: { $gt: new Date(), $lte: oneHourFromNow } });
//   console.log(rdvs);
//   rdvs.forEach(async (rdv) => {
//     try {
//       await sendEmail(rdv.client.email, 'Rendez-vous Manjatiana', `Vous avez un rendez-vous prévu à ${rdv.date}.`);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   });
// });


// cron.schedule('* * * * *', async () => {

//   try {
//     // Find offers for today
//     const dateToCheck = new Date().toISOString();

//     const offers = await Offer.find({
//         $and: [
//             { dateDebut: { $lte: dateToCheck } }, // Check if dateDebut is less than or equal to given date
//             { dateFin: { $gte: dateToCheck } }    // Check if dateFin is greater than or equal to given date
//         ]
//     });
//     console.log(offers);
//     if (offers.length === 0) {
//         console.log('No offers available for today.');
//         return;
//     }

//     // Find clients with role 'client'
//     const clients = await User.find({ 'role.roleName': 'client' });
//     console.log(clients);
//     // Send email to each client
//     clients.forEach(async (client) => {
//         offers.forEach(async (offer) => {
//             try {
//                 await sendEmail(client.email, 'Offre spéciale', offer.description);
//             } catch (error) {
//                 console.error('Error sending email:', error);
//             }
//         });
//     });
// } catch (error) {
//     console.error('Error checking offers:', error);
// }
// });

async function sendEmail(to, subject, body) {
  // Configure nodemailer with your email service details
  let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: 'renyudark@zohomail.com',
      pass: 'Gofuckurself420!!'
    }
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'renyudark@zohomail.com',
    to: to,
    subject: subject,
    text: body
  });

  console.log('Email sent:', info.messageId);
}

module.exports = app;
