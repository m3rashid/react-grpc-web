const { EchoRequest, EchoResponse } = require('../node-server/proto/hello_pb.js');
const { EchoServiceClient } = require('./proto/hello_grpc_web_pb.js');

var echoService = new EchoServiceClient('http://localhost:8080');

var request = new EchoRequest();
request.setMessage('Hello World!');

echoService.echo(request, {}, function (err, response) {
	// ...
	console.log("route hit")
	console.log(response.getMessage());
});
