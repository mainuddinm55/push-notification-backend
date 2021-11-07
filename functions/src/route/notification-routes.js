const router = require('express').Router()
const controller = require('../controller/notification_controller')

router.post('/', controller.sendNotification)

router.get('/fcmdata', controller.getFcmData)

router.get('/google/callback',controller.authCallback)
router.get('/',controller.auth)

module.exports = router