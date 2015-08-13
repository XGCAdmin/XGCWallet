html5sql.openDatabase("com.greencoinx.data", "GreenCoinXAddress", 3*1024*1024);

function checkDB(){
	html5sql.process(
	[
	"CREATE TABLE if not exists addresses (id INTEGER PRIMARY KEY, address TEXT, privkey TEXT);",
	"SELECT * FROM addresses;"
	],
	function(transaction, results, rowsArray){
		if(rowsArray.length > 1){
//			readDB();
		}else{
			//do nothing....
			console.log("No Data...");
		}
	}, catchError);
}

function readDB(){
	html5sql.process(
	[
	"SELECT * FROM addresses ORDER BY id desc;",
	],
	function(transaction, results, rowsArray){
		var xhtml = '';
		for(var i=0; i<rowsArray.length; i++){
			var id = rowsArray[i].id;
			var address = rowsArray[i].address;
			// qrcode
			var qrCode = qr_code.qrcode(7, 'L');
			var text = address.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
			qrCode.addData(text);
			qrCode.make();
			// qrcode
			
			
			xhtml += '<li class="table-view-cell"><code><a href="#" data-id="' + id + '" onclick="app.ShowDetails(this.name);" name="' + address + '">' + address + '</a></code></li>';
			xhtml += '<li class="table-view-cell" style="text-align:center;">'+qrCode.createImgTag(4)+'</li>';
		}
		$("#XGCAddresses").append(xhtml);	
	}, catchError);
}
function dropTables(){
	html5sql.process(
	[
	"DROP TABLE addresses;",
	],
	function(){
	console.log("Dropped!");
	}, catchError);
}

function addAddresses(address,privkey){
	html5sql.process(
	[
	"INSERT INTO addresses (address,privkey) VALUES ('" + address + "','"+privkey+"');",
	],
	function(){
	$("#XGCAddresses").html("");
	readDB();
	}, catchError);
}

function catchError(error, statement){
	console.error("Error: " + error.message + " when processing " + statement);
}