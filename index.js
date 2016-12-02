var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var cars = [];
var carsNextNum = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Welcome to my cars garage!');
});

	// GET /cars
	app.get('/cars', function(req, res){
		var count = 0;
		for(var i=0; i<cars.length; i++)
		{
		count=i+1;
		}
		console.log(count);
		res.send(JSON.stringify(cars,null,null,10)+"\n You have in a garage: "+count+" cars");
		console.log('Method Get for /cars working');
	});

			// GET /cars/:num
			app.get('/cars/num', function(req, res){
				var carsNum = parseInt(req.cars.num, 10);
				var matchedCars = _.findWhere(cars, {num: carsNum});

				if(matchedCars){
					res.json(matchedCars);
				}else{
					res.status(404).send();
				}
				console.log('Method Get for /cars/:num working');
			});
							// POST /cars
							app.post('/cars', function(req, res){
								var body = _.pick(req.body, 'name','type', 'number');

								if(!_.isString(body.name) || !_.isString(body.type) ||!_.isString(body.number) ||body.number.trim().length === 0){
									return res.status(400).send();
								}
								body.num = carsNextNum++;
								cars.push(body);
								res.json(body);
								console.log('Method Post for /cars working');
							});
										//Delete/cars/:num
										app.delete('/cars/:num', function(req,res){
											var carsNum = parseInt(req.params.num,10);
											var matchedCars = _.findWhere(cars, {num: carsNum});

											if(!matchedCars){
												res.status(404).json("Attention!: You have already deleted car with that num ");
											}else{
												cars = _.without(cars, matchedCars);
												res.json(matchedCars);
											}
											console.log('Method Delete for /cars/:id working');
										});

											app.listen(PORT, function(){
											console.log('Express listening on port ' + PORT + '!');
											});
