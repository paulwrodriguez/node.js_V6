/*
Copyright (c) 2014 Vantiv, Inc. - All Rights Reserved.

Sample Code is for reference only and is solely intended to be used for educational purposes and is provided “AS IS” and “AS AVAILABLE” and without 
warranty. It is the responsibility of the developer to  develop and write its own code before successfully certifying their solution.  

This sample may not, in whole or in part, be copied, photocopied, reproduced, translated, or reduced to any electronic medium or machine-readable 
form without prior consent, in writing, from Vantiv, Inc.

Use, duplication or disclosure by the U.S. Government is subject to restrictions set forth in an executed license agreement and in subparagraph (c)(1) 
of the Commercial Computer Software-Restricted Rights Clause at FAR 52.227-19; subparagraph (c)(1)(ii) of the Rights in Technical Data and Computer 
Software clause at DFARS 252.227-7013, subparagraph (d) of the Commercial Computer Software--Licensing clause at NASA FAR supplement 16-52.227-86; 
or their equivalent.

Information in this sample code is subject to change without notice and does not represent a commitment on the part of Vantiv, Inc.  In addition to 
the foregoing, the Sample Code is subject to the terms and conditions set forth in the Vantiv Terms and Conditions of Use (http://www.apideveloper.vantiv.com) 
and the Vantiv Privacy Notice (http://www.vantiv.com/Privacy-Notice).  
*/

var auth = require('./auth.js')
var capture = require('./capture.js')
var cancel = require('./cancel.js')
var http = require('http')

//licenseID used in the header. You will need to obtain a LicenseId before running this sample. 
var licenseID = ''
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