exports.logEvent = (req, res, next) => {
    console.log(`DateTime: ${new Date()}`)
    console.log(`EventName: ${req.body.event_name}`)
    let params = ''
    let properties = ''
    Object.keys(req.body.params).forEach(key => {
        params += `\n${key}: ${req.body.params[key]}`
    })
    Object.keys(req.body.user_properties).forEach(key => {
        params += `\n${key}: ${req.body.user_properties[key]}`
    })

    console.log(`Params: ${params}`)
    console.log(`User properties: ${properties}`)
    res.json(req.body)
}