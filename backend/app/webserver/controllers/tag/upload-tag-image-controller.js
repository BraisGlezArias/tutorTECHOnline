'use strict';

const cloudinary = require('cloudinary').v2;
const mysqlPool = require('../../../database/mysql-pool');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  async function uploadImageTag(req, res, next) {
      const { tagId } = req.params;
      const { file } = req;

      if (!file || !file.buffer) {
        return res.status(400).send({
          message: 'invalid image',
        });
      }

      cloudinary.uploader.upload_stream({
        resource_type: 'image',
        public_id: tagId,
        width: 250,
        height: 250,
        format: 'png',
        crop: 'limit',
      }, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).send(err);
        }
        
        const {
          secure_url: secureUrl,
        } = result;

        let connection;
        try {
            const sqlQuery = `UPDATE tags
            SET image = ?
            WHERE id = ?`;
            connection = await mysqlPool.getConnection();
            connection.execute(sqlQuery, [secureUrl, tagId]);
            connection.release();

            console.log(result.secure_url);
            res.header('Location', secureUrl);
            return res.status(201).send();
        } catch (e) {
            if (connection) {
                connection.release();
            }
            console.error(e);
            return res.status(500).send(e.message);
        }
    }).end(file.buffer);
  }

  module.exports = uploadImageTag;
