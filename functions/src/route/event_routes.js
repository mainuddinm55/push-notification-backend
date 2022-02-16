const router = require('express').Router()
const controller = require('../controller/event_controller')

router.post('/log', controller.logEvent)

module.exports = router