const router = require('express').Router()
const notificationRoute = require('./route/notification-routes')
const twilioRoute = require("./route/twilio_route")
const eventRoute = require("./route/event_routes")

router.use('/notification', notificationRoute)
router.use('/twilio', twilioRoute)
router.use('/event', eventRoute)

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "Application running successfully"
    })
})

module.exports = router