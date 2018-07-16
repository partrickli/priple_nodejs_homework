/*
 * Homework Assignment 01
 * REST API
 *
 *
 */

const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder


let port = 2018

// Create http server
var server = http.createServer((req, res) => {
    // Parse URL
    let parsedUrl = url.parse(req.url, true)
    // Get trimmed path
    let trimmedPath = parsedUrl.path.replace(/^\/+|\/+$/g, '')
    // Get the method
    let method = req.method.toLocaleLowerCase()
    // Get payload
    let stringDecoder = new StringDecoder('utf-8')
    let buffer = ''
    // On request data event
    req.on('data', data => {
        buffer += stringDecoder.write(data)
    })
    // On request end event
    req.on('end', () => {
        buffer += stringDecoder.end()
        // Choose the handler the request should go to
        let choosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound
        // Data
        let data = {
            path: trimmedPath,
            method: method,
            payload: buffer,
        }
        choosenHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200
            payload = typeof (payload) == 'object' ? payload : {}
            let payloadString = JSON.stringify(payload)
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)
            console.log('status code: ' + statusCode + 'payload: ' + payloadString)
        })
    })
})

//  Start server
server.listen(port, () => {
    console.log(`http server listening on port: ${port}`)
})

// Define handlers
var handlers = {}

handlers.hello = (data, callback) => {
    // Call back a http code, and a payload object
    if (data.method == "post") {
        callback(200, {
            "welcome": "partrik learning nodejs on pirple now!"
        })
    } else {
        callback(404)
    }
}

handlers.notFound = (data, callback) => {
    callback(404)
}

// Define Router
var router = {
    'hello': handlers.hello,
}