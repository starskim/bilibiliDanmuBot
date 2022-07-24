const db = require('./db')

const saveAllEvent = async (message) => {
    await new db.test({
        info: message
    }).save()
}

module.exports = {
    saveAllEvent
}