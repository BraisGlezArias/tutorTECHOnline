'use strict';

async function checkRoleUser (req, res, next) {

    const { role } = req.claims;

        if (role !== "Admin") {
            return res.status(403).send()
    }   

    next();
}

module.exports = checkRoleUser;