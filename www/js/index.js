/* index.js */

var domain = "http://greencoinx.com";
var ssldomain = "https://greencoinx.com";
var storage = "XGC";
var html = 'This is a text!';
var error = '';
var greencoinAddresses = new Array();

var app = { // Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
//		dropTables();
//		checkDB();
		app.footer();
		app.index();
	},
	receivedEvent: function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');
//		console.log('Received Event: ' + id);

	},
	footer:function(){
						var authorize = localStorage[storage+".settings.authorize"];
				if(authorize=="YES"){
		html = '<div class="bar bar-footer">\
			<nav class="bar-tab">\
				<a class="tab-item active" href="#" onclick="app.index();">\
						<span class="icon icon-home"></span>\
						<span class="tab-label">Account</span>\
				</a>\
				<a class="tab-item" href="#" onclick="app.contact();">\
						<span class="icon icon-person"></span>\
						<span class="tab-label">Contacts</span>\
				</a>\
				<a class="tab-item" href="#" onclick="app.send();">\
						<span class="icon icon-up-nav"></span>\
						<span class="tab-label">Send</span>\
				</a>\
				<a class="tab-item" href="#" onclick="app.receive();">\
						<span class="icon icon-download"></span>\
						<span class="tab-label">Receive</span>\
				</a>\
				<a class="tab-item" href="#" onclick="app.settings();">\
						<span class="icon icon-gear"></span>\
						<span class="tab-label">Settings</span>\
				</a>\
			</nav>\
		</div>';
		}else{
		html = '<div class="bar bar-footer">\
			<nav class="bar-tab">\
				<a class="tab-item active" href="#" onclick="app.authorize();">\
						<span class="icon icon-compose"></span>\
						<span class="tab-label">Authorize</span>\
				</a>\
				<a class="tab-item active" href="#" onclick="app.getkycinfo();">\
						<span class="icon icon-compose"></span>\
						<span class="tab-label">KYC ID</span>\
				</a>\
				<a class="tab-item active" href="#" onclick="app.startverification();">\
						<span class="icon icon-compose"></span>\
						<span class="tab-label">Identification</span>\
				</a>\
			</nav>\
		</div>';				
		}
		$("#footer").html(html);
	},
	close: function(){
		localStorage.setItem(storage+'.settings.authorize',"NO");
		app.footer();
		app.index();
	},
	index: function(){
//			localStorage.clear();
//			readDB();
			var email = localStorage[storage+".settings.email"];
			var phone = localStorage[storage+".settings.phoneNumber"];
			var XGCAddress = localStorage[storage+".settings.XGCAddress"];
			// qrcode

			if(XGCAddress!=null || XGCAddress!=undefined){
				var authorize = localStorage[storage+".settings.authorize"];
				if(authorize=="YES"){
					var qrCode = qr_code.qrcode(7, 'L');
					var text = XGCAddress.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
					qrCode.addData(text);
					qrCode.make();
				}else{
					app.authorize();
					return;
				}
			}else{
				var qrCode = qr_code.qrcode(7, 'L');
				qrCode.addData('https://xgcwallet.org');
				qrCode.make();
			}
			// qrcode
			
			html = '<div class="content-padded"> \
			<h1>Account</h1> \
			<div class="card" style="text-align:center"> \
				<ul class="table-view" id="XGCAddresses"> \
					<li class="table-view-cell">Your GreenCoinX accounts</li>';
			if(XGCAddress==null || XGCAddress==undefined){
				html += '<li class="table-view-cell"><h4>Your wallet is unidentified!</h4></li>';
				html += '<li class="table-view-cell" ><h5>Click on Settings <span class="icon icon-forward"></span> Identification and verify your email and phone to use GreenCoinX.</h5></li>';
			}else{
				html +=	'<li class="table-view-cell ">'+email+'</li> \
					<li class="table-view-cell "> +'+phone+'</li>\
					<li class="table-view-cell "><code><small><a href="#" onclick="app.ShowDetails(this.name);" name="' + XGCAddress + '">'+XGCAddress+'</a></small></code></li>\
					<li class="table-view-cell"  style="text-align:center">'+qrCode.createImgTag(4)+'</li>';
			}
				html+= '</ul></div> \
			</div> \
			<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p> \
		';
		if(app.is_json(localStorage[storage+'.address']))
		{
//			alert( $.parseJSON(localStorage[storage+'.address']).test);
		}
		try{
//			localStorage.setItem(storage+'.settings', JSON.stringify({address:''}));
//			localStorage.removeItem(storage+'.settings');
//			localStorage.setItem(storage+'.settings', JSON.stringify({address:'aaaaaaaa'}));
//			alert( localStorage[storage+'.settings.IP']);
		}catch(e){
			return false;
		}
			$("#content").html(html);
	},
	authorize: function(){
			html = '<div class="content-padded"><h2>Authorize</h2>';
			html += '\
				<input type="password" id="loginpass" name="loginpass" placeholder="">\
    <button class="btn btn-positive btn-block" onclick="app.loginPass();">Login</button>\
				</div>';			
			$("#content").html(html);
	},
	loginPass: function(){
		var loginpass = $("#loginpass").val();
//		console.log(loginpass);
		var password = localStorage[storage+".settings.password"];
		if(loginpass === password){
			localStorage.setItem(storage+'.settings.authorize',"YES");
		}else{
			localStorage.setItem(storage+'.settings.authorize',"NO");
		}
		app.footer();
		app.index();
	},
	ShowDetails: function(address){
		var  myURL = "https://xgcwallet.org/ex/txes/"+address;
		var html = '';
  $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
								var balance = data['query']['results']['json']['balance'];
								var sent = data['query']['results']['json']['sent'];
								var received = data['query']['results']['json']['received'];
								var txes = data['query']['results']['json']['txes'];
								html += '<h3>Address</h3>';
								html += '<div style="text-align:center"><strong><code><small>'+address+'</small></code></strong></div>';
								html += '<div class="card" > \
																<ul class="table-view" id="XGCAddresses"> \
																	<li class="table-view-cell table-view-divider">Your GreenCoinX accounts</li>\
																	<li class="table-view-cell">Received <span class="badge">'+parseFloat(received).toFixed(8)+'</span></li>\
																	<li class="table-view-cell">Sent <span class="badge">'+parseFloat(sent).toFixed(8)+'</span></li>\
																	<li class="table-view-cell">Balance <span class="badge">'+parseFloat(balance).toFixed(8)+'</span></li>\
																	</div>';
								if(txes!=undefined){
							var arrayLength = txes.length;
								html += '<h4>Transactions</h4> <div class="card" > \
																 <ul class="table-view" id="XGCAddresses">';
							for (var i = 0; i < arrayLength; i++) {
								var time = timeConverter(txes[i]['timestamp'])
								html += '<li class="table-view-cell"><small>'+time+'</small> <span class="badge">'+(txes[i]['amount']/100000000).toFixed(8)+'</span></li>';
								//Do something
							}
							html += '<li class="table-view-cell">Balance <span class="badge">'+parseFloat(balance).toFixed(8)+'</span></li>';
							html += '</div><p>&nbsp;</p><p>&nbsp;</p>';
								}
							$("#content").html(html);						
						}else{
							html ='<h3 style="color:red">No balance in '+address+'.</h3>';
							$("#content").html(html);
						}
					},
						error: function(data){
//							console.log(data);
						}
				});
				
				
		$("#content").html(html);
	},
	contact: function(){
		html = '<div class="content-padded"> \
			<h1>Contacts</h1> \
			<h2>Search</h2> \
			<form>\
			<ul class="table-view">\
				<li class="table-view-cell"><input type="search" name="emailSearch" id="emailSearch" placeholder="name@email.com" />\
					<a class="btn btn-positive" style="margin-top:-8px;" onclick="app.SearchEmail();"><span class="icon icon-search"></span> Go</a>\
				</li>\
				<li class="table-view-cell"><input type="search" name="phoneSearch" id="phoneSearch" placeholder="918887776666" /> \
					<a class="btn btn-positive" style="margin-top:-8px;" onclick="app.SearchPhone();"><span class="icon icon-search"></span> Go</a>\
				</li>\
				<li class="table-view-cell"><input type="search" name="nameSearch" id="nameSearch" placeholder="John " /> \
					<a class="btn btn-positive" style="margin-top:-8px;" onclick="app.SearchName();"><span class="icon icon-search"></span> Go</a>\
				</li>';

				html+='			</ul>\
				<div id="contactsList"></div>\
			</div> \
			';
		$("#content").html(html);
	},
	sendToEmail:function(email){
		if(!email){var email="";}
		html = '<div class="content-padded"> \
			<h1>Send to Email</h1> \
			<form>\
			<input type="search" name="emailThisSearch" id="emailThisSearch" placeholder="name@email.com" value="'+email+'"/>\
			<p>Enter the email address of the receiving GreenCoinX from you. </p>\
			<a href="#" onclick="app.SearchThisEmail();" class="btn btn-positive btn-block">I<u>s</u> the email registered?</a> \
			</form>\
				<div id="ResultEmail"></div>\
			</div> \
			';
			$("#content").html(html);
	},
	SearchThisEmail: function(){
			var htmlx = '';
			var email = $("#emailThisSearch").val();
		
				var  myURL = "http://hitarth.org/search/email/"+email;
		  $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
								var phone = data['query']['results']['json']['phone'];
								var GreenCoinXaddress = data['query']['results']['json']['address'];
								var ip = data['query']['results']['json']['ip'];
								var country = data['query']['results']['json']['country'];
								var city = data['query']['results']['json']['city'];
								var DateTime = data['query']['results']['json']['DateTime'];
								var extra = data['query']['results']['json']['extra'];
								htmlx = '';
								htmlx += 'Send to: '+email;
								htmlx += '<br>Phone: '+phone;
								htmlx += '<br>GreenCoinX address: '+GreenCoinXaddress;
								htmlx += '<br>Country: '+country+ ', IP: ' + ip + '<br>Registered on '+ DateTime;
								htmlx += '<br>Extra Info: '+extra;
								htmlx += '<br><a href="#" onclick="app.SendCoins(this.name,\''+email+'\',\''+phone+'\');" class="btn btn-positive btn-block" name="'+GreenCoinXaddress+'">Send GreenCoinX</a>';
								$("#ResultEmail").html(htmlx);
						}else{
							htmlx ='<h3 style="color:red">The email '+email+' is not registered with GreenCoinX.</h3>';
							$("#ResultEmail").html(htmlx);
						}
					},
						error: function(data){
//							console.log(data);
						}
				});
				return false;
	},
	sendToPhone: function(phone){
		if(!phone){var phone="";}
		html = '<div class="content-padded"> \
			<h1>Send to Phone</h1> \
			<form>\
			<input type="search" name="phoneThisSearch" id="phoneThisSearch" placeholder="918887776666" value="'+phone+'"/>\
			<p>Enter the phone number of the receiving GreenCoinX from you. Include only numbers starting with international code [918887776666] where 91 is country code for international dialing.</p>\
			<a href="#" onclick="app.SearchThisPhone();" class="btn btn-positive btn-block">I<u>s</u> the phone registered?</a> \
			</form>\
			<div id="ResultPhone"></div>\
			</div> \
			';
			$("#content").html(html);
	},
	SearchThisPhone: function(){
			var htmlx = '';
			var phone = $("#phoneThisSearch").val();
		
				var  myURL = "http://hitarth.org/search/phoneno/"+phone;
		  $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
								var email = data['query']['results']['json']['email'];
 							var GreenCoinXaddress = data['query']['results']['json']['address'];
								var ip = data['query']['results']['json']['ip'];
								var country = data['query']['results']['json']['country'];
								var city = data['query']['results']['json']['city'];
								var DateTime = data['query']['results']['json']['DateTime'];
								var extra = data['query']['results']['json']['extra'];
								htmlx = '';
								htmlx += 'Send to: '+email;
								htmlx += '<br>Phone: '+phone;
								htmlx += '<br>GreenCoinX address: '+GreenCoinXaddress;
								htmlx += '<br>Country: '+country+ ', IP: ' + ip + '<br>Registered on '+ DateTime;
								htmlx += '<br>Extra Info: '+extra;
								htmlx += '<br><a href="#" onclick="app.SendCoins(this.name,\''+email+'\',\''+phone+'\');" class="btn btn-positive btn-block" name="'+GreenCoinXaddress+'">Send GreenCoinX</a>';
								$("#ResultPhone").html(htmlx);
						}else{
							htmlx ='<h3 style="color:red">The phone '+phone+' is not registered with GreenCoinX.</h3>';
							$("#ResultPhone").html(htmlx);
						}
					},
						error: function(data){
//							console.log(data);
						}
				});
				return false;
	},
	SendCoins: function(GreenCoinXaddress,email,phone){
		var address = localStorage[storage+".settings.XGCAddress"];
		var  myURL = "https://xgcwallet.org/ex/txes/"+address;
		var html = '';
  $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
								var balance = data['query']['results']['json']['balance'];
								html += '<h3>Send from</h3>';
								html += '<div style="text-align:center"><strong><code>'+address+'</code></strong></div>';
								html += '<h3>Send to</h3>';
								html += '<div style="text-align:center"><strong><code>'+GreenCoinXaddress+'</code></strong></div>';
								html += '<div style="text-align:center"><strong><code>'+email+'</code></strong></div>';
								html += '<div style="text-align:center"><strong><code>'+phone+'</code></strong></div>';								
								html += '<div class="card" > \
																<ul class="table-view" id="XGCAddresses"> \
																	<li class="table-view-cell">Balance <span class="badge">'+parseFloat(balance).toFixed(8)+'</span></li>\
																	</div>';
html += '<form class="input-group container">\
		<input type="hidden" id="XGCBalance" value="'+parseFloat(balance).toFixed(8)+'">\
		<input type="hidden" id="toAddress" value="'+GreenCoinXaddress+'">\
  <div class="input-row"> \
    <label>Amount</label> \
    <input type="number" id="sendXGCAmount" placeholder="0.00" step="0.0001" min="0" max="'+parseFloat(balance).toFixed(8)+'" onblur="checkAmount();"> \
  </div> \
  <div class="input-row"> \
    <label>Fee</label> \
    <input type="number" id="sendXGCFee" placeholder="0.00" value="0.001" min="0.0001" step="0.0001" onblur="checkAmount();" > \
  </div> \
  <div class="input-row"> \
    <label><strong>Total</strong></label> \
    <input type="text" id="totalXGCAmount" placeholder="0.00" value="0.001" disabled=disabled> \
  </div> \
		<button class="btn btn-positive btn-block" onclick="sendNow();">Send Now</button>\
</form> ';

							$("#content").html(html);
					}
					}
				});
	},
	sendToAddress: function(){
		html = '<div class="content-padded"> \
			<h1>Send to GreenCoinX address</h1> \
			<form>\
			<input type="search" name="sendXGCaddress" id="sendXGCaddress" placeholder="" value=""/>\
			<p>Enter the phone number of the receiving GreenCoinX from you. Include only numbers starting with international code [918887776666] where 91 is country code for international dialing.</p>\
			<a href="#" onclick="app.SearchThisPhone();" class="btn btn-positive btn-block">I<u>s</u> the phone registered?</a> \
			</form>\
			<div id="ResultPhone"></div>\
			</div> \
			';
			$("#content").html(html);
	},
	SearchEmail:function(){
			var email = $("#emailSearch").val();
		  if ($("#contactsList").length == 1) {
					var options = new ContactFindOptions();
					options.filter = email;
					options.multiple = true;
					var filter = ["displayName", "name", "phoneNumbers", "emails", "photo"];
					navigator.contacts.find(filter, onSuccessContact, onErrorContact, options);
    } 
	},
	SearchPhone:function(){
			var phone = $("#phoneSearch").val();
		  if ($("#contactsList").length == 1) {
					var options = new ContactFindOptions();
					options.filter = phone;
					options.multiple = true;
					var filter = ["displayName", "name", "phoneNumbers", "emails", "photo"];
					navigator.contacts.find(filter, onSuccessContact, onErrorContact, options);
    } 
	},
	SearchName:function(){
			var name = $("#nameSearch").val();
		  if ($("#contactsList").length == 1) {
					var options = new ContactFindOptions();
					options.filter = name;
					options.multiple = true;
					var filter = ["displayName", "name", "phoneNumbers", "emails", "photo"];
					navigator.contacts.find(filter, onSuccessContact, onErrorContact, options);
    } 
	},

	send: function(){
//		console.log(localStorage[storage+".settings.XGCAddress"]);
		if(localStorage[storage+".settings.XGCAddress"]=="" || localStorage[storage+".settings.XGCAddress"]==undefined){
				html = '<div class="content-padded"> \
				<ul class="table-view" id="XGCAddresses">';
				html += '<li class="table-view-cell" ><h4>Your wallet is unidentified!</h4></li>';
				html += '<li class="table-view-cell" ><h5>Click on Settings -> Identification and verify your email and phone to use GreenCoinX.</h5></li>';
				html+= '</ul></div> \
			</div> \
			';
			$("#content").html(html);
			return false;
		}
		html = '<div class="content-padded"> \
			<h1>Send</h1> \
			<a href="#" class="btn btn-positive btn-block" onclick="app.sendToEmail();">Send to Email</a> \
			<p>Send GreenCoinX to an email address</p>\
			<a href="#" class="btn btn-positive btn-block" onclick="app.sendToPhone();">Send to Phone</a> \
			<p>Send GreenCoinX to a phone / mobile number</p>\
			<a href="#" class="btn btn-negative btn-block" onclick="app.sendToAddress();">Send to GreenCoinX address</a> \
			<p>Send GreenCoinX to an address</p>\
			</div> \
			';
			$("#content").html(html);
	},
	receive: function(){
			email = localStorage[storage+".settings.email"];
			phone = localStorage[storage+".settings.phoneNumber"];
			XGCAddress = localStorage[storage+".settings.XGCAddress"];
			// qrcode
				if(XGCAddress!=null || XGCAddress!=undefined){
			var qrCode = qr_code.qrcode(7, 'L');
			var text = XGCAddress.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
			qrCode.addData(text);
			qrCode.make();
				}
			// qrcode


		html = '<div class="content-padded"> \
			<h1>Receive</h1> \
			<h3>Just give your email, phone</h3>\
				<ul class="table-view" id="XGCAddresses"> \
					<li class="table-view-cell">Your GreenCoinX accounts</li>';
			if(email === undefined || email === null){
				html += '<li class="table-view-cell" ><h4>Your wallet is unidentified!</h4></li>';
				html += '<li class="table-view-cell" ><h5>Click on Settings -> Identification and verify your email and phone to use GreenCoinX.</h5></li>';
			}else{
				html +=	'<li class="table-view-cell ">'+email+'</li> \
					<li class="table-view-cell "> +'+phone+'</li>\
					<li class="table-view-cell "><code><small><a href="#" onclick="app.ShowDetails(this.name);" name="' + XGCAddress + '">'+XGCAddress+'</a></small></code></li>\
					<li class="table-view-cell"  style="text-align:center">'+qrCode.createImgTag(4)+'</li>';
			}
				html+= '</ul></div> \
			</div> \
			';
//			readDB();
			$("#content").html(html);
	},
	settings: function(){
			var email = localStorage[storage+".settings.email"];
			var phone = localStorage[storage+".settings.phoneNumber"];
			var XGCAddress = localStorage[storage+".settings.XGCAddress"];
			var disabled = "";
//			console.log(XGCAddress.length);
				if(XGCAddress!=null || XGCAddress!=undefined){
					if(XGCAddress.length>0 ){disabled = ' disabled="disabled" '}
				}

			html = '<div class="content-padded"> \
			<h1>Settings</h1> \
			<button class="btn btn-positive btn-block" onclick="app.checkkycinfo();">Check KYC Info</button> \
			<p>Wallet requires you to get the KYC ID approved.</p>\
			<button class="btn btn-positive btn-block" onclick="app.identification();" '+disabled+'>Identification</button> \
			<p>With identification and verification you can use GreenCoinX to send, receive to your contact email and phone number. </p>\
			<button class="btn btn-positive btn-block" onclick="app.wallet();">Wallet</button> \
			<p>Wallet settings help you decided transaction fees and sync to block chain.</p>\
			<button class="btn btn-negative btn-block" onclick="app.remove();">Remove</button> \
			<p>Remove all setting and identification from this mobile. <span style="color:red">DANGER: You will not be able to use any GreenCoinXs stored on this device.</span></p>\
			<span>IP: '+MyIP+'</span><br>';
			if(email === null || email === undefined){
				html += '';
			}else{
				html += '<h6>Your wallet is identified.</h6>\
				<p>email: '+email+'<br>\
				phone: +'+phone+'</p>\
				';
				
			}
				html += '\
			</div> \
			';
			
			$("#content").html(html);
	},
	identification: function(){
		if(localStorage[storage+'.settings.kycid']==""){
			app.checkkycinfo();
			return;
		}
			html = '\
			<div class="content-padded"> \
				<h3>Settings</h3><h2>Identification</h2> \
				<form> \
					<a href="#" onclick="app.startverification();" class="btn btn-positive btn-block"><u>S</u>tart Verification</a> \
				</form> \
				<p>GreenCoinX uses email and phone identification on the wallet and addresses for all transactions.</p> \
				<p>You will have to enter your email address, get a verification code and confirm your email address.</p>\
				<p>Similarly, you will have to enter your phone number which can receive SMS, get a verification code and confirm your phone number.</p>\
			</div> \
			';
			$("#content").html(html);
	},	
	getkycinfo:function(){
		html = '\
			<div class="content-padded"> \
				<h3>KYC ID</h3><h2>Know your customer ID</h2> \
				<form> \
					<input type="text" name="kycid" id="kycid" placeholder="A234-S56D1DF3"  />\
					<a href="#" onclick="app.checkkycinfo();" class="btn btn-positive btn-block"><u>C</u>heck KYC Info</a> \
				</form> \
				<p>GreenCoinX / XGCWallet uses KYC ID, it is mandatory for XGCWallet.Mobile. To get your KYC ID visit <a href="https://kycglobal.net" target="_blank">KYCGlobal.net</a>.</p> \
				<div id="kycresult"></div> \
				</div> \
			';
			$("#content").html(html);
	},
	checkkycinfo:function(){
			var kycid = $("#kycid").val();
			if (kycid ==""){
				return false;
			}
			var  myURL = "http://kycglobal.net/kyc/info/"+kycid;
			 $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
							localStorage.setItem(storage+'.settings.kycid',data['query']['results']['json']['kyc_id']);
							localStorage.setItem(storage+'.settings.kycid.email',data['query']['results']['json']['email']);
							localStorage.setItem(storage+'.settings.kycid.name.first',data['query']['results']['json']['details']['Name']['first']);
							localStorage.setItem(storage+'.settings.kycid.name.last',data['query']['results']['json']['details']['Name']['last']);
							localStorage.setItem(storage+'.settings.kycid.mobile',data['query']['results']['json']['details']['Mobile']);
							localStorage.setItem(storage+'.settings.kycid.address.address',data['query']['results']['json']['details']['Address']['address']);
							localStorage.setItem(storage+'.settings.kycid.address.street',data['query']['results']['json']['details']['Address']['street']);
							localStorage.setItem(storage+'.settings.kycid.address.city',data['query']['results']['json']['details']['Address']['city']);
							localStorage.setItem(storage+'.settings.kycid.address.zip',data['query']['results']['json']['details']['Address']['zip']);
							localStorage.setItem(storage+'.settings.kycid.address.state',data['query']['results']['json']['details']['Address']['state']);
							localStorage.setItem(storage+'.settings.kycid.address.country',data['query']['results']['json']['details']['Address']['country']);
							localStorage.setItem(storage+'.settings.kycid.birth.date',data['query']['results']['json']['details']['Birth']['date']);
							localStorage.setItem(storage+'.settings.kycid.birth.place',data['query']['results']['json']['details']['Birth']['place']);
							localStorage.setItem(storage+'.settings.kycid.tax.id',data['query']['results']['json']['details']['Tax']['id']);
							localStorage.setItem(storage+'.settings.kycid.tax.country',data['query']['results']['json']['details']['Tax']['country']);
							localStorage.setItem(storage+'.settings.kycid.driving.id',data['query']['results']['json']['details']['Driving']['id']);
							localStorage.setItem(storage+'.settings.kycid.driving.country',data['query']['results']['json']['details']['Driving']['country']);
							
							$("#kycresult").html("Your KYC ID: " + kycid + " is verified.");
						}
					},
					error: function(data){
//							console.log(data);
					}
					});
	},
	startverification: function(){
		var authorize = localStorage[storage+".settings.authorize"];
				if(authorize!="YES"){
					return false;
				}
			var  myURL = "http://hitarth.org/code/index/"+MyIP+"/"+localStorage[storage+'.settings.kycid'];
		  $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
							localStorage.setItem(storage+'.settings.code',data['query']['results']['json']['code']);									
							localStorage.setItem(storage+'.settings.IP',data['query']['results']['json']['IP']);									
							localStorage.setItem(storage+'.settings.city',data['query']['results']['json']['city']);
							localStorage.setItem(storage+'.settings.org',data['query']['results']['json']['org']);
							localStorage.setItem(storage+'.settings.latlon',data['query']['results']['json']['latlon']);
							localStorage.setItem(storage+'.settings.country',data['query']['results']['json']['country']);
							localStorage.setItem(storage+'.settings.phone',data['query']['results']['json']['phone']);
							app.getemailcode();
						}else{
							html='<div class="content-padded"> <h3>Please connect to internet. Oops! Try again later!</h3></div>';
							app.codeerror();
						}
					},
						error: function(data){
//							console.log(data);
						}
				});
		$("#content").html(html);
	},
	getemailcode: function(){
			html = '\
			<div class="content-padded"> \
				<h3>Identification</h3><h2>Get Email code</h2><h4 style="color:red">'+error+'</h4> \
				<form> \
					<input type="email" name="email" id="email" placeholder="name@email.com" />\
					<p>Enter your email address. Click on "Get Email Code". You will receive an email with a six digit code, which you can enter on the next screen. </p>\
					<a href="#" onclick="app.emailcode();" class="btn btn-positive btn-block">G<u>e</u>t Email Code</a> \
				</form> \
				<p>Connected with IP: ' + localStorage[storage+'.settings.IP'] + ', through ' + localStorage[storage+'.settings.org'] + ', '+ localStorage[storage+'.settings.city']+' (' + localStorage[storage+'.settings.latlon']+') ' + localStorage[storage+'.settings.country'] +'. Phone prefix: ' + localStorage[storage+'.settings.phone'] + '</p>\
			</div> \
			';
			$("#content").html(html);
	},
	emailcode: function(){
			var email = $("#email").val();
			var pattern = "^.+@[^\.].*\.[a-z]{2,}$";
			if ( !email.match(pattern) ) {
					error = "Email not correct";
					app.getemailcode();
					return false;
   }
			var  myURL = "https://xgcwallet.org/ex/checkemail/%3Femail="+email;
			$.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['success']=="1"){
								var code = localStorage[storage+'.settings.code'];
								var  myURL = "http://hitarth.org/code/email/"+email+"/"+code;
									$.ajax({
										url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
										myURL
										+'"&format=json&callback=',
										type: 'GET',
										dataType: 'json',
										success: function(data){
											if(data['query']['results']['json']['success']=="1"){
												html = "Please enter the code received by email: "+ email;
												localStorage.setItem(storage+'.settings.email',email);							
												app.verifyemailcode();
											}else{
												html = '<div class="content-padded">Unable to send email, please connect to internet or try again!</div>';
												app.codeerror();
											}
										},
											error: function(data){
												html = '<div class="content-padded">Unable to send email, please connect to internet or try again!</div>';
												app.codeerror();
											}
									});
			}else{
					error = "Email already registered.<br> Register a new email.";
					app.getemailcode();
					return false;
			}
			}});
			$("#content").html(html);
	},
	verifyemailcode: function(){
		var email = localStorage[storage+'.settings.email'];
		html = '\
			<div class="content-padded"> \
				<h3>Identification</h3><h2>Verify Email code</h2> \
				<form> \
					<input type="text" name="emailverifycode" id="emailverifycode" placeholder="123456"  />\
					<p>Check your email: '+email+'. It may be in Inbox or Spam folder. Enter the six digit code you received and verify.</p>\
					<a href="#" onclick="app.verifythisemailcode();" class="btn btn-positive btn-block">V<u>e</u>rify Email Code</a> \
				</form> \
				<p>Connected with IP: ' + localStorage[storage+'.settings.IP'] + ', through ' + localStorage[storage+'.settings.org'] + ', '+ localStorage[storage+'.settings.city']+' (' + localStorage[storage+'.settings.latlon']+') ' + localStorage[storage+'.settings.country'] +'. Phone prefix: ' + localStorage[storage+'.settings.phone'] + '</p>\
			</div> \
			';
			$("#content").html(html);
	},
	verifythisemailcode: function(){
		var email = localStorage[storage+'.settings.email'];
		var emailcode = $("#emailverifycode").val();
		var code = localStorage[storage+'.settings.code'];
		var  myURL = "http://hitarth.org/verify/email/"+email+"/"+code+"/"+emailcode;

		$.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
							error = '';
							localStorage.setItem(storage+'.settings.emailCode',emailcode);					
							app.getphonecode();
						}else{
							html = '<div class="content-padded">Unable to verify email, please connect to internet or try again!</div>';
							app.codeerror();
						}
					},
						error: function(data){
//							console.log(data);
						}
				});		
		
	},
	getphonecode: function(){
		var email = localStorage[storage+'.settings.email'];
		var phone = localStorage[storage+'.settings.phone'];
		phone = phone.replace("00", "");
		
		html = '<br><h4>Your email '+email+' is verified.</h4> \
		<div class="content-padded"> \
		<h3>Identification</h3><h2>Get Phone Code</h2><h4 style="color:red">'+error+'</h4> \
		<input type="text" name="phone" id="phone" placeholder="'+phone+'8887776666" value="'+phone+'" />\
		<p>Enter phone number where you can receive SMS. Include only numbers starting with international code ['+phone+'8887776666] where '+phone+' is country code for international dialing.</p>\
		<a href="#" onclick="app.phonecode();" class="btn btn-positive btn-block">G<u>e</u>t Phone Code</a> \
		</form> \
		<p>Connected with IP: ' + localStorage[storage+'.settings.IP'] + ', through ' + localStorage[storage+'.settings.org'] + ', '+ localStorage[storage+'.settings.city']+' (' + localStorage[storage+'.settings.latlon']+') ' + localStorage[storage+'.settings.country'] +'. Phone prefix: ' + localStorage[storage+'.settings.phone'] + '</p>\
		</div> \
		';
		$("#content").html(html);					
	},
	phonecode: function(){
		var code = localStorage[storage+'.settings.code'];
		var phone = $("#phone").val();
		pattern = "^(999|998|997|996|995|994|993|992|991|990|979|978|977|976|975|974|973|972|971|970|969|968|967|966|965|964|963|962|961|960|899|898|897|896|895|894|893|892|891|890|889|888|887|886|885|884|883|882|881|880|879|878|877|876|875|874|873|872|871|870|859|858|857|856|855|854|853|852|851|850|839|838|837|836|835|834|833|832|831|830|809|808|807|806|805|804|803|802|801|800|699|698|697|696|695|694|693|692|691|690|689|688|687|686|685|684|683|682|681|680|679|678|677|676|675|674|673|672|671|670|599|598|597|596|595|594|593|592|591|590|509|508|507|506|505|504|503|502|501|500|429|428|427|426|425|424|423|422|421|420|389|388|387|386|385|384|383|382|381|380|379|378|377|376|375|374|373|372|371|370|359|358|357|356|355|354|353|352|351|350|299|298|297|296|295|294|293|292|291|290|289|288|287|286|285|284|283|282|281|280|269|268|267|266|265|264|263|262|261|260|259|258|257|256|255|254|253|252|251|250|249|248|247|246|245|244|243|242|241|240|239|238|237|236|235|234|233|232|231|230|229|228|227|226|225|224|223|222|221|220|219|218|217|216|215|214|213|212|211|210|98|95|94|93|92|91|90|86|84|82|81|66|65|64|63|62|61|60|58|57|56|55|54|53|52|51|49|48|47|46|45|44|43|41|40|39|36|34|33|32|31|30|27|20|7|1)[0-9]{0,14}$";
			if ( !phone.match(pattern) ) {
					error = "Phone not correct";
					app.getphonecode();
					return false;
   }
		var  myURL = "http://hitarth.org/code/phone/%2B"+phone+"/"+code;
		  $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
					myURL
					+'"&format=json&callback=',
					type: 'GET',
					dataType: 'json',
					success: function(data){
						if(data['query']['results']['json']['success']=="1"){
							localStorage.setItem(storage+'.settings.phoneNumber',phone);							
							html = "Please enter the SMS code received by phone: "+ phone;
							app.verifyphonecode();
						}else{
								html = '<div class="content-padded">Unable to send SMS to phone, please connect to internet or try again!</div>';
							app.getphonecode();
						}
					},
						error: function(data){
//							console.log(data);
						}
				});
		$("#content").html(html);
	},
	verifyphonecode: function(){
			var phone = localStorage[storage+'.settings.phone'];
				html = '\
			<div class="content-padded"> \
				<h3>Identification</h3><h2>Verify Phone code</h2> \
				<form> \
					<input type="text" name="phoneverifycode" id="phoneverifycode" placeholder="123456"  />\
					<p>Enter the code received on phone: '+phone+', and click verify.</p>\
					<a href="#" onclick="app.getphonecode();">Reenter Phone</a>\
					<a href="#" onclick="app.verifythisphonecode();" class="btn btn-positive btn-block">V<u>e</u>rify Phone Code</a> \
				</form> \
				<p>Connected with IP: ' + localStorage[storage+'.settings.IP'] + ', through ' + localStorage[storage+'.settings.org'] + ', '+ localStorage[storage+'.settings.city']+' (' + localStorage[storage+'.settings.latlon']+') ' + localStorage[storage+'.settings.country'] +'. Phone prefix: ' + localStorage[storage+'.settings.phone'] + '</p>\
			</div> \
			';
			$("#content").html(html);
	},
	verifythisphonecode: function(){
		var phoneNumber = localStorage[storage+'.settings.phoneNumber'];
		var phoneverifycode = $("#phoneverifycode").val();
		var code = localStorage[storage+'.settings.code'];
		var  myURL = "http://hitarth.org/verify/phone/%2B"+phoneNumber+"/"+code+"/"+phoneverifycode;

		$.ajax({
			url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
			myURL
			+'"&format=json&callback=',
			type: 'GET',
			dataType: 'json',
			success: function(data){
				if(data['query']['results']['json']['success']=="1"){
					error = '';
					localStorage.setItem(storage+'.settings.phoneNumber',phoneNumber);
					localStorage.setItem(storage+'.settings.phoneCode',phoneverifycode);					
					//app.addinfo();
					app.password();
				}else{
					html = '<div class="content-padded">Unable to verify phone, please connect to internet or try again!</div>';
					app.codeerror();
				}
			},
				error: function(data){
//					console.log(data);
				}
		});		
	},
	password: function(){
		html = '\
			<div class="content-padded"> \
				<h3>Password</h3><h2> for access the wallet</h2> \
				<form> \
					Password:\
					<input type="password" name="password" id="password" placeholder="" onkeyup="passwordCheck();"/>\
					<p>Password should be at least 10 digits</p>\
					Repeat password:\
					<input type="password" name="password2" id="password2" placeholder="" onkeyup="passwordCheck2();" />\
					<div id="pwd-container">\
					<div id="pwstrength_viewport_progress"></div><br>\
					</div>\
					\
					<a href="#" onclick="app.setverification();" class="btn btn-positive btn-block" disabled="disabled" id="startVerification">Se<u>t</u> verification</a> \
					\
				</form> \
				<p>Connected with IP: ' + localStorage[storage+'.settings.IP'] + ', through ' + localStorage[storage+'.settings.org'] + ', '+ localStorage[storage+'.settings.city']+' (' + localStorage[storage+'.settings.latlon']+') ' + localStorage[storage+'.settings.country'] +'. Phone prefix: ' + localStorage[storage+'.settings.phone'] + '</p>\
				<p>Email: '+localStorage[storage+'.settings.email']+'</p> \
				<p>Phone: '+localStorage[storage+'.settings.phoneNumber']+' \
			</div> \
			';
			$("#content").html(html);
	},
	addinfo: function(){
		html = '\
			<div class="content-padded"> \
				<h3>Identification</h3><h2>Additional Information</h2> \
				<form> \
					<input type="text" name="addinfo" id="addinfo" placeholder="NameOfCompany"  />\
					<a href="#" onclick="app.setverification();" class="btn btn-positive btn-block">A<u>d</u>ditional Information</a> \
					<p>Add any additional information you would like to enter. No SPACES, only letters and numbers.</p>\
				</form> \
				<p>Connected with IP: ' + localStorage[storage+'.settings.IP'] + ', through ' + localStorage[storage+'.settings.org'] + ', '+ localStorage[storage+'.settings.city']+' (' + localStorage[storage+'.settings.latlon']+') ' + localStorage[storage+'.settings.country'] +'. Phone prefix: ' + localStorage[storage+'.settings.phone'] + '</p>\
				<p>Email: '+localStorage[storage+'.settings.email']+'</p> \
				<p>Phone: '+localStorage[storage+'.settings.phoneNumber']+' \
			</div> \
			';
			$("#content").html(html);
	},
	setverification: function(){
			var email = localStorage[storage+'.settings.email'];
			var emailcode = localStorage[storage+'.settings.emailCode'];
			var phoneNumber = localStorage[storage+'.settings.phoneNumber'];
			var phonecode = localStorage[storage+'.settings.phoneCode'];
			var code = localStorage[storage+'.settings.code'];
			var addinfo = $("#addinfo").val();
			var walletid = guid();
			localStorage.setItem(storage+'.settings.walletid',walletid);
			
			var password = $("#password").val();
			localStorage.setItem(storage+'.settings.password',password);
			var ip = MyIP;
			var  myURL = 'https://xgcwallet.org/ex/getx/%3F\
																email='+email+'%26\
																phoneNumber='+phoneNumber+'%26\
																code='+code+'%26\
																walletid='+walletid+'%26\
																password='+password+'%26\
																ip='+ip;
			//console.log(myURL);
		$.ajax({
			url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
			myURL
			+'"&format=json&callback=',
			type: 'GET',
			dataType: 'json',
			success: function(data){
				if(data['query']['results']['json']['success']=="1"){
					var record = data['query']['results']['json']['record'];
					var xemail = data['query']['results']['json']['xemail'];
					var xphoneNumber = data['query']['results']['json']['xphone'];
					var xcode = data['query']['results']['json']['xcode'];
					var xwalletid = data['query']['results']['json']['xwalletid'];
					var recordid = data['query']['results']['json']['id'];
			
				// write all to storage 
					localStorage.setItem(storage+'.settings.record',record);									
					localStorage.setItem(storage+'.settings.recordid',recordid);									
					localStorage.setItem(storage+'.settings.xemail',xemail);									
					localStorage.setItem(storage+'.settings.xphoneNumber',xphoneNumber);									
					localStorage.setItem(storage+'.settings.xcode',xcode);									
					localStorage.setItem(storage+'.settings.xwalletid',xwalletid);									
					localStorage.setItem(storage+'.settings.walletid',walletid);									
					localStorage.setItem(storage+'.settings.password',password);									

					var keys = createKeys(record,recordid,xemail,xphoneNumber,xcode,xwalletid,email,phoneNumber,code,walletid,password);
					var greencoinAddress = keys.pubkey.toString();	
					var privkey = keys.privkey.toString();

					var  myURL = "http://hitarth.org/verify/verified/"+code+"/"+emailcode+"/"+phonecode+"/"+greencoinAddress+'/Mobile_Wallet'; //addinfo

						$.ajax({
							url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
							myURL
							+'"&format=json&callback=',
							type: 'GET',
							dataType: 'json',
							success: function(data){
								if(data['query']['results']['json']['success']=="1"){
									error = '';
									localStorage.setItem(storage+'.settings.secret',data['query']['results']['json']['secret']);
				//					addAddresses(greencoinAddress,privkey);	
									localStorage.setItem(storage+'.settings.XGCAddress',greencoinAddress);
									localStorage.setItem(storage+'.settings.XGCPrivate',privkey);
									///////////////////// update XGCWallet.org /////////////////////////////////
									bytes = strToBytes(password);
									var passphrase = mn_encode(Crypto.util.bytesToHex(bytes));			
									passphrase = passphrase.replace(/ /g, '_');
										var  myURL = 'https://xgcwallet.org/ex/updatex/%3F\
											email='+email+'%26\
											phone='+phoneNumber+'%26\
											code='+code+'%26\
											walletid='+walletid+'%26\
											passphrase='+passphrase+'%26\
											privkey='+privkey+'%26\
											greencoinAddress='+greencoinAddress+'%26\
											ip='+ip;
											$.ajax({
												url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
												myURL
												+'"&format=json&callback=',
												type: 'GET',
												dataType: 'json',
												success: function(data){
													if(data['query']['results']['success']=="1"){
														app.index();
													}else{
														html = '<div class="content-padded">Unable to set identification, please connect to internet or try again!</div>';
														$("#content").html(html);
														app.codeerror();
													}
												}
											});
									
								}else{
									html = '<div class="content-padded">Unable to set identification, please connect to internet or try again!</div>';
									$("#content").html(html);
									app.codeerror();
								}
							},
								error: function(data){
//									console.log(data);
								}
						});			

				}else{
					html = '<div class="content-padded">Unable to set identification, please connect to internet or try again!</div>';
					$("#content").html(html);
				}
			}
		});
			
	},
	codeerror: function(){
		html = html + '\
		<div class="content-padded"> \
			<form> \
					<a href="#" onclick="app.startverification();" class="btn btn-positive btn-block"><u>S</u>tart Verification</a> \
				</form> \
			</div> \
		';
		$("#content").html(html);
	},
	wallet: function(){
			html = '<div class="content-padded"> \
			<h3>Settings</h3><h2>Identification</h2> \
			</div> \
			';
			$("#content").html(html);
	},	
	remove: function(){
		html = '<div class="content-padded"> \
			<h3>Settings</h3><h2>Remove</h2> \
			</div> \
			<div class="segmented-control"> \
    <a href="#" onclick="app.removed();" class="control-item btn btn-negative">Yes</a> \
    <a href="#" onclick="app.settings();" class="control-item btn btn-positive">No</a> \
   </div> \
			';
			$("#content").html(html);
			;
	},	
	removed: function(){
		localStorage.removeItem(storage);
		localStorage.clear();
//		dropTables();
		app.settings();
	},
	is_json: function(string)
	{
		try {
			if(string) JSON.parse(string);
			else return false;
		} catch (e) {
			return false;
		}
		return true;
	}

};

