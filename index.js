const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  mongoose = require('mongoose');
  models = require("./models"),
  bodyParser = require("body-parser"),
  uuid = require('uuid')


// Initialize express
const app = express();

const {check, validationResult} = require("express-validator");

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//CORS setting 
const cors = require('cors');
let allowedOrigins = [
  'http://localhost:8080', 
  'http://testsite.com', 
  'http://localhost:4200',
  'http://localhost:4200/welcome', 
  'https://myflixck.netlify.app'  
];

app.use(cors(
//   {
//   origin: (origin, callback) => {
//     if (!origin) {
//       return callback(null, true)
//     };
//     if (allowedOrigins.indexOf(origin) === -1) {
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }
));

//import auth.js file
let auth = require('./auth')(app);

// require Passport module and import passport.js file
const passport = require('passport');
require('./passport');

// add Schemea to the API
const Models=require('./models.js');

const Movie = models.Movie;
const Users = models.User;

//mongodb://127.0.0.1:27017/cfDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.1   
mongoose.connect("mongodb+srv://chakkapatsaran:Nanase1113@myflixck.cfrfcfk.mongodb.net/myFlixDB?retryWrites=true&w=majority",  { 
  useNewUrlParser: true, 
  useUnifiedTopology: true}).then(()=>{
  console.log('Db connected successfully')
});
mongoose.set('strictQuery', false);

//setiing Morgan
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});
app.use(morgan("combined", { stream: accessLogStream }));

//Serve static files
app.use(express.static("public"));

//Morgan middleware error handling function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

//POST request
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required and has to be more than five characters').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
  // Add a user to database
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
        .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Add a movie to a user's list of favorites
// app.post('/users/:Username/movies/:MovieID', (req, res) => {
//   Users.findOneAndUpdate({ Username: req.params.Username }, {
//      $push: { FavoriteMovies: req.params.MovieID }
//    },
//    { new: true }, // This line makes sure that the updated document is returned
//   (err, updatedUser) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     } else {
//       res.json(updatedUser);
//     }
//   });
// });

// Add a movie to a user's list of favorites
app.post('/users/:userId/movies/:movieId', passport.authenticate('jwt', {session: false }), (req, res) => {
  const{ userId, movieId}= req.params;

  let user= Users.findOne({_id: userId });
  let movie= Movies.findOne({_id: movieId });

  if (!user) {
      res.status(400).send('User not found');
  } else if (!movie) {
      res.status(400).send('Movie not found')
  } else {
      Users.findOneAndUpdate({_id: req.params.userId},{
          $addToSet: {
              FavoriteMovies: req.params.movieId
          },
      },
      {new: true}) //Returns updated object /*
      .then( (updatedUser) => {
          res.status(200).json(updatedUser);
      }).catch((err) => {
          console.error(err);
          res.status(500).send('Error: '+ err)
      });
  }
});

//GET movies old
// app.get("/movies", (req, res) => {
//   console.log("movi get")
//   Movies.find()
//     .then((movie) => {
//       console.log(movie)
//       res.status(201).json(movie);
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send('Error: ' + error);
//     });
// });

// Get movies new
app.get('/movies', passport.authenticate('jwt', {session: false }), (req,res) => {
  Movie.find()
      .then((movies) => {
          res.status(200).json(movies)
      });
})

// Get a movie by title old
// app.get('/movies/:Title', (req, res) => {
//   Movies.findOne({ Title: req.params.Title })
//     .then((movie) => {
//       res.json(movie);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });

// Get a movie by title old
app.get('/movies/:title', passport.authenticate('jwt', {session: false }), (req,res) => {
  const { title}= req.params;
  const movie= Movies.find({Title: title});

  if ( movie) {
      movie.then((specificMovie) => {
          res.status(200).json(specificMovie)
      })
  } else {
      res.status(400).send('Invalid movie title')
  }
})

// Get a Movie by Genre old
// app.get('/movies/genre/:genreName', (req, res) => {
//   Movies.findOne({ 'Genre.Name': req.params.genreName })
//     .then((movie) => {
//       res.json(movie.Genre);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });

