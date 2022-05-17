const fs = require('fs');
const path = require('path');

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

function copyFiles(dirEntryList) {
  dirEntryList.forEach((dirEntry) => {
    const routeIn = path.join(__dirname, 'files', `${dirEntry.name}`);
    const routeOut = path.join(__dirname, 'files-copy', `${dirEntry.name}`);
    fs.copyFile(routeIn, routeOut, callback);
  });
}

fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true}, (error, dirEntryList) => {
  try {

    fs.access(path.join(__dirname, 'files-copy'), function(error){
      if (error) {
        fs.mkdir(path.join(__dirname, 'files-copy'), err => {
          if(err) throw err;
          console.log('folder create successfully');
          copyFiles(dirEntryList);
        });
      } else {
        copyFiles(dirEntryList);
      }
    });

  }
  catch (error) {
    console.error(error);
  }
});


