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
        // var match = '/.*req.query[\'query\'],*/'.toString();

        // var match = /^req.query[\'query\']$/i;
        // var match = new RegExp([".*", req.query['query'], ".*"].join(""));
        var regex = new RegExp(["^.*", req.query['query'], ".*$"].join(""), "gi");
        // var finalRegex = new RegExp(match.source + "|" + regex.source);
        // console.log(finalRegex);
        Movie.find({
            // _id: req.query['query']
            // /^bar$/i
            title: regex
        }, (err, movie) => {
            if(err)
                res.send(err);
            // console.log('movie ' + show);
            array_of_searches.push(movie);
            res.json(array_of_searches)
        });
        // console.log(array_of_searches);
        console.log(req.query['query']);


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