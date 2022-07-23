const {connectToDatabase} = require("./src/database/init");
const config = require('./src/local/config')


const main = async () => {
    await connectToDatabase(config.get('database.mongoDB'))
    require('./src/socket/server')
}

main().then()