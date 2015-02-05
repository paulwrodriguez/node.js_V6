//Set all the values here
var credentials = {
	AccountID : 's.MID5.PAY.WS.NP',
	Password : 'Tu2u2AHU'
}

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
	PaymentType : 'single',
	ReferenceNumber : '100001',
	DraftLocatorID : '100000001',
	ClerkNumber: '1234',
	MarketCode : 'present',
	TransactionTimestamp :  new Date().toISOString(),
	SystemTraceID : '100002',
	TokenRequested : 'false',
	OriginalAuthCode: '',
	OriginalAuthorizedAmount: '10.00',
	OriginalTransactionTimestamp: '',
	OriginalSystemTraceId: '100002',
	OriginalReferenceNumber: '',
	OriginalSequenceNumber: '123456',
	CancelType: 'authorize',
	ReplacementAmount: '0.00',
	ReversalReason: 'INCOMPLETE_TRANSACTION',
	
}

var address = {
	BillingZipcode : '33606',
}

var card = {
	CardType: 'visa',
	PartialApprovalCode: 'not_supported',
	CardNumber: '4445222299990007',
	ExpirationMonth: '12',
	ExpirationYear:'2017',
	CVV: '382',
	
}

var cancel = {
	credentials : credentials,
	merchant: merchant,
	terminal: terminal,
	transaction: transaction,
	address: address,
	card: card
}


function getCancel(){
	return cancel
}

//console.log(transaction.TransactionTimestamp);
module.exports = getCancel;

