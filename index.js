const http = require('http');


let data = JSON.stringify({
  'firstname': 'Thomas',
  'lastName': 'Edison'
});

let options = {
  port: 80,
  path: 'http://netology.tomilomark.ru/api/v1/hash',
  method: 'POST',
  headers: {
    'firstname': 'Thomas',
    'Content-Type': 'application/json',
  }
};

let request = http.request(options);
request.write(data);
request.on('error', err => console.error(err));
request.on('response', response => {
  let answer;
  response.on('data', chunk => answer += chunk);
  response.on('end', () => {
    const data = JSON.parse(answer);
    console.log(data);
  });
});

request.end();