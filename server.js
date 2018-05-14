// The basic packages initialize
const express = require('express');
const app = express();
const request = require("request");

app.use(express.static('public'));
app.set('view engine', 'ejs');

// <----------------------------------------------------------> 
app.get('/', (req, res) => {
    // Index page from a bunch of movies, I think based on most recent from movie api.
    getMovies(null, null, false,function(response){
        res.render( 'index', {movieId: response} );
    });
});



// <----------------------------------------------------------> 
app.get('/movie/:movieId', (req, res) => {
    // Dynamic route to get to a specific movie page
    console.log(req.params);
    
    let desiredMovieID = Number(req.params.movieId);
    console.log('number',desiredMovieID)
    
    // Call the getMovies function here to grab the array of movies
    getMovies(res, desiredMovieID, true, function(response) {
        let targetMovie;
        console.log("$$$$$this fucking",response[0].id)
        // console.log('numbers', desiredMovieID)
        for(let i=0; i<response.length; i++){
            if(response[i].id === desiredMovieID) {
                targetMovie = response[i];
                console.log('movie is',targetMovie)
            }
        }
        res.render('movie',{movieId:targetMovie} );      
        
    });
});

// <----------------------------------------------------------> 
app.get('/search', (req, res) => {
    // Search get request to return back the list of movies to the user
    
    // This is where you can grab the title name from the search bar
    let movieTitle = req.query.search;
    let movie_api_search = "https://api.themoviedb.org/3/search/movie?api_key=b63d3469e5097ab8b4f52fe09faee7b9&language=en-US&query=" + movieTitle + "&page=1&include_adult=false"
    // console.log(movie_api_search);
    request.get(movie_api_search, function(error, response, body) {
        
        // Run some basic checks for error and response
        // if (!error){
        //         run success stuff
        // } else {
        //     handle error
        // }

        // if (error){
        //     handle error
        // } else {
        //     handle success
        // }


        if( response.statusCode == 200) {

            // Turns the body in a javascript object.
            let movie_obj = JSON.parse(body);

            // Checks to see if user entered a movie that exists or not
            // Didn't realize in javascript you have to be so fucking explicit to check 
            // if its a empty array. 
            if ( movie_obj.results[0] && movie_obj.results[0]) {
                res.render('search', {movieId: movie_obj.results} );
            } 

            // For some reason won't get to this case
            else {
                console.log("There is no such movies");
                res.send('error')    
            }
        } else if (error){
            console.log(error)
        }
    });
});

// <----------------------------------------------------------> 
app.listen(8000,()=> {
    // Server set up listening on port 8080

    console.log('Server Started on http://localhost:8080')
    console.log("Press CTRL + C to stop server")
});

// <----------------------------------------------------------> 
function getMovies(res=null, movieTitle=null, search=false, callback) {
    // This function parses out the movie_obj to get the key value pair of the summery key and the value which is the description
    // of the plot.  I couldn't figure out way to do it with just one movie plot function so fuck it, decided not use DRY style.
    // parameters res: response from the server.
    // parameters movieTitle: a string input from user movie title.
    // parameters search: a boolean value to turn off or on the if statments.
    // parameter callback: a anonymous function to get back data from the getMOives function.

    if (search) { 
        const request = require("request");
        
        // let movie_api_search = "https://api.themoviedb.org/3/search/movie?api_key=b63d3469e5097ab8b4f52fe09faee7b9&language=en-US&query=" + movieTitle + "&page=1&include_adult=false"
        let movie_api_details = "https://api.themoviedb.org/3/movie/" + movieTitle + "?api_key=b63d3469e5097ab8b4f52fe09faee7b9&language=en-US"
        console.log(movie_api_details)
        request.get(movie_api_details, function(error, response, body) {
            
            // Run some basic checks for error and response
            if (!error && response.statusCode == 200) {
    
                // Turns the body in a javascript object.
                let movie_obj = JSON.parse(body);
                console.log(movie_obj)
                // Checks to see if user entered a movie that exists or not
                // Didn't realize in javascript you have to be so fucking explicit to check 
                // if its a empty array. 
                if (typeof movie_obj !== undefined && movie_obj !== null) {
                    // return callback(movie_obj.results);
                    res.render('movie', {movieId: movie_obj} );
                } 
                
                else {
                    console.log("There is no such movies");
                     res.send('error')
                        
                }
            }
        });
    } 
    
    else {
        const request = require("request");
                
        let movie_api_url = "https://api.themoviedb.org/3/discover/movie?api_key=b63d3469e5097ab8b4f52fe09faee7b9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
        
        request.get(movie_api_url, function(error, response, body){
            // Run some basic checks for error and response
            if (!error && response.statusCode == 200) {
            
                // Turns the body in a javascript object.
                let movie_obj = JSON.parse(body);
            
                // Checks to see if user entered a movie that exists or not
                // Didn't realize in javascript you have to be so fucking explicit to check 
                // if its a empty array. 
                if (typeof movie_obj.results[0] !== undefined && movie_obj.results[0] !== null) {
                    // console.log(movie_obj.results[0]);
                    return callback(movie_obj.results);
                } 
                
                else {
                    console.log("There is no such movies");
                }
            }        
    });
    }
}
