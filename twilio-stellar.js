var stellarAddress = '***********************************'; // your stellar address
// initiate a connection to the Stellar API over Websockets:
var WebSocket = require('ws');
var ws = new WebSocket('ws://live.stellar.org:9001');
 
var accountSid = '********************************'; // your twilio account sid
var authToken = '********************************'; // your twilio auth token
var client = require('twilio')(accountSid, authToken);
// handler that will let us know that our connection is opened: 
ws.on('open', function() {
  var msg = {
// subscribe to updates from the Stellar API
      command: 'subscribe',
      accounts: [ stellarAddress ]
  };
// basic error handling:
  ws.send( JSON.stringify( msg ), function( err ) { 
    console.error( err );
  });
});
// receive the data we get back from the Stellar API:
ws.on('message', function(data, flags) {
  var msg = JSON.parse(data);
  console.log( msg )
 
  if(
    msg.engine_result_code === 0 &&
    msg.type === 'transaction' &&
    msg.transaction.Destination === stellarAddress
  ) {
// code to send an SMS message 
    client.sendMessage({
 
      to:'+************', // your mobile number
      from: '+************', // your twilio number 
      body: 'You received ' + msg.transaction.Amount/1000000 + ' STR'
 
    }, function(err, responseData) {
      if (!err) {
        console.log(responseData.body);
      }
    });
  }
});
