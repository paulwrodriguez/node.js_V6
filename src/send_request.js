var auth = require('./auth.js')
var capture = require('./capture.js')
var cancel = require('./cancel.js')
var http = require('http')

//API KEY used in the header
var apikey = '4pQQpyKdAbDTGZvGU5Rh2QdWXzqMfgJh'
var header = {
	'Content-Type': 'application/json',
	'apikey': apikey
}
//Get authorization data
var auth_object = auth();
//Turn into a json string
var auth_string = JSON.stringify(auth_object);

//Set options for the http request
var options = {
	hostname: 'vantiv-nonprod-dev.apigee.net',
	port: '80',
	path: '/v1/credit/authorization?sp=1',
	method: 'POST',
	headers: header
}

//Send an auth request followed by a capture request
function send_auth(){
	var req = http.request(options, function(res) {
		console.log('Response Status: ' + res.statusCode);	
		console.log('Response Headers: ' + JSON.stringify(res.headers));
		res.setEncoding('utf-8');
		
		res.on('data', function(data){		
			console.log("Response: " + data);
			var j = JSON.parse(data);
			//If the response has an authorization code and reference number, then lets send a capture
			if(j.AuthorizeResponse.AuthorizationCode && j.AuthorizeResponse.ReferenceNumber){
				//call a capture
				var authCode = j.AuthorizeResponse.AuthorizationCode;
				var refNum = j.AuthorizeResponse.ReferenceNumber;
				send_capture(authCode, refNum);
			}
		})
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	console.log('Request Body: ' + auth_string);
	req.end(auth_string);
}

//get the capture object


//send a capture request provided you have a valid authorization code and reference number
//Follow this up by a cancel of the capture.
function send_capture(auth_code, ref_num){
	var capt_object = capture();
	//set the path to point to the correct proxy
	options.path = '/v1/credit/authorizationcompletion?sp=1';
	//add the auth code and reference number to the capture object
	capt_object.transaction.AuthorizationCode = auth_code;
	capt_object.transaction.OriginalReferenceNumber = ref_num;
	//stringify the object
	var capt_string = JSON.stringify(capt_object);
	var req = http.request(options, function(res) {
		console.log('Response Status: ' + res.statusCode);
		console.log('Response Headers: ' + JSON.stringify(res.headers));
		res.setEncoding('utf-8');		
		res.on('data', function(data){		
			console.log("Response: " + data);
			//Send a cancel of the capture
			var data_json = JSON.parse(data);
			send_cancel(capt_object, data_json);
		})
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	console.log('Request Body: ' + capt_string);
	req.end(capt_string);

}


//send a cancel request with the original transaction and it's response as parameters
function send_cancel(trans_request, trans_response){
	var cancel_object = cancel();
	console.log("HERE ---- " + trans_response.toString());
	//set the path to point to the correct proxy
	options.path = '/v1/credit/reversal?sp=1';
/* 	The cancel request must have values from the response of the transaction that is going to be cancelled and also 
	the original transaction. The fields that must be updated are: OriginalAuthCode OriginalReferenceNumber 
	OriginalTransactionTimestamp OriginalAuthorizedAmount and CancelType */
	cancel_object.transaction.OriginalAuthCode = trans_response.AuthorizationCompletionResponse.AuthorizationCode;
	cancel_object.transaction.OriginalReferenceNumber = trans_response.AuthorizationCompletionResponse.ReferenceNumber;
	cancel_object.transaction.OriginalTransactionTimestamp = trans_response.AuthorizationCompletionResponse.TransactionTimestamp;	
	cancel_object.transaction.OriginalAuthorizedAmount = trans_request.transaction.OriginalAuthorizedAmount;
	cancel_object.transaction.CancelType = 'capture';
	//stringify the object
	var cancel_string = JSON.stringify(cancel_object);
	var req = http.request(options, function(res) {
		console.log('Response Status: ' + res.statusCode);
		console.log('Response Headers: ' + JSON.stringify(res.headers));
		res.setEncoding('utf-8');		
		res.on('data', function(data){		
			console.log("Response: " + data);			
		})
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	console.log('Request Body: ' + cancel_string);
	req.end(cancel_string);

}


//Test it
send_auth();