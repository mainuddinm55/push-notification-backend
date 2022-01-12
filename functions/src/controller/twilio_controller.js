const twilio = require("twilio")
const AccessToken = twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
const accountSid = process.env.TWILIO_ACCOUNT_SID
const accountAuth = process.env.TWILIO_ACCOUNT_AUTH
const apiKey = process.env.TWILIO_API_KEY
const apiSecret = process.env.TWILIO_API_SECRET

const client = twilio(accountSid, accountAuth)

exports.createRoom = function (req, res, next) {
    const roomName = req.body.room_name || ''
    const type = req.body.type || 'go'
    client.video.rooms(roomName)
        .fetch()
        .then(room => {
            res.status(200).json(room)
        })
        .catch(error => {
            console.log(error)
            client.video.rooms.create({
                uniqueName: roomName,
                type: type,
                recordParticipantsOnConnect: false
            }).then(result => {
                res.status(200).json(result)
            }).catch(error => {
                res.status(422).json({
                    error: error
                })
            })
        })

}

exports.getRooms = function (req, res, next) {
    const room = req.query.room
    const status = req.query.status || 'completed'
    client.video.rooms.list({status: status, limit: 40, uniqueName: room})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(400).json({error: error})
        })
}

exports.getRoom = function (req, res, next) {
    const id = req.params.id
    console.log(id)
    client.video.rooms(id).fetch()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(400).json({error: error})
        })
}

exports.getToken = function (req, res, next) {
    const room = req.query.room
    const identity = req.query.identity
    if (room && identity) {
        const videoGrant = new VideoGrant({
            room: room,
        })
        const token = new AccessToken(accountSid, apiKey, apiSecret, {
            identity: identity
        })
        token.addGrant(videoGrant)
        console.log(videoGrant)
        console.log(token)
        res.status(200).json({
            token: token.toJwt(),
            identity: identity
        })
    } else {
        res.status(400).json({error: "Room and identity are required"})
    }
}

exports.generateApiKey = function (req, res, next) {
    const name = req.query.name || "OwnAPIKey"
    console.log(name)
    client.newKeys.create({friendlyName: name})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(400).json({error: error})
        })
}
