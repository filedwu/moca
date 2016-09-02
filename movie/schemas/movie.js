var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
	title:String,
	doctor:String,
	language:String,
	country:String,
	summary:String,
	poster:String,
	flash:String,
	year:Number,
	meta:{
		createdAt:{
			type : Date ,
			default : Date.now()
		},
		updateAt:{
			type : Date,
			default : Date.now()
		}
	}
})

MovieSchema.pre('save',function (next) {
	if(this.isNew){
		this.meta.createdAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
	// body...
})


MovieSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updataAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.sort('meta.updataAt')
			.exec(cb)
	}
}

module.exports = MovieSchema