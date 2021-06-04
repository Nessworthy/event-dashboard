import {Request, Response} from "express";
const crypto = require('crypto')
const express = require('express')

const app = express()

app.post("/token", function(req: Request, res: Response) {
    const expires = new Date()
    expires.setTime(expires.getTime() + 60 * 60 * 24 * 1000)
    res.send(JSON.stringify({
        'access_token': crypto.randomBytes(32).toString('hex'),
        'expires': expires
    }))
    return res
})

app.post("/introspect", function(req: Request, res: Response) {
    if (!req.headers.authorization) {
        res.status(401)
        return res
    }

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

app.listen(80)
