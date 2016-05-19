'use strict';
const fs = require('fs'),
    path = require('path');

let folder_loader = function (dirname, filename = 'index.js', options = {}) {
    var export_modules = {};

    const filter_regexp = options.filter_regexp || /^[^\.\-_#~]/i,
        ext_regexp = options.ext_regexp || /\.js$/i,
        export_folder = options.hasOwnProperty('subfolder') ? options.subfolder : true,
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
            if ((filter_regexp.test(file)) && (file !== selfname)) {
                let file_stat = fs.statSync(path.join(dirname, file));

                if (file_stat.isDirectory()) {
                    return export_folder;
                } else if (file_stat.isFile()) {
                    return ext_regexp.test(file);
                }
            }

            return false;
        })
        .sort()
        .forEach(load_function);

    return export_modules;
};

let folder_loader_iter = function* (dirname, filename = 'index.js', options = {}) {
    const filter_regexp = options.filter_regexp || /^[^\.\-_#~]/i,
        ext_regexp = options.ext_regexp || /\.js$/i,
        export_folder = options.hasOwnProperty('subfolder') ? options.subfolder : true,
        selfname = path.basename(filename),
        load_function = options.loader || (file => {
            return require(path.join(dirname, file));
        });

    let files = fs.readdirSync(dirname)
        .filter((file) => {
            if ((filter_regexp.test(file)) && (file !== selfname)) {
                let file_stat = fs.statSync(path.join(dirname, file));

                if (file_stat.isDirectory()) {
                    return export_folder;
                } else if (file_stat.isFile()) {
                    return ext_regexp.test(file);
                }
            }

            return false;
        })
        .sort();

    for (let file of files) {
        yield load_function(file);
    }
};

module.exports = folder_loader;
module.exports.iterator = folder_loader_iter;