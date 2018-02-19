var services = require("../service/node_cloudant_service");
var bodyParser  = require("body-parser");
var multer = require("multer");
var request = require('request');
var path = require('path');
var upload = multer({ dest: 'uploads/' })


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
    app.get('/api/getCustomerDetails1', function(req , res){
        services.fetchUserProfiles(res, function (found) {
            res.json(found);
            res.end();
        });
    });

    app.post('/api/uploadFile', upload.single('upload'), function (req, res, next) {
		
		console.log(req.file);
		services.uploadFile(res, req.file , req.body, function (found) {
			res.json(found);    
			res.end();
		}); 
		
    }); 
	
	app.post('/api/uploadFile', upload.single('upload'), function (req, res, next) {
		
		console.log(req.file);
		services.uploadFile(res, req.file , req.body, function (found) {
			res.json(found);    
			res.end();
		}); 
		
    });
	
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/api/searchFiles', function(req , res){
           var details = req.body;
            services.searchFiles(res, details , function (found) {
                res.json(found);    
                res.end();
            });            
    });
	
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/api/downloadFiles', function(req , res){
			console.log("Within Controller");
			console.log(req.body);
           var details = req.body;
            services.downloadFiles(res, details , function (found) {
                res.json(found);    
                res.end();
            });            
    });

}