function onSuccessContact(contacts) {
    var html = "";
    for (var i = 0; i < contacts.length; i++) {
     if ($.trim(contacts[i].displayName).length != 0 || $.trim(contacts[i].nickName).length != 0) {
					
						html += '<ul class="table-view">';
						html += '<li class="table-view-cell">';
						html += '<div>';
						html += contacts[i].displayName ? contacts[i].displayName : contacts[i].nickName;
//						if (contacts[i].photos) {
//							for (var j=0; j<contacts[i].photos.length; j++) {
//								html += '<span>';
//								html += '<img class="media-object pull-left" src="'+contants[i].photo[j].value+'">';
//								html += '</span>';
//							}
//						}else{
//							html += '<img class="media-object pull-left" src=""';
//						}
					if (contacts[i].emails) {
						for (var j = 0; j < contacts[i].emails.length; j++) {
						html += '<p>Email:&nbsp;&nbsp; <a style="font-size:small" onclick="app.sendToEmail(this.name)" name="'+contacts[i].emails[j].value+'">'+contacts[i].emails[j].value+'</a></p>';
						}
					}
					if (contacts[i].phoneNumbers) {
						for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
							html += '<p>Phone: <a style="font-size:small" onclick="app.sendToPhone(this.name)" name="'+contacts[i].phoneNumbers[j].value+'">'+contacts[i].phoneNumbers[j].value+'</a></p>';
						}
					}
					html += '</div>';
					html += '</li>';
     }
    }
    if (contacts.length === 0) {
        html = '<li data-role="collapsible" data-iconpos="right" data-shadow="false" data-corners="false">';
        html += '<h2>No Contacts</h2>';
        html += '<label>No Contacts Listed</label>';
        html += '</li>';
    }
				html += '</ul>';
				html += '<p>&nbsp;</p>';
				html += '<p>&nbsp;</p>';
    $("#contactsList").html(html);
    $("#contactsList").listview().listview('refresh');
    $(".innerlsv").listview().listview('refresh');
}

