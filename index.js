var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Item     = require('./app/models/item');



mongoose.connect('mongodb://localhost:27017/db', function(err) {
	if (err) {
		console.error('Could not connect to MongoDB!');
		console.log(err);
	}else
	    console.log("connected to the database");
});



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {

    console.log('Something is happening.');
    console.log(req.params);
    next();
});


router.get('/',function(req,res){
    res.json({message: 'index page.'});
})

router.route('/items')

    // create a item (accessed at POST http://localhost:8080/api/items)
    .post(function(req, res) {
        
        var item = new Item();    
        item.name = req.body.name; 
        item.quantity = req.body.quantity;
        
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item created!' });
        });
        
    })
    
    .get(function(req,res){
    	Item.find(function(err,items){
    		if(err)
    			res.send(err);
    		
    		res.json(items);
    	});
    });
    
    
    router.route('/items/:item_id')
    	.get(function(req,res){
    	console.log(req);
   	console.log(req.params.item_id);   		
    		Item.findById(req.params.item_id,function(err,item){
    			if(err)
    				res.send(err);
    			res.json(item);
    		});
    	})
    	
    	.put(function(req, res) {

        // use our item model to find the item we want
        Item.findById(req.params.item_id, function(err, item) {

            if (err)
                res.send(err);

            item.name = req.body.name; 
            item.quantity = req.body.quantity; // update the items info

            // save the item
            item.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Item updated!' });
            });

        });
    })
    
   .delete(function(req, res) {
   	console.log(req);
   	console.log(req.params.item_id);
        Item.remove({
            _id: req.params.item_id
        }, function(err, item) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

    

app.use('/api',router);

app.listen(port);
console.log('magiccc:'+ port);