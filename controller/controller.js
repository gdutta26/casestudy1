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
    });
    
    router.post('/emailnotificationCron/attachmentUpload', multer({
        dest: path.join(__dirname, '../attachment'),
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
    });
    
}