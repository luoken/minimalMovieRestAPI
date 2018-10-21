/*
/movie/${id} when given the appropriate id, will yield the movie matching that identifier (more on where that id comes from shortly).
/show/${id} when given the appropriate id, will yield the show matching that identifier.
The above endpoints should contain, at minimum, the title, release year, and a synopsis of the media item being displayed.
/search when given a `?query=${some title}`, will yield any movies or shows matching that title, returning a JSON of matching titles, the years the media items were released, and whether each media item is a movie or a show. These results should be paginated.
*/

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Show = require('./app/model/show');
var Movie = require('./app/model/movie');

// to automate some stuff
var request = require('request');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
mongoose.connect('mongodb://admin:temppass1@ds137263.mlab.com:37263/moviemeapi', {useNewUrlParser: true});

var router = express.Router();

router.get('/', function(req, res){
    res.json({message: 'api working'});
});

router.route('/show')
    .post(function(req, res){
        var show = new Show();
        show.title = req.body.title;
        show.release_year = req.body.release_year;
        show.synopsis = req.body.synopsis;
        show._id = req.body.id;
        show.save(function(err){
            if(err)
                res.send(err);
            res.json({message: 'Show saved'});
        });
    })
    .get(function(req, res){
        Show.find(function(err, shows){
            if(err)
                res.send(err);
            res.json(shows);
        });
    });

router.route('/movie')
    .post(function(req, res){
        var movie = new Movie();
        movie.title = req.body.title;
        movie.release_year = req.body.release_year;
        movie.synopsis = req.body.synopsis;
        movie._id = req.body.id;
        movie.save(function(err){
            if(err)
                res.send(err);
            res.json({message: 'movie saved'});
        });
    })
    .get(function(req, res){
        Movie.find(function(err, movie){
            if(err)
                res.send(err);
            res.json(movie);
        });
    });

router.route('/show/:show_id')
    .delete(function(req, res){
        Show.remove({
            _id: req.params.show_id
        }, function(err, show){
            if(err)
                res.send(err)
            res.json({message: 'Deleted the show'});
        });
    })
    .get(function(req, res){
        Show.find({
            _id: req.params.show_id
        }, function(err, show){
            if(err)
                res.send(err);
            res.json(show);
        });
    });

app.use('/api', router);

app.listen(port);
console.log('api running on ' + port);