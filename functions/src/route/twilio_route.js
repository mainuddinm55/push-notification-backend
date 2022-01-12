require('dotenv').config()
const router = require('express').Router()
const twilioController = require("../controller/twilio_controller")

router.post('/create-room', twilioController.createRoom)
router.get('/', twilioController.getRooms)
router.get('/:id', twilioController.getRoom)
// router.get('/key/generate', twilioController.generateApiKey)
router.get('/room/access-token',twilioController.getToken)
module.exports = router