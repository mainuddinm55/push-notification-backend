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

exports.notification = functions.https.onRequest(app)

exports.pushRemoteConfig = functions.remoteConfig.onUpdate(version => {
    return notificationController.sendUpdateRemoteConfigNotification()
})