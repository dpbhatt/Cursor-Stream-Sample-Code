var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/School', function(err, db) {
    if(err) throw err;
    var Students = db.collection('Students');
    var options = { 'sort' : [['Name', 1], ['Total', -1]] };
    var cursor = Students.find({}, {}, options);  
    var previousStudent ='';  	
	cursor.on("end", function(){
		db.close();
	});	
	cursor.on("err", function(){
		console.dir("Error on:" + err);
		throw err;
	});	
	cursor.on("data", function(Student){
		cursor.pause();
		if(previousStudent != Student.Name){
			previousStudent = Student.Name;
			var query = { _id: Student._id};
			var operator = {$set: {highest_score: true}};			
			db.collection('Students').update(query, operator, {'upsert' : true}, function(err, upserted){
              if(err){
					console.dir('Error : '+ err);
					throw err;
				} 
                console.dir("Successfully upserted "+ upserted + " document!");
				cursor.resume();
            });
		} else{
				cursor.resume();
		}
	});
});