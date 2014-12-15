var fs   = require('fs');
var exec = require('child_process').exec;

var colours = ['ffffff', '000000'];

module.exports = function(phrase, ans, headers, cmd) {
  if ('x-bm-theme' in headers)
    colours = headers['x-bm-theme'].split(';');

  console.log('[x] Executing: ' + cmd);
  exec(cmd, function() {});

  return getResponse(ans, colours);
}

function getResponse(ans, colours) {
  var fileres = fs.readFileSync(__dirname + '/views/response.html').toString();
  fileres = fileres.replace(/VAR_PORTANA/g, ans)
                   .replace(/VAR_ENCODED_PORTANA/g, escape(ans))
                   .replace(/BG_COLOR/g, colours[0])
                   .replace(/THEME_COLOR/g, colours[1]);
  return fileres;
}
