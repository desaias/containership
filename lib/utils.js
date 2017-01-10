const _flatten = require('lodash.flatten');
const _forEach = require('lodash.foreach');
const _has = require('lodash.has');
const _includes = require('lodash.includes');
const _isEmpty = require('lodash.isempty');
const _isUndefined = require('lodash.isundefined');
const _map = require('lodash.map');
const _zip = require('lodash.zip');
const _zipObject = require('lodash.zipobject');
const sprintf = require('sprintf-js').sprintf;

module.exports = {

    println: (formatting) => {
        if(_isUndefined(formatting)) {
            process.stdout.write('\n');
        } else {
            const args = _zip(formatting);

            const formatted = sprintf.apply(this,
                _flatten([
                    args[0].join(' '),
                    args[1]
                ])
            );

            process.stdout.write(`${formatted}\n`);
        }
    },

    parse_env_vars: (core) => {
        const argv = process.argv;

        _forEach(process.env, (value, name) => {
            if(name.indexOf('CS_') === 0) {
                name = name.substring(3, name.length).replace(/_/g, '-').toLowerCase();
                const flag = `--${name}`;

                if(!_includes(process.argv, flag)) {
                    if(_has(core.options, name)) {
                        if(core.options[name].list) {
                            value = value.split(',');
                        } else {
                            value = [value];
                        }

                        _forEach(value, (v) => {
                            argv.push(flag);
                            argv.push(v);
                        });
                    } else if(_has(core.scheduler.options, name)) {
                        if(core.scheduler.options[name].list) {
                            value = value.split(',');
                        } else {
                            value = [value];
                        }

                        _forEach(value, (v) => {
                            argv.push(flag);
                            argv.push(v);
                        });
                    } else if(_has(core.api.options, name)) {
                        if(core.api.options[name].list) {
                            value = value.split(',');
                        } else {
                            value = [value];
                        }

                        _forEach(value, (v) => {
                            argv.push(flag);
                            argv.push(v);
                        });
                    }
                }
            }
        });

        return argv.slice(2);
    },

    parse_volumes: (volumes) => {
        return _map(volumes, (volume) => {
            const parts = volume.split(':');

            volume = {
                container: 1 === parts.length ? parts[0] : parts[1]
            };

            if(1 < parts.length) {
                if(!_isEmpty(parts[0])) {
                    volume.host = parts[0];
                }

                // ex: /host/path:/container/path:{propogationType}
                if(3 === parts.length) {
                    volume.propogation = parts[2];
                }
            }

            return volume;
        });
    },

    parse_tags: (tags) => {
        tags = _map(tags, (tag) => {
            const idx = tag.indexOf('=');
            return [ tag.substring(0, idx), tag.substring(idx + 1, tag.length) ];
        });

        return _zipObject(tags);
    },

    stringify_tags: (tags) => {
        tags = _map(tags, (val, key) => {
            return [key, val].join('=');
        });

        if(!_isEmpty(tags)) {
            return tags.join(', ');
        } else {
            return '-';
        }
    }

};
