'use strict';

const config = require('../lib/config');
const utils = require('../lib/utils');

const _forEach = require('lodash.foreach');
const _isEmpty = require('lodash.isempty');
const _omit = require('lodash.omit');


module.exports = {

    fetch: (/*core*/) => {
        return {
            commands: [
                {
                    name: 'configure',
                    options: {
                        'api-url': {
                            help: 'address of the Containership API'
                        },

                        'api-version': {
                            help: 'version of the Containership API'
                        },

                        'plugin-location': {
                            help: 'location of CLI plugins'
                        },

                        'strict-ssl': {
                            flag: true,
                            help: 'enforce strict ssl checking'
                        }
                    },

                    callback: (options) => {
                        options = _omit(options, ['_', '0']);
                        if(_isEmpty(options)) {
                            _forEach(_omit(config.config, 'middleware'), (value, key) => {
                                utils.println([ ['%-20s', key], ['%-100s', JSON.stringify(value, null, 2)] ]);
                            });
                        } else {
                            config.set(options);
                            _forEach(config.config, (value, key) => {
                                utils.println([ ['%-20s', key], ['%-100s', JSON.stringify(value, null, 2)] ]);
                            });
                        }
                    }
                }
            ]
        };
    }

};
