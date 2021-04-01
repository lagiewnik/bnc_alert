const fs = require('fs');
const util = require('util');

exports.readPair = (path) => {
    const fileContent = fs.readFileSync(path);
    const array = JSON.parse(fileContent);
    return array;
}

exports.createMockData = (mockFileName, content) => {
    fs.writeFile(mockFileName, JSON.stringify(content, null, 2), function (err) {
        if (err) {
            return console.log(err);
        }
    });
}