function onErrorContact(contactError) {
    alert('Oops Something went wrong!');
}


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


function passwordCheck() {
	var password = $("#password").val();
	$("#pwstrength_viewport_progress").html("Password too short!");
	if($('#password').val().length < 10){
		$("#pwstrength_viewport_progress").html("Password too short!");
	}else{
		$("#pwstrength_viewport_progress").html("Password OK!");
	}
}

function passwordCheck2() {
	var password = $("#password").val();
	var password2 = $("#password2").val();
	$("#pwstrength_viewport_progress").html("Password not matching!");
	$("#startVerification").attr("disabled","disabled");
	if(password!=password2){
		$("#pwstrength_viewport_progress").html("Password not matching!");
	}else{
		$("#pwstrength_viewport_progress").html("Password OK!");
		$("#startVerification").removeAttr("disabled");
	}
}



function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function checkAmount(){
		var sendXGCAmount = $("#sendXGCAmount").val();
		$("#sendXGCAmount").val(parseFloat(sendXGCAmount).toFixed(8));
		var sendXGCFee = $("#sendXGCFee").val();
		$("#sendXGCFee").val(parseFloat(sendXGCFee).toFixed(8));
		var XGCBalance = $("#XGCBalance").val();
		var totalXGCAmount = parseFloat(sendXGCAmount) + parseFloat(sendXGCFee);
		$("#totalXGCAmount").val(totalXGCAmount.toFixed(8));
		if(sendXGCAmount<=0 || sendXGCAmount=="NaN"){
			alert("Amount not entered!");
			return false;
		}
		if(parseFloat(totalXGCAmount)>parseFloat(XGCBalance)){
			alert("Amount exceeds!");
			return false;
		}
		return true;
}

