'use strict';

const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');
const sendgridMail = require('@sendgrid/mail');
const uuidV4 = require('uuid/v4');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWelcomeEmail(email) {
  const [username, ] = email.split('@');
  const msg = {
    to: email,
    from: 'tutortechonline@yopmail.com',
    subject: '¡Bienvenido a Tutor Tech Online!',
    text: `Bienvenido a Tutor Tech Online, ${username}. Aprende preguntando y respondiendo en nuestra comunidad.  Ya puedes iniciar sesión y comenzar a participar en http://localhost:3000/login.`,
    html: `<strong> Bienvenido a Tutor Tech Online, ${username}.</strong> <br /> Aprende preguntando y respondiendo en nuestra comunidad. <br /> Ya puedes iniciar sesión y comenzar a participar en <a href='http://localhost:3000/login'>Tutor TECH Online</a>.`,
  };

  const data = await sendgridMail.send(msg);
  console.log(data);

  return data;
}

async function validateSchema(payload) {
  const schema = Joi.object({
    username: Joi.string().regex(/^[a-zA-Z0-9]{5,25}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    role: Joi.string().regex(/^[a-zA-z]{4,6}$/),
  });

  Joi.assert(payload, schema);
}

async function createAccount(req, res, next) {
  const accountData = { ...req.body };
  try {
    await validateSchema(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

 
  const now = new Date();
  const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);
  const userId = uuidV4();
  const securePassword = await bcrypt.hash(accountData.password, 10);
  const role = accountData.role === undefined ? 'User' : accountData.role

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    await connection.query('INSERT INTO users SET ?', {
      id: userId,
      email: accountData.email,
      userName: accountData.username,
      password: securePassword,
      role: role,
      createdAt: createdAt,
    });
    connection.release();

    res.status(201).send();

   
    try {
      await sendWelcomeEmail(accountData.email);
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).send();
    }

    return res.status(500).send();
  }
}

module.exports = createAccount;
