exports.logEvent = (req, res, next) => {
    console.log(`DateTime: ${new Date()}`)
    console.log(`EventName: ${req.body.event_name}`)
    console.log(`Params: `+JSON.stringify(req.body.params))
    console.log(`UserProperties: `+JSON.stringify(req.body.user_properties))
    res.json(req.body)
}