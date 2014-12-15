var dnsd = require('dnsd');
var dns  = require('dns');

var ttl = 36000;

module.exports.listen = function(ips, ip) {
  dnsd.createServer(function(req, res) {
    if (req.question[0].name == 'www.bing.com') {
      for (var i = 0; i < ips.length; i++) {
        res.answer.push({ name: 'www.bing.com', type: 'A', data: ips[i], 'ttl': ttl });
      }

      res.end();
    } else {
      dns.resolve(req.question[0].name, function(err, addresses) {
        if (addresses) {
          var question = res.question[0],
              hostname = question.name,
              length = hostname.length;
            
          for (var i = 0; i < addresses.length; i++) {
            res.answer.push({ name: hostname, type: 'A', data: addresses[i], 'ttl': ttl });
          }
        }
        res.end();
      });
    }
  }).listen(53, ip);

  console.log('[*] DNS server listening on ' + ip + ':53');
  console.log('[*] DNS www.bing.com -> ' + ips);
}
