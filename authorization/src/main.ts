import {Request, Response} from 'express';
const crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/token', function(req: Request, res: Response) {

    let scopes = []

    console.log("Request received for a new access token!")

    if (req.body) {
        if (Array.isArray(req.body.scope)) {
            scopes = req.body.scope
        } else if (typeof req.body.scope === "string") {
            scopes = [req.body.scope]
        }
    }

    res.send(JSON.stringify({
        access_token: crypto.randomBytes(32).toString('hex'),
        refresh_token: crypto.randomBytes(32).toString('hex'),
        expires_in: 60 * 60 * 24,
        token_type: 'bearer',
        scope: scopes
    }))
    return res
})

app.post('/introspect', function(req: Request, res: Response) {
    if (!req.headers.authorization) {
        res.status(401)
        return res
    }

    console.debug('Token introspection request received')

    const tokenParts = req.headers.authorization.split(' ')
    if (tokenParts.length !== 2) {
        res.status(401)
        return res
    }

    if (tokenParts[0] !== "Bearer") {
        res.status(401)
        return res
    }

    if (tokenParts[1].length !== 32) {
        res.status(401)
        return res
    }

    res.json({
        "active": true
    })
});

app.listen(80, () => {
    console.info("Authorization server is up and running!")
})
