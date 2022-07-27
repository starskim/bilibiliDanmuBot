// noinspection JSUnusedGlobalSymbols

'use strict';

const color = require('colors')
const config = require('./config')
const develop = config.get('develop')


function getFormatTime() {
    let date = new Date();
    return (date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') +
        '-' + String(date.getDate()).padStart(2, '0') + ' ' + String(date.getHours()).padStart(2, '0') +
        ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0') +
        '.' + date.getMilliseconds());
}

module.exports = {
    debug(...args) {
        if (develop.debug === false) {
            return
        }
        console.log(color.green('[DEBUG]' + '[' + getFormatTime() + ']: '), ...args);
    },
    info(...args) {
        console.log(color.magenta('[INFO]') + '[' + getFormatTime() + ']:', ...args);
    },
    warn(...args) {
        console.error(color.yellow('[WARN]' + '[' + getFormatTime() + ']:'), ...args, new Error().stack);
    },
    error(...args) {
        console.error(color.red('[ERROR]' + '[' + getFormatTime() + ']:'), ...args, new Error().stack);
    }
}