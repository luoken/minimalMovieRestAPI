var request = require('request');


// http://www.omdbapi.com/?t=iron%20man&apikey=b4c680f4

var movie_name = 'iron man';

// Request.get("http://httpbin.org/ip", (error, response, body) => {
//     if(error) {
//         return console.dir(error);
//     }
//     console.dir(JSON.parse(body));
// });


request.get('http://www.omdbapi.com/?t=' + movie_name + '&apikey=b4c680f4', (err, res, body) => {
    if(err)
        console.log(err);
    var b = JSON.parse(body);
    console.log(b.imdbID);
    request.post('http://localhost:8080/api/movie', {
    json: {
        title: b.Title,
        release_year: b.Year,
        synopsis: b.Plot,
        id: b.imdbID
    }
    
    }, function(err, res, body){
        if(!err && res.statusCode == 200){
            console.log(body);
        }
        else{
            console.log(err);
        }
    });
});



