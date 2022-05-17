const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (error, dirEntryList) => {
  if (!error) {
    dirEntryList.forEach((dirEntry) => {
      if (!dirEntry.isDirectory()) {
        const route = path.join(__dirname, 'secret-folder', `${dirEntry.name}`);
        fs.stat(route, (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(
            path.parse(route).name
            + '-' +
            path.extname(route).slice(1)
            + '-' +
            stats.size/1000
            + 'kb'
          );
        });
      }
    });
  } else {
    console.error(error);
  }
});
