import express from "express"

// error catcher
export function errorCatcher (loggerFactoryFunc) {
    return async function (error, request, response, next) {
        let logger = (loggerFactoryFunc instanceof Function)? loggerFactoryFunc() : null
        if (logger) logger.error("Something went wrong:\n    "+error.stack) 
        return response.status(500).json({
            success: false,
            serverError: true
        })
    }
}

// allow client browsers to do cross-origin requests
export function crossOrigin ({ origins, methods, headers }) {
    headers ??= "*"
    if (headers instanceof Array) headers = headers.join(", ")
    methods ??= ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]
    if (methods instanceof Array) methods = methods.join(", ")
    return async function (request, response, next) {
        let allowed = false
        let reqOrigin = request.get("origin")
        if (origins instanceof RegExp) allowed = origins.test(reqOrigin)
        else if (origins instanceof Array) allowed = origins.find(r => r == reqOrigin)
        else if (origins == "*") allowed = true
        if (allowed) {
            response.header("Access-Control-Allow-Origin", reqOrigin)
            response.header("Access-Control-Allow-Headers", headers)
            response.header("Access-Control-Expose-Headers", headers)
            response.header("Access-Control-Allow-Methods", methods)
        }
        await next()
    }
}

// static file serving
export function staticServer (...options) {
    return express.static(...options)
}

// various body parsers provided by express
export const bodyParser = {
    json (options) {
        return express.json(options)
    },
    text (options) {
        return express.text(options)
    },
    urlencoded (options) {
        return express.urlencoded(options)
    },
    raw (options) {
        return express.raw(options)
    }
}
