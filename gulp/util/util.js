/* eslint-disable */
var _ = require('lodash'),
    fs = require('fs');

_.mixin({
    runCallback: function(done) {
        return function(err) {
            if (!err) {
                done();
            }
        };
    },

    loadJson: function(filepath) {
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    },

    saveJson: function(filepath, json) {
        fs.writeFileSync(filepath, JSON.stringify(json, null, '  '));
    },

    updateJson: function(path, callback) {
        var json = _.loadJson(path);
        json = callback(json);
        _.saveJson(path, json);
    }
});

module.exports = _;
/* eslint-enable */