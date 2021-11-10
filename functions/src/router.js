const router = require('express').Router()
const notificationRoute = require('./route/notification-routes')

router.use('/notification', notificationRoute)

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "Application running succesfully"
    })
})

module.exports = router