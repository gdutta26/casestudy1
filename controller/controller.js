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
    	
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
	app.post('/emailnotificationCron/attachmentUpload', multer({
		dest: __dirname+ '/attachment',
        rename: function (fieldname, filename) {
            return filename;
        },
     inMemory: true
     
	}).single("myfile"),function(request1, response1) {
		
		var newfile = new NewFile({
			fieldname: req.file.fieldname,
		    originalname: req.file.originalname,
		    destination:req.file.destination,
		    filename: req.file.filename,
		    path: req.file.path,
		    size: req.file.size
			
		}) 
		 newfile.save(function(err){
			    if (err){console.log(err)}
			    else {
			      res.redirect('/');
			    }
	    })
});
}