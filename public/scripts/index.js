

function addUser() {
	var requestJson = {};
	requestJson.firstName = document.getElementById('firstName').value;
	requestJson.lastName = document.getElementById('lastName').value;
	requestJson.company = document.getElementById('company').value;
	requestJson.city = document.getElementById('city').value;
	console.log("==========================");
	console.log(requestJson);
	if(requestJson.firstName == "" ){
		console.log()
		alert("First Name cannot be blank ");
		return;
	}else if(requestJson.lastName == "" ){
		console.log()
		alert("Last Name cannot be blank ");
		return;
	}else if(requestJson.company == "" ){
		console.log()
		alert("Email Id cannot be blank ");
		return;
	}else if(requestJson.city == "" ){
		console.log()
		alert("City cannot be blank ");
		return;
	}
	
     var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/addCustomerDetails", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			
			if(xhttp.status == 200){
				document.forms['userAdd'].reset()
				alert("User successfully added");
			}else{
				alert("Failed to add user. Try again");
			}
		}
	};
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(requestJson));
	
}

function uploadFile(){
	if(document.getElementById('title').value == "" ){
		alert("Title cannot be blank ");
		return false;
	}else if(document.getElementById('description').value == "" ){
		alert("Description cannot be blank ");
		return false;
	}else if(document.getElementById("upload").files[0] == undefined ){
		alert("No file selected");
		return false;
	}
	
	var data = new FormData();
	data.append("title",document.getElementById('title').value);
	data.append("description",document.getElementById('description').value);
	data.append("upload", document.getElementById("upload").files[0]);
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/uploadFile", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			if(xhttp.status == 200){
				document.forms['fileUploadForm'].reset()
				alert("File uploaded successfully");
			}else{
				alert("Failed to upload file. Try again");
			}
		}
	};
    xhttp.setRequestHeader("enctype", "multipart/form-data");
    xhttp.send(data); 
	return false;
}

function fetchUser() {
	//location.reload();
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "api/getCustomerDetails", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			console.log(xhttp);
			 
			if(xhttp.status == 200){
				var searchUserResp = JSON.parse(xhttp.responseText)
	
				var userCount  = searchUserResp.respBody.total_rows
				
				
				var searchTable = document.getElementById("searchTable");
				
				//searchTable.deleteRow(0); 
				
				while(searchTable.rows.length > 0) {
				  searchTable.deleteRow(0);
				}
				var row = searchTable.insertRow(0);
				row.innerHTML = '<td style="text-align:center;" colspan=4><button class="addBtn" class="searchUserTile" onclick="fetchUser()">Search</button> <button class="addBtn" class="searchUserTile" onclick="'+"location.href='index.html'"+'">Back</button></td>'
				if(userCount == 0){
					var row = searchTable.insertRow(0);
					row.innerHTML = '<td style="text-align:center;" colspan=4>No Records Available</td>'
				
				}
				for (var i = 0; i < userCount; i++) {
					
					var user = searchUserResp.respBody.rows[i];
					
					var rowNumber = document.getElementById("searchTable").rows.length; 
					console.log(rowNumber);
					var row = searchTable.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					cell1.innerHTML = user.doc.firstName;
					cell2.innerHTML = user.doc.lastName;
					cell3.innerHTML = user.doc.company;
					cell4.innerHTML = user.doc.city;
				}
				var header = searchTable.createTHead();
				var row = header.insertRow(0);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				cell1.innerHTML = "<b>First Name</b>";
				cell2.innerHTML = "<b>Last Name</b>";
				cell3.innerHTML = "<b>Company</b>";
				cell4.innerHTML = "<b>City</b>";
				row.style.backgroundColor = "black";
			}else{
				alert("Failed to fetch user details. Try again");
			} 
			
			
		}
	};
	
	xhttp.timeout = 100000;
	xhttp.send();
	
	
}

function searchFiles() {
	//location.reload();
	var requestJson = {};
	requestJson.title = document.getElementById('title').value;
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "api/searchFiles", true);
	xhttp.onreadystatechange = function(){
		//console.log(xhttp);
		 if(xhttp.readyState == 4){
			//console.log(xhttp);
			 
			if(xhttp.status == 200){
				var searchFilesResp = JSON.parse(xhttp.responseText)
				//console.log(searchFilesResp);
	
				var documentCount  = searchFilesResp.respBody.docs.length;
				
				
				var searchTable = document.getElementById("searchTable");
				
				//searchTable.deleteRow(0); 
				
				while(searchTable.rows.length > 0) {
				  searchTable.deleteRow(0);
				}
				var row = searchTable.insertRow(0);
				row.innerHTML = '<td style="text-align:center;" colspan=4> <button class="addBtn" class="searchUserTile" onclick="'+"location.href='fileSearch.html'"+'">Back</button></td>'
				if(documentCount == 0){
					var row = searchTable.insertRow(0);
					row.innerHTML = '<td style="text-align:center;" colspan=4>No Records Available</td>'
				
				}
				for (var i = 0; i < documentCount; i++) {
					
					var file = searchFilesResp.respBody.docs[i];
					
					var rowNumber = document.getElementById("searchTable").rows.length; 
					console.log(rowNumber);
					var row = searchTable.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					cell1.innerHTML = file.title;
					cell2.innerHTML = file.description;
					cell3.innerHTML = file.creationDate;
					/* cell4.innerHTML = ''file.newFileName; */
					//cell4.innerHTML = '<a href="#" onclick="downloadFiles();" title="My link title">'+file.newFileName+'</a>';
					cell4.innerHTML = '<a href=# onclick="return downloadFiles(\'' + file._id +'\',\'' + file.newFileName  +'\')">'+file.newFileName+'</a>';
				}
				var header = searchTable.createTHead();
				var row = header.insertRow(0);
				var cell1 = row.insertCell(0);	
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				cell1.innerHTML = "<b>Title</b>";
				cell2.innerHTML = "<b>Description</b>";
				cell3.innerHTML = "<b>Creation Date</b>";
				cell4.innerHTML = "<b>File Name</b>";
				row.style.backgroundColor = "black";
			}else{
				alert("Failed to fetch user details. Try again");
			} 
			
			
		} 
	};
	
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify(requestJson));
	
	
}

function downloadFiles(id, fileName) {
	var requestJson = {};
	requestJson.id = id;
	requestJson.fileName = fileName;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/downloadFiles", true);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			
			if(xhttp.status == 200){
				alert("Files downloaded successfully");
			}else{
				alert("Failed to download file");
			}
		}
	};
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(requestJson));
}