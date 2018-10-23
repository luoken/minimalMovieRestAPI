/*
/movie/${id} when given the appropriate id, will yield the movie matching that identifier (more on where that id comes from shortly).
/show/${id} when given the appropriate id, will yield the show matching that identifier.
The above endpoints should contain, at minimum, the title, release year, and a synopsis of the media item being displayed.
/search when given a `?query=${some title}`, will yield any movies or shows matching that title, returning a JSON of matching titles, the years the media items were released, and whether each media item is a movie or a show. These results should be paginated.
*/

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Show = require('./app/model/show');
const Movie = require('./app/model/movie');

// to automate some stuff
const request = require('request');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
mongoose.connect('mongodb://admin:temppass1@ds137263.mlab.com:37263/moviemeapi', {useNewUrlParser: true});

const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'api working'});
});

router.route('/show')
    .post((req, res)=> {
        let show = new Show();
        show.title = req.body.title;
        show.release_year = req.body.release_year;
        show.synopsis = req.body.synopsis;
        show._id = req.body.id;
        show.save(() => {
            if(err)
                res.send(err);
            res.json({message: 'Show saved'});
        });
    })
    .get((req, res) => {
        Show.find((err, shows) => {
            if(err)
                res.send(err);
            res.json(shows);
        });
    });

router.route('/movie')
    .post((req, res) => {
        let movie = new Movie();
        movie.title = req.body.title;
        movie.release_year = req.body.release_year;
        movie.synopsis = req.body.synopsis;
        movie._id = req.body.id;
        movie.save((err) => {
            if(err)
                res.send(err);
            res.json({message: 'movie saved'});
        });
    })
    .get((req, res) => {
        Movie.find((err, movie) => {
            if(err)
                res.send(err);
            res.send(movie);
        });
    });

router.route('/search')
    .get((req, res) => {
        let array_of_searches = [];
        var regex = new RegExp(["^.*", req.query['query'], ".*$"].join(""), "gi");
        Movie.find({
            title: regex
        }, (err, movie) => {
            if(err)
                res.send(err);
            
            movie.forEach((element) => {
                var movie_type = {
                    _id: element._id,
                    title: element.title,
                    synopsis: element.synopsis,
                    release_year: element.release_year,
                    type: 'Movie'
                }
                array_of_searches.push(movie_type);
            }); 
        });

        Show.find({
            title: regex
        }, (err, show) => {
            if(err)
                res.send(err);

            show.forEach((element) => {
                var show_type = {
                    _id: element._id,
                    title: element.title,
                    synopsis: element.synopsis,
                    release_year: element.release_year,
                    type: 'Show'
                }
                array_of_searches.push(show_type);
            });
            res.json(array_of_searches);
        });
    });


router.route('/movie/:movie_id')
    .get((req, res) => {
        Movie.find({
            _id: req.params.movie_id
        }, (err, movie) => {
            if(err)
                res.send(err);
            res.json(movie);
        });
    });


router.route('/show/:show_id')
    .get((req, res) => {
        Show.find({
            _id: req.params.show_id
        }, (err, show) => {
            if(err)
                res.send(err);
            res.json(show);
        });
    });

app.use('/api', router);

app.listen(port);
console.log('api running on ' + port);