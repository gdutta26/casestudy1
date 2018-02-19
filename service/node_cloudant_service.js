var express  = require('express');
var request = require('request'); 
var multer = require ('multer');
var fs = require('fs');
var open = require('open');
var moment = require('moment');


//Cloudant documents
var userProfiles = require("../dao/user-profiles").db;
var fileupload = require("../dao/dhfi_references").db;




//Adding user profile
exports.addUserProfile = function(res, details, callback){
	
	console.log(details);
	var id="";
	userProfiles.insert(details, id, function(err, doc) {
        if (err) {
			console.log("==========ERROR=========");
            console.log(err);
            populateErrorResponse(500,"Failed to add User profile information", function(resp){
				callback(resp);
			});
        } else{
			console.log("==========Success=========");
			populateSuccessResponse(doc,"Successfully added User profile", function(resp){
				callback(resp);
			});
		}
    });
}

//File uploading
var saveAttachmentToDB = function(docId,filePath, fileName,rev){
    var deferred = Q.defer();
    var fileSize;
    var directories = [filePath, fileName];
    var directory = directories.join(path.sep);
    fs.stat(directory, function(error, stats){
        fileSize = stats["size"];
    });
    var mimetype = mime.lookup(fileName);
    fs.readFile(filePath+"/"+fileName, function (err, dataObj) {
        var newPath = config1.cloudantURIDB
        + docId
        + '/'
        + fileName
        + '?rev='
        + rev;
        var queryOptionNxt = {
                url : newPath,
                body : dataObj,
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : mimetype,
                    'Content-Length': fileSize
                },
                method : 'PUT'
        };
        request(queryOptionNxt,
                function(err,resp,text) {
            if (!err) {
                deferred.resolve({"msg" : "Success"});
            }
            if((JSON.parse(text)).error != "bad_request"){
                var revision = JSON.parse(text);
                deferred.resolve({"msg" : "Success"});
            }else{
                deferred.resolve(
                        {
                            "msg" : "Fail"
                        });
            }
        });
    });
    return deferred.promise;
};


exports.fetchUserProfiles = function(res, callback){
	
	userProfiles.list({include_docs: true}, function(err, data) {
		if (err) {
			console.log("==========ERROR=========");
            console.log(err);
            populateErrorResponse(500,"Failed to fetch User Profiles", function(resp){
				callback(resp);
			});
        } else{
			console.log("==========Success=========");
			populateSuccessResponse(data,"Successfully fetched user profiles", function(resp){
				callback(resp);
			});
		}
	});
}

exports.uploadFile = function(res, fileDetails, body, callback){
	var id="";
	var details = {};
	details.title = body.title;
	details.description = body.description;
	details.fileToUpload = body.fileToUpload;
	details.creationDate = new Date(new Date().getTime() + 10000);
	details.originalFileName = fileDetails.originalname;
	
	var arr = fileDetails.originalname.split(".");
	var fileExt = arr[arr.length-1];
	details.newFileName = moment(new Date().toISOString()).format('YYYYMMDDHHmmss')+'.'+fileExt;
	  fileupload.insert(details, id, function(err, doc) {
        if (err) {
			console.log("==========ERROR=========");
            console.log(err);
            populateErrorResponse(500,"Failed to add User profile information", function(resp){
				callback(resp);
			});
        } else{
			fs.readFile(fileDetails.path, function (err, dataObj) {
				var url = fileupload.config.url;
				url += "/dhfi_references/" + doc.id;
				url += "/" + encodeURIComponent(details.newFileName);
				url += "?rev=" + doc.rev;

				var headers = {
					'Content-Type': fileDetails.mimetype,
					'Content-Length': fileDetails.size
				};

				var requestOptions = {
					url: url,
					headers: headers,
					body: dataObj
				};

				request.put(requestOptions, function(err, response, body) {
					if (err) {
						populateErrorResponse(500,"Failed to Upload Attachment", function(resp){
							callback(resp);
						});
					}
					else {
						console.log("==========Success file uploaded=========");
						populateSuccessResponse(doc,"Successfully added User profile", function(resp){
							console.log(doc);
							callback(resp);
						});
					}
				});
			});
		}
    });   
}


//Adding user profile
exports.searchFiles = function(res, details, callback){
	
	var title = details.title;
	var cloudantquery = {
			"selector": {
			  "$or": [
						  { "title": { "$regex": title }},
						  { "description":  { "$regex": title }}
						]
			}
	  };

	  request({
			method: 'POST', 
			uri: fileupload.config.url+'/dhfi_references/_find', 
			json: true, 
			body: cloudantquery
	  }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				populateSuccessResponse(body,"Successfully fetched documents", function(resp){
					callback(resp);
				});
			}else{
				populateErrorResponse(500,"Failed fetch Attachments", function(resp){
					callback(resp);
				});
			}
	  });
}

exports.downloadFiles = function(res, details, callback){
	console.log(details);
	open(fileupload.config.url+'/dhfi_references/'+details.id+'/'+details.fileName);
	populateSuccessResponse("Successfully downloaded document","Successfully downloaded document", function(resp){
		callback(resp);
	});
}


function populateSuccessResponse(body, message, callback){
	var successResp={};
	successResp.status= 200;
	successResp.message= message;
	successResp.respBody = body;
	callback(successResp);
}

function populateErrorResponse(statusCode, message, callback){
	var faliureResp={};
	faliureResp.status= statusCode;
	faliureResp.message= message;
	callback(faliureResp);
}


