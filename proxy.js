var https = require('https');
var http  = require('http');
var urls  = require('url');
var fs    = require('fs');
var disp  = require('./dispatcher');

var httpsopt = {
  cert: fs.readFileSync(__dirname + '/certs/server.passless.crt'),
  key:  fs.readFileSync(__dirname + '/certs/server.passless.key'),
  ca:   fs.readFileSync(__dirname + '/certs/ca.pem')
};

module.exports.listen = function(ip) {
  var httpsProxy = https.createServer(httpsopt, function(request, response) {
    var getopt = urls.parse(request.url, true).query;
    var phrase = getopt.q || '';
    var usersaid = getopt.usersaid || '';

    if (usersaid != '' && phrase != '') {
      var actions = JSON.parse(fs.readFileSync('conf.json')).actions;

      console.log('[+] You said: ' + phrase);

      for(var i = 0; i < actions.length; i++) {
        if (actions[i].keyword == phrase) {
          var res = disp(phrase, actions[i].answer, request.headers, actions[i].exec);
          response.write(res, 'binary');
          response.end();
          return;
        } 
      }
    }

    var optpro = {
      hostname: 'www.bing.com',
      port: 443,
      path: request.url,
      method: request.method,
      headers: request.headers
    };

    var proxy_request = https.request(optpro, function(proxy_response) {
      proxy_response.on('data', function(chunk) {
        response.write(chunk, 'binary');
      });

      proxy_response.on('end', function() {
        response.end();
      });

      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });

    request.on('data', function(chunk) {
      proxy_request.write(chunk, 'binary');
    });

    request.on('end', function() {
      proxy_request.end();
    });

    proxy_request.on('error', function(e) {
      console.log('[-] HTTPS ' + e);
    });
  }).listen(443, ip);

  console.log('[*] HTTPS forwarding listening on ' + ip + ':443');

  var httpProxy = http.createServer(function(request, response) {
    var optpro = {
      hostname: 'www.bing.com',
      port: 80,
      path: request.url,
      method: request.method,
      headers: request.headers
    };

    var proxy_request = http.request(optpro, function(proxy_response) {
      proxy_response.on('data', function(chunk) {
        response.write(chunk, 'binary');
      });

      proxy_response.on('end', function() {
        response.end();
      });

      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });

    request.on('data', function(chunk) {
      proxy_request.write(chunk, 'binary');
    });

    request.on('end', function() {
      proxy_request.end();
    });

    proxy_request.on('error', function(e) {
      console.log('[-] HTTP ' + e);
    });
  }).listen(80, ip);

  console.log('[*] HTTP forwarding listening on ' + ip + ':80');
}
