const http = require('http');
const fs = require('fs');
const url = require('url');

const port = process.env.PORT || 3000;
const base = './';


function checkFile(filename) {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (err, stat) => {
      if (err) return reject(err);
      if (stat.isDirectory()) {
        return resolve(checkFile(filename + 'index.html'));
      }
      if (!stat.isFile()) return reject('Not a file');
      fs.access(filename, fs.R_OK, err => {
        if (err) reject(err);
        resolve(filename);
      })
    });
  });
}

function getHash(firstName, lastName) {
  return new Promise((resolve, reject) => {

    var hash = '';

    let data = JSON.stringify({
      'lastName': encodeURI(lastName)
    });

    let options = {
      host: 'netology.tomilomark.ru',
      port: 80,
      path: '/api/v1/hash',
      method: 'POST',
      headers: {
        'firstname': encodeURI(firstName),
        'Content-Type': 'application/json',
      }
    };

    let request = http.request(options);
    request.write(data);
    request.on('error', err => reject(err));
    request.on('response', response => {
      let answer = '';
      response.on('data', function(chunk) {
        return answer += chunk;
      });
      response.on('end', () => {
        hash = JSON.parse(answer);

        console.log(`Your unique code: ${hash.hash}`);
        resolve(hash.hash);
      });
    });

    request.end();


  })
}

function handler(req, res) {
  const data = url.parse(req.url, true);

  if (data.pathname === '/handler') {
    let dataFirstName = data.query.firstname;
    let dataLastName = data.query.lastname;

    getHash(dataFirstName, dataLastName)
      .then(hash => {
        res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
        res.write(`Your unique code: ${hash}`);
        res.end();
      })
      .catch(err => {
        res.writeHead(418, 'I’m a teapot', { 'Content-Type': 'text/plain' });
        res.write(`Your code isn't generated.`);
        res.end();
      });

  } else {
    checkFile(base + req.url)
      .then(filename => {
        res.writeHead(200, 'OK', { 'Content-Type': 'text/html' });
        fs.createReadStream(filename).pipe(res)
      })
      .catch(err => {
        res.writeHead(404, http.STATUS_CODES[404], { 'Content-Type': 'text/html' });
        res.end('File not found');
      });

  }

}

const server = http.createServer();
server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
  console.log('Start HTTP on port %d', port);
});
server.listen(port);