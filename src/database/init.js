const mongoose = require('mongoose')


const connectToDatabase = async (url) => {
    try {
        // noinspection JSUnresolvedFunction
        await mongoose.connect(url, {
            bufferCommands: false,
            useUnifiedTopology:true
        })
        return {status: true, message: `连接到数据库成功`}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

module.exports = {
    connectToDatabase
}