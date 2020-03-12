'use strict';

const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const mysqlPool = require('../../../database/mysql-pool');
const sendgridMail = require('@sendgrid/mail');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(email) {
    const [username, ] = email.split('@');
    const msg = {
      to: email,
      from: 'tutortechonline@yopmail.com',
      subject: '¡Enhorabuena! ¡Ahora eres un Experto!',
      text: `¡Enhorabuena ${username}! Has pasado nuestro riguroso test y has conseguido el rol de experto en Tutor TECH Online. La próxima vez que inicies sesión, podrás responder a las preguntas de la comunidad y ayudar a otros usuarios de <a href='http://localhost:3000/login'>Tutor TECH Online</a>.`,
      html: `<strong>¡Enhorabuena ${username}!</strong> <br /> Has pasado nuestro riguroso test y has conseguido el rol de experto en Tutor TECH Online. <br /> La próxima vez que inicies sesión, podrás responder a las preguntas de la comunidad y ayudar a otros usuarios de <a href='http://localhost:3000/login'>Tutor TECH Online</a>.`,
    };
  
    const data = await sendgridMail.send(msg);
    console.log(data);
  
    return data;
}

async function validateSchema(payload) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        role: 'Expert',
    });

    Joi.assert(payload, schema);
}

async function changeRole(req, res, next) {

    const newRole = {
        ...req.body,
    }

    const role = newRole.role;
    const email = newRole.email;

    try {
        await validateSchema(newRole);
    } catch (e) {
        console.error(e);
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();

        const sqlChangeRole = `UPDATE users
        SET role= ?
        WHERE email = ?`;

        const [updatedStatus] = await connection.query(sqlChangeRole, [
            role,
            email,
        ]);

        const sqlQuery = `SELECT id, email, password, userName, role, avatarUrl
        FROM users
        WHERE email = ?`;
        const [rows] = await connection.query(sqlQuery, [email]);
        connection.release();

        const user = rows[0];

        if (updatedStatus.changedRows === 0) {
        return res.status(404).send();
        }

        const payloadJwt = {
            userId: user.id,
            role: user.role,
        }

        const jwtExpiresIn = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL);
        const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, {
        expiresIn: jwtExpiresIn,
        })

        try {
            await sendConfirmationEmail(email);
        } catch (e) {
            console.error(e);
        }

        return res.status(204).send({
            userId: user.id,
            role: user.role,
            accessToken: token,
            avatarUrl: user.avatarUrl,
            expiresIn: jwtExpiresIn,
          });
    } catch (e) {
        if (connection) {
          connection.release();
        }
    
        console.error(e);
        return res.status(500).send({
          message: e.message,
        });
    }
}

module.exports = changeRole;