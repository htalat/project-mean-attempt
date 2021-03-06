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
    next();
});


router.get('/',function(req,res){
    res.json({message: 'index page.'});
})

router.route('/items')

    // create a item (accessed at POST http://localhost:8080/api/items)
    .post(function(req, res) {
        console.log(req.body);
        var item = new Item();    
        item.name     = req.body.name; 
        item.quantity = req.body.quantity;
        item.price    = req.body.price;
        
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
   	
    		Item.findById(req.params.item_id,function(err,item){
    			if(err)
    				res.send(err);
    			res.json(item);
    		});
    	})
    	
    	.put(function(req, res) {

        // use our item model to find the item we want
        console.log("ITEM_ID:" + req.params.item_id);
        Item.findById(req.params.item_id, function(err, item) {

            if (err)
                res.send(err);

            console.log(req.body);
            item.name = req.body.name; 
            item.quantity = req.body.quantity;
            item.price = req.body.price;
            
            item.save(function(err) 
            {
                if (err)
                    res.send(err);

                res.json({ message: 'Item updated!' });
            });

        });
    })
    
   .delete(function(req, res) {
   	
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