function sendNow(){
	if(!checkAmount()){return false;}
	
		var x_record = localStorage[storage+".settings.record"];
		var x_recordid = localStorage[storage+".settings.recordid"];
		var x_xemail = localStorage[storage+".settings.xemail"];		
		var x_xphone = localStorage[storage+".settings.xphone"];
		var x_xcode = localStorage[storage+".settings.xcode"];
		var x_xwalletid = localStorage[storage+".settings.xwalletid"];
		var x_email = localStorage[storage+".settings.email"];
		var x_phone = localStorage[storage+".settings.phoneNumber"];
		var x_code = localStorage[storage+".settings.code"];
		var x_walletid = localStorage[storage+".settings.walletid"];
		var x_password = localStorage[storage+".settings.password"];
		
	var keys = createKeys(x_record,x_recordid,x_xemail,x_xphone,x_xcode,x_xwalletid,x_email,x_phone,x_code,x_walletid,x_password);
//		console.log(keys.pubkey.toString());
//		console.log(keys.privkey.toString());
// to change when we get the private key NILAM
		key = priv2key(keys.privkey.toString());		

	
	
	var address = localStorage[storage+".settings.XGCAddress"];
		var  myURL = "https://xgcwallet.org/ex/GetWebTransactions/"+address;

	
	$.ajax({
			url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
			myURL
			+'"&format=json&callback=',
			type: 'GET',
			dataType: 'json',
			success: function(data){
				if(data){
					var txs = data['query']['results']['json']['txes'];
					var result = parseTxs(txs,address);
					var balance = bignum2btcstr(result.balance);
					unspenttxs = result.unspenttxs;
		
					var sendXGCAmount = $("#sendXGCAmount").val();
					$("#sendXGCAmount").val(parseFloat(sendXGCAmount).toFixed(8));
					var sendXGCFee = $("#sendXGCFee").val();
					$("#sendXGCFee").val(parseFloat(sendXGCFee).toFixed(8));
					var XGCBalance = $("#XGCBalance").val();
					var totalXGCAmount = parseFloat(sendXGCAmount) + parseFloat(sendXGCFee);
					$("#totalXGCAmount").val(totalXGCAmount.toFixed(8));					
					
					var toAddress = $("#toAddress").val();
					var toAmount = $("#sendXGCAmount").val();
					var ownAddress = address;
					var XGCFee = $("#sendXGCFee").val();
/*
					console.log("Address");
					console.log(toAddress);
					console.log("toAmount");
					console.log(toAmount);
					console.log("toFee");
					console.log(XGCFee);
*/
					var tx = createSend(toAddress, ownAddress, btcstr2bignum(toAmount), btcstr2bignum(XGCFee));					
//					console.log("tx");
//					console.log(tx);
					var s = tx.serialize();
					var  myURL = 'https://xgcwallet.org/ex/pushtx/%3F\
											tx='+Crypto.util.bytesToHex(s);
					
//					console.debug(s);
	$.ajax({
			url: 'http://query.yahooapis.com/v1/public/yql?q=select * from json where url="'+
			myURL
			+'"&format=json&callback=',
			type: 'GET',
			dataType: 'json',
			success: function(data){
				if(data){
					if(data['query']['results']['json']['success']==1){
						alert("Transaction:" + data['query']['results']['json']['txid']);
						app.index();
					}else{
						alert("Unable to send! Try again");
					}
				}}});

//					document.resultForm.Transaction.value = Crypto.util.bytesToHex(s);

				}
				
		}});
}

