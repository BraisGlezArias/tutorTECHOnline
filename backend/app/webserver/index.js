'use strict';

const express = require('express');

const {
  answerRouter,
  accountRouter,
  loginRouter,
  questionRouter,
  ratingRouter,
  tagRouter,
  userRouter,
} = require('./routes');

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use('/api', answerRouter);
app.use('/api', accountRouter);
app.use('/api', loginRouter);
app.use('/api', questionRouter);
app.use('/api', ratingRouter);
app.use('/api', tagRouter);
app.use('/api', userRouter);

let server = null;
async function listen(port) {
  if (server) {
    return server;
  }

  try {
    server = await app.listen(port);
    return server;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function close() {
  if (server) {
    await server.close();
    server = null;
  } else {
    console.error('Can not close a non started server');
  }
}

module.exports = {
  listen,
  close,
};
