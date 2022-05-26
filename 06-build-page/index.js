import { promises, createWriteStream, readdir, createReadStream, copyFile } from 'fs';
const fsPromises = promises;
import { join, resolve, extname, relative } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const route = join(__dirname, 'template.html');

(async function () {

  // Create dir 'project-dist'

  await fsPromises.access(join(__dirname, 'project-dist'))
    .then(() => console.log('folder already create'))
    .catch(async () => {
      await fsPromises.mkdir(join(__dirname, 'project-dist'))
        .then(() => console.log('folder create successfully'))
        .catch((error) => console.log(error));
    });

  // Create index.html

  const writeableStream = createWriteStream(resolve(__dirname, 'project-dist', 'index.html'));

  await fsPromises.readFile(route, 'utf-8')
    .then (async (data) => {
      const array = data.toString().split('\n');
      const regExp = new RegExp(/{{[a-z]+}}/gi);

      for (let i = 0; i < array.length; i++) {
        if (regExp.test(array[i].trim())) {
          await fsPromises.readdir(join(__dirname, 'components'), {withFileTypes: true})
            .then(async (dirEntryList) => {
              for (const dirEntry of dirEntryList) {
                if (!dirEntry.isDirectory()) {
                  if (dirEntry.name === array[i].replace(/\W/g, '') + '.html') {
                    const routeComponent = join(__dirname, 'components', `${dirEntry.name}`);

                    await fsPromises.readFile(routeComponent, 'utf-8')
                      .then((data) => writeableStream.write(data + '\n'))
                      .catch((error) => console.log(error));
                  }
                }
              }
            })
            .catch((error) => console.error(error));
        } else {
          writeableStream.write(array[i] + '\n');
        }
      }
    })
    .catch((error) => console.log(error));

  // Create style.css

  readdir(join(__dirname, 'styles'), {withFileTypes: true}, (error, dirEntryList) => {
    try {

      const writeableStreamCss = createWriteStream(join(__dirname, 'project-dist', 'style.css'));

      dirEntryList.forEach((dirEntry) => {
        const route = join(__dirname, 'styles', `${dirEntry.name}`);
        if (dirEntry.isFile() && extname(route) === '.css') {
          const readableStream = createReadStream(route, {encoding: 'utf-8'});
          readableStream.on('data', data => writeableStreamCss.write(data));
        }
      });

    }
    catch (error) {
      console.error(error);
    }
  });

  //Copy directory

  async function copyFiles(dirEntryList, route) {
    for (const dirEntry of dirEntryList) {
      if (dirEntry.isDirectory()) {
        const routeNew = join(route, dirEntry.name);
        let routeIn = routeNew.replace('/project-dist', '');
        await fsPromises.access(routeNew)
          .then(async () => {
            await fsPromises.readdir(routeIn, {withFileTypes: true})
              .then(async (dirEntryList) => await copyFiles(dirEntryList, routeNew))
              .catch((error) => console.log(error));
          })
          .catch(async () => {
            await fsPromises.mkdir(routeNew)
              .then(async () => {
                console.log(`create folder ${dirEntry.name}`);
                await fsPromises.readdir(routeIn, {withFileTypes: true})
                  .then(async (dirEntryList) => await copyFiles(dirEntryList, routeNew))
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          });
      } else {
        const routeIn = join(route, dirEntry.name).replace('/project-dist', '');
        const routeOut = join(route, dirEntry.name);
        copyFile(routeIn, routeOut, (err) => {
          if (err) {
            console.error('Cannot copy ' +dirEntry.name+ ' into ' +routeOut+ ' - error: ', err);
            return;
          }
          const routeDescribeIn = relative(route, routeIn);
          const routeDescribeOut = relative(routeIn, routeOut);
          console.log('FILE: Placed ' +routeDescribeIn+ ' into ' +routeDescribeOut+ '.');
        });
      }
    }
  }

  await fsPromises.readdir(join(__dirname, 'assets'), {withFileTypes: true})
    .then(async (dirEntryList) => {
      let route = join(__dirname, 'project-dist', 'assets');
      await fsPromises.access(join(route))
        .then(() => console.log('assets already create'))
        .catch(async () => {
          await fsPromises.mkdir(join(route))
            .then(() => console.log('folder assets create successfully'))
            .catch((error) => console.log(error));
        });

      await copyFiles(dirEntryList, route);
    })
    .catch((error) => console.log(error));


})();


