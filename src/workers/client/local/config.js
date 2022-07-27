'use strict';
const Conf = require('conf');
const {resolve} = require('path');
const PATH = resolve('.');

const config = new Conf({
    cwd: PATH,
    configName: 'config.json',
    fileExtension: '',
});

module.exports = config;