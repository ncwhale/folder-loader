const fs = require('fs'),
    path = require('path');

let folder_loader = function (dirname, filename = 'index.js', options = {}) {
    var export_modules = {};

    const filter_regexp = options.filter_regexp || /^[^\.\-_#~]/i,
        ext_regexp = options.ext_regexp || /\.js$/i,
        selfname = path.basename(filename),
        load_function = options.loader || (file => {
            let this_module = require(path.join(dirname, file));

            if (this_module.name) {
                export_modules[this_module.name] = this_module;
            } else {
                export_modules[file] = this_module;
            }
        });

    fs
        .readdirSync(dirname)
        .filter((file) => {
            return (filter_regexp.test(file)) && (file !== selfname) && (ext_regexp.test(file));
        })
        .sort()
        .forEach(load_function);

    return export_modules;
};

module.exports = folder_loader;