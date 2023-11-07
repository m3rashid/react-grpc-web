const { EchoRequest,
	ServerStreamingEchoRequest } = require('./echo_pb.js');
const { EchoServiceClient } = require('./echo_grpc_web_pb.js');
const { EchoApp } = require('../echoapp.js');
const grpc = {};
grpc.web = require('grpc-web');

/** Sample interceptor implementation */
const StreamResponseInterceptor = function () { };

/**
 * @template REQUEST, RESPONSE
 * @param {!Request<REQUEST, RESPONSE>} request
 * @param {function(!Request<REQUEST,RESPONSE>):!ClientReadableStream<RESPONSE>}
 *     invoker
 * @return {!ClientReadableStream<RESPONSE>}
 */
StreamResponseInterceptor.prototype.intercept = function (request, invoker) {
	const InterceptedStream = function (stream) {
		this.stream = stream;
	};
	InterceptedStream.prototype.on = function (eventType, callback) {
		if (eventType == 'data') {
			const newCallback = (response) => {
				response.setMessage('[Intcpt Resp1]' + response.getMessage());
				callback(response);
			};
			this.stream.on(eventType, newCallback);
		} else {
			this.stream.on(eventType, callback);
		}
		return this;
	};
	var reqMsg = request.getRequestMessage();
	reqMsg.setMessage('[Intcpt Req1]' + reqMsg.getMessage());
	return new InterceptedStream(invoker(request));
};

var opts = { 'streamInterceptors': [new StreamResponseInterceptor()] };
var echoService = new EchoServiceClient('http://' + window.location.hostname + ':8080', null,
	null);
//                                      opts);

var echoApp = new EchoApp(
	echoService,
	{
		EchoRequest: EchoRequest,
		ServerStreamingEchoRequest: ServerStreamingEchoRequest
	}
);

echoApp.load();
