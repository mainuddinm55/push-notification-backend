const router = require('express').Router()
const controller = require('../controller/notification_controller')

router.post('/send', controller.sendNotification)

router.post('/send-topic-notification', controller.sendTopicNotification)

router.get('/fcmdata', controller.getFcmData)

router.get('/google/callback', controller.authCallback)

router.get('/', controller.auth)

router.post('/subscribe-topic', controller.subscribeTopic)

module.exports = router