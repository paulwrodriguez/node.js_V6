Vantiv-Developer-Portal and Vantiv-Payment-Web-Services
=======================================================
*** IMPORTANT You will need to create a project at https://apideveloper.vantiv.com/ in order to get access to the sandbox and test your code

Integration Guidelines available here: https://apideveloper.vantiv.com/docs/payment-web-services/implementation-guidelines<br>
Online developers guide: https://apideveloper.vantiv.com/documentation<br>

GETTING STARTED
This sample code shows the developer how to integrate with Vantiv-Developer-Portal. Included in this sample code is an
Authorize, Capture, and Cancel transaction. 
1.	Download and install node js v0.10.33 or later from here: http://nodejs.org/.
2.	You can run the node sample by opening up your terminal/command prompt and 
	navigating to the directory that holds the sample code and typing <node send_request.js>.


Run "send_request.js" to send the authorize, followed by the capture,
followed by the cancel. It will log the request and responses to the console. To run this, you will need node v0.10.33 or
later. In the terminal type <node send_request.js> to run the program.


####Folder Contents
auth.js - This holds all the data for the authorize transaction.<br>
capture.js -  This holds all the data for the capture transaction.<br>
cancel.js - This holds al lthe data for the cancel transaction.<br>
send_request.js - This sends the auth, capture, and cancel requests.<br>