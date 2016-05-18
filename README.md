# folder-loader
Load node modules from folder, acts as they are one module.

# Example

Place `index.js` like this in the folder you want to export as a module:

```Javascript
const loader = require('folder-loader');

module.exports = loader(__dirname, __filename);
```

the code above will exports every file/folder in this dir as an object with filename as key.

if you are exports sequelize module:

```Javascript
const loader = require('folder-loader'),
    Sequelize = require('sequelize'),
    debug = require('debug')('models::index'),
    config = require('config'); // Add your real config file here.
    
let sequelize = Sequelize(config),
    db = {};

loader(__dirname, __filename, {
    loader: ( file => {
        try {
            let model = sequelize['import'](path.join(__dirname, file));
            db[model.name] = model;
            debug("Import model " + model.name + " success.");
        }
        catch (error) {
            debug("Import model file: " + file + " error: " + error);
        }
    })
});

for (let modelName in db) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```
# Reference

`loader(dirname, filename, options)`

Param | Type | Description
----- | ---- |:----
dirname | String | folder to load.
filename | String | file call this function.(to avoid stack overflow call loop).
options.filter_regexp | Regexp | test if need to load this module file.( Default: `/^[^\.\-_#~]/i` to avoid EMACS temp file. )
options.ext_regexp | Regexp | test the file ext. Default: `/\.js$/i`
options.loader | function | function used to load modules. sign as (file => {})

# Tips

All the regexp will only use `.test` function, so you can create an object with test function to acts as regexp.