// Get a Movie by Genre new
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false }), (req, res) => {
  const{ genreName}= req.params;
  
  const genreByName= Movies.find({"Genre.Name": genreName});
  
  if( genreByName) {
      genreByName.then((genreInfo) => {
      res.status(200).json(genreInfo[0].Genre);
      })
  }else {
      res.status(400).send('Invalid genre')
  }    
})

// Get a Movie by Director old
// app.get('/movies/directors/:directorName', (req, res) => {
//   Movies.findOne({ 'Director.Name': req.params.directorName })
//     .then((movie) => {
//       res.json(movie.Director);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// }); 

// Get a Movie by Director new
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false }), (req, res) => {
  const{ directorName}= req.params;
  
  const directorByName= Movies.find({"Director.Name": directorName});
  
  if(directorByName) {
      directorByName.then((directorInfo) => {
          res.status(200).json(directorInfo[0].Director);
          });
  }else {
      res.status(400).send('Invalid director')
  }    
})

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
// app.put('/users/:Username', (req, res) => {
//   Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
//     {
//       Username: req.body.Username,
//       Password: req.body.Password,
//       Email: req.body.Email,
//       Birthday: req.body.Birthday
//     }
//   },
//   { new: true }, // This line makes sure that the updated document is returned
//   (err, updatedUser) => {
//     if(err) {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     } else {
//       res.json(updatedUser);
//     }
//   });
// });

// PUT users
app.put('/users/:Username', passport.authenticate('jwt', {session: false }), [
  // Username should be required and should be minimum 5 characters long
  check('Username', 'Username is required and has to be minimum five characters long').isLength({min: 5}),
  // Username should be only alphanumeric characters
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  // Password is required
  check('Password', 'Password is required').not().isEmpty(),
  // Email is required and should be valid
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  // check the validation object for errors
  let errors= validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array() });
  }

  //Update user info
  let hashedPassword= Users.hashPassword(req.body.Password)

  Users.findOneAndUpdate({Username: req.params.Username }, { $set:
          {
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
          }
      },
      {new: true}
  ).then((updatedUser) => {
          res.status(200).json(updatedUser)
  }).catch((err) => {
      if(err) {
          res.status(400).send('User couldn\'t be updated: ' + err)
      } 
  })
})

// PUT Favorite movies
app.put('/users/:userId/movies/:movieId', passport.authenticate('jwt', {session: false }), (req, res) => {
  const{ userId, movieId}= req.params;

  let user= Users.findOne({_id: userId });
  let movie= Movies.findOne({_id: movieId });
  
  if (!user) {
      res.status(400).send('User not found');
  } else if (!movie) {
      res.status(400).send('Movie not found')
  } else {
      Users.findOneAndUpdate({_id: req.params.userId},{
          $pull: {
          FavoriteMovies: req.params.movieId
          }
      },
      {new: true}
      ).then( (updatedUser) => {
          res.status(200).json({updatedUser});
      }).catch((err) => {
          console.error(err);
          res.status(500).send('Error: '+ err)
      });
  }
});

// Get all users
app.get('/users', passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});









// Delete a user by username old
// app.delete('/users/:Username', (req, res) => {
//   Users.findOneAndRemove({ Username: req.params.Username })
//     .then((user) => {
//       if (!user) {
//         res.status(400).send(req.params.Username + ' was not found');
//       } else {
//         res.status(200).send(req.params.Username + ' was deleted.');
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });

//DELETE userID
app.delete('/users/:id', passport.authenticate('jwt', {session: false }), (req, res) => {
  const{ id}= req.params;

  let user= Users.find({_id: id});

  Users.findOneAndRemove({_id: id}).then(user => {
      if ( user) {
      res.status(200).send(`user ${id} has been deleted`);
      } else{
      res.status(400).send('User not found')
      }
  })
})


// DELETE a movie to a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
})

//mongoimport --uri mongodb+srv://chakkapatsaran:Nanase1113@myflixck.cfrfcfk.mongodb.net/myFlixDB --collection users --jsonArray --file "C:\Users\benja\Desktop\CareerFoundry\Full-Stack Immersion\Achievement2\my-flix-v2\myFlix-Application\exported_collections\users.json"
//Listening request post 8080
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});