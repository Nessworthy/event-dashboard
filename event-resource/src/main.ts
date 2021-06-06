import express = require("express");
// import expressWs = require("express-ws");


const PORT: number = 80

const app = express()
// const app = expressWs(baseApp).app


import { bootstrap } from './bootstrap'

async function main() {

    await bootstrap(app, PORT)

}

main()
