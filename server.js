var connect = require('connect');
var serveStatic = require('serve-static');
var port = 9090;
connect().use(serveStatic(__dirname)).listen(port);
console.log("Now serving sdkinstall content on localhost:" + port + "\n\nClose this window to terminate the process");