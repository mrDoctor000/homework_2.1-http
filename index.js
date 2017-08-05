const http = require('http');


let data = JSON.stringify({
  'lastName': 'Edison'
});

let options = {
  host: 'netology.tomilomark.ru',
  port: 80,
  path: '/api/v1/hash',
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
  let answer = '';
  response.on('data', function(chunk) {
    return answer += chunk;
  });
  response.on('end', () => {
    const data = JSON.parse(answer);
    console.log(`Ваш уникальный код: ${data.hash}`);
  });
});

request.end();