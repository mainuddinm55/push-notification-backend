const router = require('express').Router()
const notificationRoute = require('./route/notification-routes')

router.use('/notification', notificationRoute)

router.get('/test', (req, res, next) => {
    res.json({
        message: "Hello world"
    })
})

module.exports = router