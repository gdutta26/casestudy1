var services = require("../service/node_cloudant_service");
var bodyParser  = require("body-parser");
var multer = require("multer");



// all service Request comes here
module.exports = function(app) {

	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/api/addCustomerDetails', function(req , res){
           var details = req.body;
            services.addUserProfile(res, details , function (found) {
                res.json(found);    
                res.end();
            });            
    });
	
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.get('/api/getCustomerDetails', function(req , res){
            services.fetchUserProfiles(res, function (found) {
                res.json(found);    
                res.end();
            });            
    });/* 
    
    //router.post('/emailnotificationCron/attachmentUpload', multer({
    	 app.post('/emailnotificationCron/attachmentUpload', multer({
        //dest: path.join(__dirname, '../attachment'),
        dest: __dirname+ '/attachment',
        rename: function (fieldname, filename) {
            return filename;
        },
        onFileUploadStart: function (file) {
        },
        onFileUploadData: function (file, data, req, res) {
        },
        onFileUploadComplete: function (file, req, res) {
            var response = {};
            var userid = req.body.userid;
            var buff = new Buffer(file.buffer, 'base64');
            getDir().then(function(filePath){
                fs.writeFile(filePath+"/"+file.name, buff, function(err){
                    if (err) throw err
                    fetchUserDoc(userid).then(function(userDocData){
                        var rev = userDocData["rev"];
                        var docId = "cat_user_"+userid.toUpperCase();
                        saveAttachmentToDB(docId,filePath,file.name,rev).then(function(responseSave){
                            response.totalfilepath = config1["cloudantURIDB"]+"/"+docId+"/"+file.name;
                            response.filename = file.name;
                            res.status(200).send(response);
                        });
                    });
                });
            });
        },
        inMemory: true
    }),function(request1, response1) {
    }); */
    
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
	
	
	app.post('/emailnotificationCron/attachmentUpload', multer({
		dest: __dirname+ '/attachment',
        rename: function (fieldname, filename) {
            return filename;
        },
        onFileUploadStart: function (file) {
        },
        onFileUploadData: function (file, data, req, res) {
        },
        onFileUploadComplete: function (file, req, res) {
            var response = {};
            var userid = req.body.userid;
            var buff = new Buffer(file.buffer, 'base64');
            getDir().then(function(filePath){
                fs.writeFile(filePath+"/"+file.name, buff, function(err){
                    if (err) throw err
                    fetchUserDoc(userid).then(function(userDocData){
                        var rev = userDocData["rev"];
                        var docId = "cat_user_"+userid.toUpperCase();
                        saveAttachmentToDB(docId,filePath,file.name,rev).then(function(responseSave){
                            response.totalfilepath = config1["cloudantURIDB"]+"/"+docId+"/"+file.name;
                            response.filename = file.name;
                            res.status(200).send(response);
                        });
                    });
                });
            });
        },
        inMemory: true
	}).single("test"),function(request1, response1) {
    })
}