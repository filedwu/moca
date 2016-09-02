var express = require('express')
var path = require('path')
var mongoose = require("mongoose")


var bodyParser = require('body-parser');


var Movie = require('./modules/movie')
var _ = require('underscore')
var port = process.env.PORT || 3000
var app = express()

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/movies')


app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname,"public")))



app.listen(port)

console.log('start at:'+ port)

//路由 index
app.get("/",function(req,res){

	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:"电影大世界",
			movies:movies
		})
	})
	
})

//路由 index-detail
app.get("/movie/:id",function(req,res){
	var id = req.params.id
	Movie.findById(id,function (err,movie) {
		// body...\
		if(err){
			console.log(err)
		}
		res.render('detail',{
			title:"详情页"+movie.title,
			movie : movie
		})
	})
	
})

//列表页

app.get("/admin/list",function(req,res){

	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:"列表页",
			movies:movies
		})
	})
})

//删除接口
app.delete("/admin/list",function (req,res) {
	var id = req.query.id 
	//console.log(req.query)
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({"success":1})
			}
		})
	}
})

//admin update movie
app.get("/admin/update/:id",function (req,res) {
	var id = req.params.id
	console.log(id+"---id")
	if(id){
		Movie.findById(id,function (err,movie) {
			res.render('admin',{
				title:"更新页电影"+ movie.title,
				movie:movie
			})
		})

	}
})


//admin post movies
app.post("/admin/movie/new",function (req,res) {
	
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	console.log('id:'+id);


	if( id ){
		
		Movie.findById(id,function (err,movie) {
			if(err){
				console.log(err)}
			
			_movie = _.extend(movie,movieObj)
			_movie.save(function (err,movie) {
				// body...
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+ movie._id)
			})

		})

	}
	else{
		console.log('add start');
		_movie = new Movie({
			title : movieObj.title,
			doctor : movieObj.doctor,
			year : movieObj.year,
			language : movieObj.language,
			country : movieObj.country,
			summary : movieObj.summary,
			flash : movieObj.flash,
			poster : movieObj.poster
		})
		_movie.save(function (err,movie) {
			// body...
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+ movie._id)
		})
	}
})


app.get("/admin/movie",function(req,res){
	res.render('admin',{
		title:"录入页",
		movie:{
			title : '',
			doctor : '',
			year : '',
			language : '',
			summary : '',
			country : '',
			flash : '',
			poster : ''
		}
	})
})
