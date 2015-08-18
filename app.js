var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/School', function(err, db) {
    if(err) throw err;
    var students = db.collection('Students');
    var options = { 'sort' : [['Name', 1], ['Total', -1]] };
    var cursor = students.find({}, {}, options);  
    var previousStudent='';  	
    cursor.each(function(err, student) {
        if(err) throw err;		
        if(student == null) return db.close();
      		
		if(previousStudent != student.Name){
			previousStudent = student.Name;			
			var query = {_id: student._id };
			var operator = { $set: {highest_score: true}};			
			 db.collection('Students').update(query, operator, {'upsert' : true}, function(err, upserted){
                if(err) throw err;
				 
                console.dir("Successfully upserted "+upserted + " document!");
            });
		}
    });
});

// db.Students.update({highest_score:true}, {$unset : {highest_score:true}},{multi:true});
// db.Students.find({highest_score :{$exists: true}},{Name: true, Total: true, highest_score: true,_id: false});