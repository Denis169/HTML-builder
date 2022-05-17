const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');

stdout.write('Введите текст?\n');

let writeableStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

stdin.on('data', data => {
  if (data.toString().toLowerCase().trim() === 'exit') {
    stdout.write('  Good bye  ');
    process.exit();
  } else {
    writeableStream.write(data);
  }
});

process.on('SIGINT', () => {
  stdout.write('  Good bye  ');
  process.exit();
});
