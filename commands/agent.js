'use strict';

const pkg = require('../package.json');

const fs = require('fs');
const _keys = require('lodash.keys');
const _pick = require('lodash.pick');

const PID_FILE = '/var/run/containership.pid';

module.exports = {

    fetch: (core) => {
        return {
            commands: [
                {
                    name: 'agent',
                    options: core.options,

                    callback: (options) => {
                        fs.writeFile(PID_FILE, process.pid, (err) => {
                            if(err) {
                                process.stderr.write('Error writing PID! Are you running containership as root?\n');
                                process.exit(1);
                            }

                            options.version = pkg.version;
                            options.mode = options.mode;
                            core.scheduler.load_options(_pick(options, _keys(core.scheduler.options)));
                            core.api.load_options(_pick(options, _keys(core.api.options)));
                            core.load_options(options);
                            core.initialize();
                        });
                    }
                }
            ]
        };
    }
};
