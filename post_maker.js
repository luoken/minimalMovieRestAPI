var request = require('request');

// http://www.omdbapi.com/?t=iron%20man&apikey=b4c680f4

var array_of_movies = ['third watch', 'john doe', 'devious maids', 'the tick', 'goosebumps', 'mortal kombat: legacy', 'taxi', 'heroes', 'grimm', 'teen wolf', 'nip/tuck', 'dollhouse', '3rd rock from the sun', 'torchwood', 'leverage', 'hart of dixie', 'episodes', 'star wars: the clone wars', 'hey arnold!']

for(i = 0; i < array_of_movies.length; i++){
    request.get('http://www.omdbapi.com/?t=' + array_of_movies[i] + '&apikey=b4c680f4', (err, res, body) => {
        if(err || JSON.parse(body).Response == 'False' || JSON.parse(body).Type == 'movie'){
            console.log(err);
            console.log(JSON.parse(body).Title);
        }
        else{
            var b = JSON.parse(body);
            console.log(b.imdbID + '  ' + b.Title);
            request.post('http://localhost:8080/api/show', {
            json: {
                title: b.Title,
                release_year: b.Year.split('–')[0],
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
        }
    });
}




