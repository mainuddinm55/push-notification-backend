const functions = require('firebase-functions')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')

const router = require('./src/router')
const notificationController = require('./src/controller/notification_controller')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)

const server = http.createServer(app)
const port = process.env.PORT || 3000

// server.listen(port, () => {
//     console.log(`Server is listening on port : ${port}`)
// })

exports.notificationApi = functions.https.onRequest(app)

exports.pushRemoteConfig = functions.remoteConfig.onUpdate(version => {
    return notificationController.sendUpdateRemoteConfigNotification()
})