function endian(string) {
	if(string==null){return;}
	var out = []
	for(var i = string.length; i > 0; i-=2) {
		out.push(string.substring(i-2,i));
	}
	return out.join("");
}


function bignum2btcstr(satoshi) {
	var s = String(satoshi);
	if (satoshi >= 100000000) {
		var i = s.length - 8;
		return s.substr(0, i) + "." + s.substr(i);
	} else {
		var i = 8 - s.length;
		return "0." + Array(i + 1).join("0") + s;
	}
}

function btcstr2bignum(btc) {
	var i = btc.indexOf('.');
	var value = new BigInteger(btc.replace(/\./,''));
	var diff = 9 - (btc.length - i);
	if (i == -1) {
		var mul = "100000000";
	} else if (diff < 0) {
		return value.divide(new BigInteger(Math.pow(10,-1*diff).toString()));
	} else {
		var mul = Math.pow(10,diff).toString();
	}
		return value.multiply(new BigInteger(mul));
}

function parseScript(script) {
	var newScript = new Bitcoin.Script();
	var s = script.split(" ");
	for (var i in s) {
		if(i!='remove'){
			if (Bitcoin.Opcode.map.hasOwnProperty(s[i])){
				newScript.writeOp(Bitcoin.Opcode.map[s[i]]);
			} else {
				newScript.writeBytes(Crypto.util.hexToBytes(s[i]));
			}
		}
	}
	return newScript;
}

