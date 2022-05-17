const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (error, dirEntryList) => {
  try {

    const writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

    dirEntryList.forEach((dirEntry) => {
      const route = path.join(__dirname, 'styles', `${dirEntry.name}`);
      if (dirEntry.isFile() && path.extname(route) === '.css') {
        const readableStream = fs.createReadStream(route, {encoding: 'utf-8'});
        readableStream.on('data', data => writeableStream.write(data));
      }
    });

  }
  catch (error) {
    console.error(error);
  }
});
