var http = require('http');
var fs   = require('fs');

module.exports.listen = function(port, ip) {
  var certServer = http.createServer(function (req, res) {
    var filename = __dirname + '/certs/ca.cer';
    fs.readFile(filename, 'binary', function(err, file) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('CortanaProxy CA server error: ' + err);
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'application/x-x509-ca-cert'});
        res.write(file, 'binary');
        res.end();
      }
    });
  }).listen(port, ip);

  console.log('[*] CA server listening on ' + ip + ':' + port);
}