function priv2key(privBase58) {
	var bytes = Bitcoin.Base58.decode(privBase58);
	var hash = bytes.slice(0, 33);

	var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});
	if (checksum[0] != bytes[33] ||
		checksum[1] != bytes[34] ||
		checksum[2] != bytes[35] ||
		checksum[3] != bytes[36]) {
		throw "Checksum validation failed!";
	}

	var version = hash.shift();

	if (version != 0x80) {
		throw "Version "+version+" not supported!";
	}

	var key = new Bitcoin.ECKey(hash);
	return key;
}

function parseTxs(data, address) {
	/* JSON structure:
		root
		 transaction hash
			hash (same as above)
			version
			number of inputs
			number of outputs
			lock time
			size (bytes)
			inputs
			 previous output
				hash of previous transaction
				index of previous output
			 scriptsig (replaced by "coinbase" on generation inputs)
			 sequence (only when the sequence is non-default)
			 address (on address transactions only!)
			outputs
			 value
			 scriptpubkey
			 address (on address transactions only!)
			block hash
			block number
			block time
	*/
	var address = address.toString();
	var tmp = data;
	var txs = [];
	for (var a in tmp) {
		if (!tmp.hasOwnProperty(a))
			continue;
		a = a.replace("X","");
//		console.log(a);
		txs.push(tmp["X"+a]);
	}
	
	// Sort chronologically
	txs.sort(function(a,b) {
		if (a.time > b.time) return 1;
		else if (a.time < b.time) return -1;
		return 0;
	})
//	console.log(txs);
	delete unspenttxs;
	var unspenttxs = {}; // { "<hash>": { <output index>: { amount:<amount>, script:<script> }}}

	var balance = BigInteger.ZERO;

	// Enumerate the transactions 
	for (var a in txs) {
	
		if (!txs.hasOwnProperty(a))
			continue;
		var tx = txs[a];
//		console.log(tx.hash);
		if (tx.ver != 1) throw "Unknown version found. Expected version 1, found version "+tx.ver;
		
		// Enumerate inputs
		for (var b in tx.in ) {
			if (!tx.in.hasOwnProperty(b))
				continue;
//			console.log(b);
			var input = tx.in[b];
//			console.log(input);
			var p = input;//.prev_out;
			//alert(p);
			
			var lilendHash = endian(p.hash)
			// if this came from a transaction to our address...
			if (lilendHash in unspenttxs) {
				unspenttx = unspenttxs[lilendHash];
				// remove from unspent transactions, and deduce the amount from the balance
//				console.log(unspenttx[1]);
				balance = balance.subtract(unspenttx[p.n].amount);
				delete unspenttx[p.n]
				if (isEmpty(unspenttx)) {
					delete unspenttxs[lilendHash]
				}
			}
			
		}
		
		// Enumerate outputs
		var i = 0;
		for (var b in tx.out) {
			if (!tx.out.hasOwnProperty(b))
				continue;
				
			var output = tx.out[b];
			
			// if this was sent to our address...
			if (output.address == address) {
				// remember the transaction, index, amount, and script, and add the amount to the wallet balance
//				alert(output.value);
				var value = btcstr2bignum(output.value);
				var lilendHash = endian(tx.hash)
				if (!(lilendHash in unspenttxs))
					unspenttxs[lilendHash] = {};
				unspenttxs[lilendHash][i] = {amount: value, script: output.scriptPubKey};
				balance = balance.add(value);
			}
			i = i + 1;
		}
	}
//	console.log(unspenttxs);
	return {balance:balance, unspenttxs:unspenttxs};
}

