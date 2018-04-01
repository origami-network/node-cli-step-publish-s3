const path = require('path');
const fs = require('fs');

const fixPath = require('./fix-path')

const directoryItems = (directory, onError) =>
    (map) => {
        fs.readdir(directory, (error, items) => {
            if (error) {
                onError(error);
                return;
            }

            items
                .map(item => path.join(directory, item))
                .forEach(item => map(item, () => directoryItems(item, error)(map) ));
        });
    }

const onlyFiles = (directoryItem, onRecurse, onError) =>
    (map) => {
        fs.stat(directoryItem, (error, stat) => {
            if (error) {
                onError(error);
                return;
            }

            if (stat.isDirectory()) {
                (onRecurse || (() => {}))();
                return;
            }

            map(directoryItem);
        });
    }

const fileData = (file, onError) =>
    (map) => {
        fs.readFile(file, function (error, data) {
            if (error) {
                onError(error);
                return;
            }

            map(data);
        });
    }

module.exports = (basePath, onError) =>     
    (map) => {
        directoryItems(basePath, onError)(
            (item, recurse) => onlyFiles(item, recurse, onError)(
                item => fileData(item, onError)(
                    data => map({
                        file: fixPath(path.relative(basePath, item), path.sep),
                        data: data
                    })
                )
            )
        )
    }
