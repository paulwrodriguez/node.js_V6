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

//Set all the values here
var merchant = {
	NetworkRouting : '2J',
	CashierNumber : '12345678',
	LaneNumber : '123',
	DivisionNumber : '000',
	ChainCode : '70110',
	StoreNumber : '00000001',
	MerchantID : '4445012916098'
}

var terminal = {
	TerminalID : '1',
	EntryMode : 'manual',
	Ipv4Address : '192.0.2.235',
	TerminalEnvironmentalCode : 'electronic_cash_register',
	PinEntry : 'none',
	BalanceInquiry : 'false',
	HostAdjustment : 'false',
	DeviceType : 'Terminal',
	CardInputCode : 'ManualKeyed',
	
}

var transaction = {
	TransactionID : '123456',
	MarketCode : 'present',
	TransactionTimestamp :  new Date().toISOString(),
	ClerkNumber: '1234',
	PaymentType : 'single',
	ReferenceNumber : '100001',
	DraftLocatorID : '100000001',
	AuthorizationCode: '',
	OriginalAuthorizedAmount: '10.00',
	CaptureAmount : '10.00',
	OriginalReferenceNumber: '',
	TokenRequested : 'false',
	SystemTraceID : '100002',
	PartialApprovalCode: 'not_supported'
}

var address = {
	BillingZipcode : '33606',
}

var card = {
	CardType: 'visa',
	CardNumber: '4445222299990007',
	ExpirationMonth: '12',
	ExpirationYear:'2017',
	CVV: '382',
	
}

var authorize = {
	merchant: merchant,
	terminal: terminal,
	transaction: transaction,
	address: address,
	card: card
}


function getCapture(){
	return authorize
}

//console.log(transaction.TransactionTimestamp);
module.exports = getCapture;

