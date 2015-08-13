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
		checkDB();
		app.index();
	},
	receivedEvent: function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');
		console.log('Received Event: ' + id);
		
	},
	index: function(){
//			localStorage.clear();
			readDB();
			email = localStorage[storage+".settings.email"];
			phone = localStorage[storage+".settings.phoneNumber"];
			html = '<div class="content-padded"> \
			<h1>Account</h1> \
			<div class="card" > \
				<ul class="table-view" id="XGCAddresses"> \
					<li class="table-view-cell table-view-divider">Your GreenCoinX accounts</li>';
			if(email === undefined || email === null){
				html += '<li class="table-view-cell" ><h4>Your wallet is unidentified!</h4></li>';
				html += '<li class="table-view-cell" ><h5>Click on Settings -> Identification and verify your email and phone to use GreenCoinX.</h5></li>';
			}else{
				html +=	'<li class="table-view-cell table-view-divider">Email: '+email+'</li> \
					<li class="table-view-cell table-view-divider">Phone: +'+phone+'</li>';
			}
				html+= '</ul></div> \
			</div> \
		<p>&nbsp;</p> \
		<p>&nbsp;</p> \
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
	ShowDetails: function(address){
		alert(address);
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
								htmlx += '<br><a href="#" onclick="app.SendCoins(this.name);" class="btn btn-positive btn-block" name="'+GreenCoinXaddress+'">Send GreenCoinX</a>';
								$("#ResultEmail").html(htmlx);
						}else{
							htmlx ='<h3 style="color:red">The email '+email+' is not registered with GreenCoinX.</h3>';
							$("#ResultEmail").html(htmlx);
						}
					},
						error: function(data){
							console.log(data);
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
								htmlx += '<br><a href="#" onclick="app.SendCoins(this.name);" class="btn btn-positive btn-block" name="'+GreenCoinXaddress+'">Send GreenCoinX</a>';
								$("#ResultPhone").html(htmlx);
						}else{
							htmlx ='<h3 style="color:red">The phone '+phone+' is not registered with GreenCoinX.</h3>';
							$("#ResultPhone").html(htmlx);
						}
					},
						error: function(data){
							console.log(data);
						}
				});
				return false;
	},
	SendCoins: function(GreenCoinXaddress){
			alert(GreenCoinXaddress);
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
		html = '<div class="content-padded"> \
			<h1>Send</h1> \
			<a href="#" class="btn btn-outlined btn-block" onclick="app.sendToEmail();">Send to Email</a> \
			<p>Send GreenCoinX to an email address</p>\
			<a href="#" class="btn btn-outlined btn-block" onclick="app.sendToPhone();">Send to Phone</a> \
			<p>Send GreenCoinX to a phone / mobile number</p>\
			<a href="#" class="btn btn-outlined btn-block" onclick="app.sendToAddress();">Send to GreenCoinX address</a> \
			<p>Send GreenCoinX to an address</p>\
			</div> \
			';
			$("#content").html(html);
	},
	receive: function(){
			email = localStorage[storage+".settings.email"];
			phone = localStorage[storage+".settings.phoneNumber"];

		html = '<div class="content-padded"> \
			<h1>Receive</h1> \
			<h3>Just give your email, phone or GreenCoinX address to receive coins.</h3>\
				<ul class="table-view" id="XGCAddresses"> \
					<li class="table-view-cell table-view-divider">Your GreenCoinX accounts</li>';
			if(email === undefined || email === null){
				html += '<li class="table-view-cell" ><h4>Your wallet is unidentified!</h4></li>';
				html += '<li class="table-view-cell" ><h5>Click on Settings -> Identification and verify your email and phone to use GreenCoinX.</h5></li>';
			}else{
				html +=	'<li class="table-view-cell table-view-divider">Email: '+email+'</li> \
					<li class="table-view-cell table-view-divider">Phone: '+phone+'</li>';
			}
				html+= '</ul></div> \
			</div> \
			';
			readDB();
			$("#content").html(html);
	},
	settings: function(){
			var email = localStorage[storage+".settings.email"];
			var phone = localStorage[storage+".settings.phoneNumber"];

			html = '<div class="content-padded"> \
			<h1>Settings</h1> \
			<a href="#" class="btn btn-outlined btn-block" onclick="app.identification();">Identification</a> \
			<p>With identification and verification you can use GreenCoinX to send, receive to your contact email and phone number. </p>\
			<a href="#" class="btn btn-outlined btn-block" onclick="app.wallet();">Wallet</a> \
			<p>Wallet settings help you decided transaction fees and sync to block chain.</p>\
			<a href="#" class="btn btn-outlined btn-block" onclick="app.remove();">Remove</a> \
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
	startverification: function(){
			var  myURL = "http://hitarth.org/code/index/"+MyIP;
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
							console.log(data);
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
							console.log(data);
						}
				});
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
							console.log(data);
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
							app.codeerror();
						}
					},
						error: function(data){
							console.log(data);
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
					app.addinfo();
				}else{
					html = '<div class="content-padded">Unable to verify phone, please connect to internet or try again!</div>';
					app.codeerror();
				}
			},
				error: function(data){
					console.log(data);
				}
		});		
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
			
			var keys = btc.keys(Crypto.SHA256(email+emailcode+phoneNumber+phonecode+code+Crypto.SHA256(email+phoneNumber+code)));
			var greencoinAddress = keys.pubkey.toString();	
			var privkey = keys.privkey.toString();
			var  myURL = "http://hitarth.org/verify/verified/"+code+"/"+emailcode+"/"+phonecode+"/"+greencoinAddress+'/'+addinfo;

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
					addAddresses(greencoinAddress,privkey);			
					app.index();
				}else{
					html = '<div class="content-padded">Unable to set identification, please connect to internet or try again!</div>';
					app.codeerror();
				}
			},
				error: function(data){
					console.log(data);
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
		dropTables();
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


app.initialize();