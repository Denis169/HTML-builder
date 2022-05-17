const fs = require('fs');
const path = require('path');
const { stdout } = process;

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), {encoding: 'utf-8'});

readableStream.on('data', data => stdout.write(data));
