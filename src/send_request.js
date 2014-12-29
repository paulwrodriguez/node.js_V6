var auth = require('./auth.js')
var capture = require('./capture.js')
var cancel = require('./cancel.js')
var http = require('http')

//licenseID used in the header
var licenseID = '572d606c967f412cb8d840e38fb48010$$#$$MphfoMed030iGRXOd6pBhDzGQnzEMmz7$$#$$2015-11-26$$#$$dev_key$$#$$SHA512withRSA$$#$$RSA$$#$$1$$#$$52BC72E18D55CC77AE2DE3C27C0AFE6C0FCE3E3E6C1638EE824E5DB7775ADBBB616D82127D46DF9272D6A39ABC6BA8AD6797000A52F769C982B5360C06CED1FFA8FABA0DEA70E1CD77DC4DAF912E81319538857CAABE16DB6C412AF478BC059B29232337AE09020069B96E741982FB5E6BC053E98FE7C33789288CAA6A9883C0D2380DD1812FCF2681A8B31545B97DD0736EB3ECBD9329F144CDB93C35780559DB6219604ADB3F5A8DC57E06CFD715FFCECD3CB65DE7BFDA065D4DB3BDC84B7E0FD66116C71AC41E0B875BA18C742A8ECE9E690AC37457DD43845F5C64EA00BF7B585A6FCF75A0F398026CD79C74C3C946C11BAFD1404997917C5592B91E8415'
var header = {
	'Content-Type': 'application/json',
	'licenseid': licenseID
}
//Get authorization data
var auth_object = auth();
//Turn into a json string
var auth_string = JSON.stringify(auth_object);

//Set options for the http request
var options = {
	hostname: 'apis.cert.vantiv.com',
	port: '80',
	path: '/v1/credit/authorization?sp=1',
	method: 'POST',
	headers: header
}

//Send an auth request followed by a capture request
function send_auth(){
	var req = http.request(options, function(res) {
		
		res.setEncoding('utf-8');
		
		res.on('data', function(data){		
			console.log("Authorize Response: " + data);
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

	console.log('Authorize Request: ' + auth_string);
	req.end(auth_string);
}



//send a capture request provided you have a valid authorization code
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
		res.setEncoding('utf-8');		
		res.on('data', function(data){		
			console.log("Capture Response: " + data);
			//Send a cancel of the capture
			var data_json = JSON.parse(data);
			send_cancel(capt_object, data_json);
		})
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	console.log('Capture Request: ' + capt_string);
	req.end(capt_string);

}


//send a cancel request with the original transaction and it's response as parameters
function send_cancel(trans_request, trans_response){
	var cancel_object = cancel();
	
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
		
		res.setEncoding('utf-8');		
		res.on('data', function(data){		
			console.log("Cancel Response: " + data);			
		})
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	console.log('Cancel Request: ' + cancel_string);
	req.end(cancel_string);

}


//Test it
send_auth();