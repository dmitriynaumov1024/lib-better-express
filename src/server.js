import fs from "node:fs"
import http from "node:http"
import https from "node:https"
import { createExpress } from "./express.js"
import { createWebSocket } from "./websocket.js"

export function createServer (options) {
    let server = undefined
    let socket = undefined
    let serverOptions = { }
    let express = createExpress()
    if (!express.app) express.app = express
    if (options.https) {
        serverOptions.key = fs.readFileSync(options.key)
        serverOptions.cert = fs.readFileSync(options.cert)
        server = https.createServer(serverOptions, express.app)
    }
    else {
        server = http.createServer(serverOptions, express.app)
    }
    if (options.websocket) {
        socket = createWebSocket(server)
    }
    return {
        server: server,
        http: express,
        socket: socket,
        listen(...args) {
            return server.listen(...args)
        }
    }
}
