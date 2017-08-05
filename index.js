const http = require('http');

const firstName = 'Thomas';
const lastName = 'Edison';

let data = JSON.stringify({
  'firstname': firstName,
  'lastName': lastName
});


let request = http.request('http://netology.tomilomark.ru/api/v1/hash');
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