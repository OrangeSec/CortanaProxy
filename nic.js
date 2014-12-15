var readlineSync = require('readline-sync');
var os           = require('os');

module.exports.IPs = function() {
  var networkInterfaces = os.networkInterfaces();
  var cortanalocalIP = [];
  var nics = [];
  var ips = [];
  var n = 0;

  Object.keys(networkInterfaces).forEach(function(nic) {
    for(var s = 0; s < networkInterfaces[nic].length; s++) {
      if (!networkInterfaces[nic][s].internal && networkInterfaces[nic][s].family == 'IPv4') {
        ips[n] = networkInterfaces[nic][s].address;
        nics[n] = nic;
        n++;
      }
    }
  });

  if (n > 1) {
    console.log('Interfaces: ')
    for(var i = 0; i < n; i++) {
      console.log('(' + i + ') ' + nics[i] + ' ' + ips[i]);
    }
    console.log('(' + i + ') All');

    var input;
    do {
      input = readlineSync.question('Choose one interface: ');
    } while(input > n || input < 0);

    if (input == n)
      cortanalocalIP = ips;
    else
      cortanalocalIP.push(ips[input]);
  } else {
    cortanalocalIP.push(ips[0]);
  }

  return cortanalocalIP;
}
