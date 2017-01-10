'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const _merge = require('lodash.merge');

module.exports = {

    load: function() {
        if (!fs.existsSync(`${process.env.HOME}/.containership`)) {
            mkdirp.sync(`${process.env.HOME}/.containership`);
        }

        try {
            this.config = JSON.parse(fs.readFileSync(`${process.env.HOME}/.containership/cli.json`));
        } catch(err) {
            process.stdout.write('Could not load Containership config file. Does it exist?');
            process.exit(1);
        }
    },

    set: function(new_config) {
        let config = {};

        if (!fs.existsSync(`${process.env.HOME}/.containership`)) {
            mkdirp.sync(`${process.env.HOME}/.containership`);
        }

        try {
            config = JSON.parse(fs.readFileSync(`${process.env.HOME}/.containership/cli.json`));
        } catch(err) {
            //process.stderr.write(err.message);
        }

        try {
            _merge(config, new_config);
            fs.writeFileSync(`${process.env.HOME}/.containership/cli.json`, JSON.stringify(config));
            this.config = config;
        } catch(err) {
            process.stdout.write('Could not write Containership config file');
            process.exit(1);
        }
    }
};
