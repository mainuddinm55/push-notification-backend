const admin = require('firebase-admin')
const { google } = require('googleapis')
const serviceAccount = require('../../service-account.json')

const request = require('request')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://maya-apa-app-push-notification.firebaseio.com"
})

const scopes = ['https://www.googleapis.com/auth/cloud-platform']
var clientCredential = require('../../fcmdata_client_credentials.json')

var oauth2Client = new google.auth.OAuth2(
    clientCredential.web.client_id,
    clientCredential.web.client_secret,
    // 'http://localhost:5000/maya-apa-app-push-notification/us-central1/notification/notification/google/callback'
    'https://us-central1-maya-apa-app-push-notification.cloudfunctions.net/notification/notification/google/callback'
)

exports.sendNotification = function (req, res, next) {
    const tokens = req.body.fcms
    const dryRun = Boolean(req.body.dryRun || false)
    console.log(`Type of ${Array.isArray(tokens)}`);
    if (!tokens) {
        res.json({
            error: "Please provide fcms"
        })
        return
    }
    const requestData = req.body.data
    const dataMessage = {}
    Object.keys(requestData).forEach(key => {
        var value = requestData[key]
        if (typeof value == 'object') {
            dataMessage[key] = JSON.stringify(value)
        } else {
            dataMessage[key] = value.toString()
        }
    })
    const requestNotification = req.body.notification

    console.log(`Data message: ${dataMessage}`)
    const topicName = "premium_funnel"
    const message = {
        notification: requestNotification,
        data: dataMessage,
        tokens: tokens,
        android: {
            priority: "high",
            ttl: 86400000,
        },
        apns: {
            headers: {
                "apns-priority": "10"
            }
        }
    }
    admin.messaging().sendMulticast(message, dryRun).then(result => {
        console.log(`Send notification success: ${result}`)
        res.json({
            result: result
        })
    }).catch(error => {
        console.log(`Send notification failed: ${error}`);
        res.json({
            error: error
        })
    })
}

exports.getFcmData = function (req, res, next) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'online',
        scope: scopes
    })
    console.log('Authorize this app by visiting this url:', authUrl);
    res.redirect(authUrl)
}

exports.authCallback = function (req, res, next) {
    console.log(`Auth callback`);
    const code = req.query.code
    if (code) {
        oauth2Client.getToken(code, (error, token) => {
            console.log(`Auth callback error: ${error}`);
            if (error) {
                res.json({ error: error })
            } else {
                oauth2Client.setCredentials(token)
                fetchFcmData().then(result => {
                    console.log(`Auth callback Fetch fcm data`);
                    res.json({
                        data: JSON.parse(result)
                    })
                }).catch(error => {
                    console.log(`Auth callback Fetch fcm data error`);
                    res.json({ error: error })
                })
            }
        })
    } else {
        res.json({ error: "Code not found" })
    }
}

exports.auth = function (req, res, next) {
    res.send('<a href="/notification/notification/fcmdata">FCM Messaging Data</a>')
}

function fetchFcmData() {
    return new Promise((resolve, reject) => {
        request.get("https://fcmdata.googleapis.com/v1beta1/projects/maya-apa-app-push-notification/androidApps/1:280487438845:android:2934a38a6b6689de/deliveryData", {
            headers: {
                Authorization: 'Bearer ' + oauth2Client.credentials.access_token
            }
        }, (error, response, body) => {
            console.log(body);
            if (error) {
                reject(error)
            } else if (response.statusCode == 401) {
                var er = JSON.parse(body).error
                reject(JSON.parse(body).error)
            } else {
                resolve(body)
            }
        })
    })
}

exports.sendUpdateRemoteConfigNotification = function sendRCNotification() {
    const message = {
        data: {
            "state": "update"
        },
        topic: "UPDATE_RC",
        android: {
            priority: "high"
        }
    }
    admin.messaging().send(message).then(result => {
        console.log(`Send notification success: ${result}`)
        return true
    }).catch(error => {
        console.log(`Send notification failed: ${error}`);
        return false
    })
}


exports.subscribeTopic = function subscribeTopic(req, res, next) {
    let fcms = req.body.fcms || []
    let topicName = req.body.topic || "push"
    if (fcms.length) {
        admin.messaging().subscribeToTopic(fcms, topicName)
            .then(result => {
                res.status(200).json({
                    data: result
                })
            }).catch(error => {
                res.status(400).json({
                    error: error
                })
            })
    } else {
        res.status(400).json({
            error: "Fcms must at lest one"
        })
    }
}

exports.sendTopicNotification = function sendTopicNotification(req, res, next) {
    const topic = req.body.topic
    const dryRun = Boolean(req.body.dryRun || false)
    console.log(`Topic name : ${topic}`);
    if (!topic) {
        res.json({
            error: "Please provide topic"
        })
        return
    }
    const requestData = req.body.data
    const dataMessage = {}
    Object.keys(requestData).forEach(key => {
        var value = requestData[key]
        if (typeof value == 'object') {
            dataMessage[key] = JSON.stringify(value)
        } else {
            dataMessage[key] = value.toString()
        }
    })
    const requestNotification = req.body.notification

    console.log(`Data message: ${dataMessage}`)
    const message = {
        notification: requestNotification,
        data: dataMessage,
        topic: topic,
        android: {
            priority: "high",
            ttl: 86400000,
        },
        apns: {
            headers: {
                "apns-priority": "10"
            }
        }
    }
    admin.messaging().send(message, dryRun).then(result => {
        console.log(`Send notification success: ${result}`)
        res.json({
            result: result
        })
    }).catch(error => {
        console.log(`Send notification failed: ${error}`);
        res.json({
            error: error
        })
    })
}