function createKeys(record,recordid,xemail,xphone,xcode,xwalletid,email,phone,code,walletid,password){
/*	
	alert("record: "+record);
	alert("recordid: "+recordid);
	alert("xemail: "+xemail);
	alert("xphone: "+xphone);
	alert("xcode: "+xcode);
	alert("xwalletid: "+xwalletid);
	alert("email: "+email);
	alert("phone: "+phone);
	alert("code: "+code);
	alert("walletid: "+walletid);
	alert("password: "+password);
*/
		var keys = btc.keys(Crypto.SHA256(record + recordid + xemail + xphone + xcode + xwalletid + password + Crypto.SHA256(record + recordid + email + phone + code + walletid + password)));
		//var greencoinAddress = keys.pubkey.toString();	
		//var privkey = keys.privkey.toString();
		return keys;
}

function createSend(address, changeAddress, sendValue, feeValue) {
		changeAddress = new Bitcoin.Address(changeAddress);
		address = new Bitcoin.Address(address);
//	console.log('changeAddress');
//	console.log(changeAddress);
//	console.log('Address');
//	console.log(address);

		var selectedOuts = [];
  var txValue = sendValue.add(feeValue);
//	console.log('txValue');
//	console.log(txValue);
		
		var availableValue = BigInteger.ZERO;
//	console.log('availableValue');
//	console.log(availableValue);
		
		for (var hash in unspenttxs) {
			if (!unspenttxs.hasOwnProperty(hash))
				continue;
			for (var index in unspenttxs[hash]) {
				if (!unspenttxs[hash].hasOwnProperty(index))
					continue;
				var script = parseScript(unspenttxs[hash][index].script);
				var b64hash = Crypto.util.bytesToBase64(Crypto.util.hexToBytes(hash));
				selectedOuts.push(new Bitcoin.TransactionIn({outpoint: {hash: b64hash, index: index}, script: script, sequence: 4294967295}));
				availableValue = availableValue.add(unspenttxs[hash][index].amount);
				if (availableValue.compareTo(txValue) >= 0) break;
			}
		}
		
		
//		console.log (bignum2btcstr(availableValue));
//		console.log(bignum2btcstr(txValue));
		if (availableValue.compareTo(txValue) < 0) {
				throw new Error('Insufficient funds.');
		}


		var changeValue = availableValue.subtract(txValue);

		var sendTx = new Bitcoin.Transaction();

		for (var i = 0; i < selectedOuts.length; i++) {
			sendTx.addInput(selectedOuts[i]);
		}
//		console.log("add one output");
//console.log(address);
//console.log(bignum2btcstr(sendValue));
		sendTx.addOutput(address, sendValue);
//console.log("addoutput change output ");		
//console.log(changeValue.compareTo(BigInteger.ZERO));
//console.log(changeAddress);
//console.log(bignum2btcstr(changeValue));

		if (changeValue.compareTo(BigInteger.ZERO) > 0) {
			//console.log("next");
			sendTx.addOutput(changeAddress, changeValue);
			
		}
		
//		console.log(sendTx);
		var hashType = 1; // SIGHASH_ALL
		
		for (var i = 0; i < sendTx.ins.length; i++) {
			var hash = sendTx.hashTransactionForSignature(selectedOuts[i].script, i, hashType);
//			console.log(hash);
			var pubKeyHash = selectedOuts[i].script.simpleOutPubKeyHash();
//			console.log(pubKeyHash);
			var signature = key.sign(hash);
//			console.log(signature);
			// Append hash type
			signature.push(parseInt(hashType));
//			console.log(sendTx.ins.length);
//			console.log(i);
			sendTx.ins[i].script = Bitcoin.Script.createInputScript(signature, key.getPub());
//			console.log(i);
		}

//		console.log(sendTx);
		
		return sendTx;
	};

app.initialize();