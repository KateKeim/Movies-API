// const express = require("express"),
//     app = express(),
//     bodyParser = require("body-parser"),
//     uuid = require("uuid");
// const bcrypt = require("bcrypt")
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// let users = [
//     {
//         id: 1, 
//         name: "Kate",
//         favoriteMovies: []
//     },
//     {
//         id: 2, 
//         name: "Max",
//         favoriteMovies: ["Shutter"]
//     },
// ]



// let movies = [
//     {
//       "Title":"Be With Me",
//       "Description":"It premiered as the Director's Fortnight selection in the 2005 Cannes Film Festival. It was also the official entry from Singapore for the 78th Academy Awards in the foreign language category. In December 2005, the academy body disqualified the film on grounds that the dialogue is mainly in English.[1] Out of 93 minutes, the film only has two and a half minutes of dialogue.",
//       "Genre": {
//         "Name": "Drama",
//         "Description": "The film is inspired by the life of deaf-and-blind teacher Theresa Poh Lin Chan. Be with Me is the first film in Singapore to explicitly feature a lesbian relationship."
//       },
//       "Director": {
//         "Name": "Eric Khoo",
//         "Bio":" Eric Khoo was the youngest son of the 15 children of Tan Sri Khoo Teck Puat from his second wife Rose Marie Wee. His mother, who was a cinephile, introduced him to cinema when he was three years old. He later received his education at the United World College of South East Asia.Khoo's interest in film eventually led him to study cinematography at the City Art Institute in Sydney, Australia.",
//         "Birth":1965-03-27
//       },
//       "ImageURL":"https://4.bp.blogspot.com/_oSeTobTLgvo/S7lwp_SNj4I/AAAAAAAAAto/Fz1wSnZJhws/s1600/BeWithMe.jpg",
//       "Featured":false
//     },
//     {
//       "Title":"Shutter",
//       "Description":"Chattoe: Kot Tit Winyan, Shutter: Press to Capture Ghosts is a 2004 Thai supernatural horror film by Banjong Pisanthanakun and Parkpoom Wongpoom; starring Ananda Everingham, Natthaweeranuch Thongmee, and Achita Sikamana.",
//       "Genre": {
//         "Name": "Horror",
//         "Description": " It focuses on mysterious images seen in developed pictures. The film was a huge box office success, making it one of the best known horror films from Thailand and recognized worldwide."
//       },
//       "Director": {
//       "Name": "Banjong Pisanthanakun and Parkpoom Wongpoom",
//       "Bio":"He is a Thai filmmaker and screenwriter. He saw early success with his first two films, Shutter (2004) and Alone (2007), both horror films that he co-directed and co-wrote with Parkpoom Wongpoom. He also directed the 2013 comedy horror romance film Pee Mak, which became Thailand's highest-grossing film of all time, and the 2021 horror film The Medium, which was a commercial and critical success in South Korea. In addition to horror films, Bangjong directed the romance films Hello Stranger (2010)[2] and One Day (2016).",
//       "Birth":1979-09-11
//       },
//       "ImageURL":"https://en.wikipedia.org/wiki/Shutter_(2004_film)#/media/File:Shutterposter.jpg",
//       "Featured":false
//     },
//     {
//         "Title":"Inception",
//         "Description":"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
//         "Genre": {
//           "Name": "Action",
//           "Description": "Inception is a 2010 science fiction action film written and directed by Christopher Nolan"
//         },
//         "Director": {
//         "Name": "Christopher Nolan",
//         "Bio":"Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.",
//         "Birth":1970-07-30
//         },
//         "ImageURL":"https://www.imdb.com/title/tt1375666/mediaviewer/rm3426651392/?ref_=tt_ov_i",
//         "Featured":false
//     },
//     {
//         "Title":"Mad Max: Fury Road",
//         "Description":"In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max. ",
//         "Genre": {
//           "Name": "Action",
//           "Description": "Mad Max: Fury Road (2015) being hailed as amongst the greatest action films of all time."
//         },
//         "Director": {
//         "Name": "George Miller",
//         "Bio":"George Miller is an Australian film director, screenwriter, producer, and former medical doctor. In 2006, Miller won the Academy Award for Best Animated Feature for Happy Feet (2006).",
//         "Birth":1945-03-03
//         },
//         "ImageURL":"https://www.imdb.com/title/tt1392190/mediaviewer/rm3064749568/?ref_=tt_ov_i",
//         "Featured":false
//     },
//     {
//         "Title":"Interstellar",
//         "Description":"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
//         "Genre": {
//           "Name": "Sci-Fi",
//           "Description": "Interstellar is a 2014 epic science fiction film co-written, directed, and produced by Christopher Nolan. It stars Matthew McConaughey, Anne Hathaway, Jessica Chastain, Bill Irwin, Ellen Burstyn, Matt Damon, and Michael Caine. Set in a dystopian future where humanity is struggling to survive, the film follows a group of astronauts who travel through a wormhole near Saturn in search of a new home for mankind."
//         },
//         "Director": {
//             "Name": "Christopher Nolan",
//             "Bio":"Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.",
//             "Birth":1970-07-30
//         },
//         "ImageURL":"https://en.wikipedia.org/wiki/Interstellar_(film)#/media/File:Interstellar_film_poster.jpg",
//         "Featured":false
//     },
//   ]

//   //landing page
//   app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/documentation.html");
//   });

//   //Allow new users to register
//   app.post("/users", (req, res) => {
//     const newUser = req.body;

//     if (newUser.name) {
//         newUser.id = uuid.v4();
//         users.push(newUser);
//         res.status(201).json(newUser)
//     } else {
//         res.status(400).send("Please input user name")
//     }
//   });

//   //Allow users to update thir profile (userName, password, email, birthdate)
//   app.put("/users/:id", (req, res) => {
//     const { id } = req.params;
//     const updatedUser = req.body;

//     let user = users.find( user => user.id == id);

//     if(user) {
//         user.name = updatedUser.name;
//         res.status(200).json(user);
//     } else {
//         res.status(400).send("User not found")
//     }
//   });

//   //Allow users to add favorite movies
//   app.post("/users/:id/:movieTitle", (req, res) => {
//     const { id, movieTitle } = req.params;

//     let user = users.find( user => user.id == id );

//     if (user) {
//         user.favoriteMovies.push(movieTitle);
//         res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
//     } else {
//         res.status(400).send("User not found")
//     }
// });

// //Allow users to delete movies from favorite list
// app.delete("/users/:id/:movieTitle", (req, res) => {
//     const { id, movieTitle } = req.params;

//     let user = users.find( user => user.id == id );

//     if (user) {
//         user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
//         res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
//     } else {
//         res.status(404).send("User not found")
//     }
// })

// //Allow user to delete their id
// app.delete("/users/:id", (req, res) => {
//     const { id } = req.params;

//     let user = users.find( user => user.id == id );

//     if (user) {
//         users = users.filter( user => user.id != id);
//         res.status(200).send(`user ${id} has been deleted`);
//     } else {
//         res.status(404).send("User not found")
//     }
// })

// //READ - Return all movies to users
// app.get("/movies", (req, res) => {
//     res.status(200).json(movies);
// })

// //READ - Return data (description, genre, director, image URL, whether it’s featured or not)
// app.get("/movies/:title", (req, res) => {
//     const { title } = req.params;
//     const movie = movies.find( movie => movie.Title === title );

//     if (movie) {
//         res.status(200).json(movie);
//     } else {
//         res.status(404).send("Movie not found")
//     }
// })

// //READ - Return the genre
// app.get("/movies/genre/:genreName", (req, res) => {
//     const { genreName } = req.params;
//     const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

//     if (genre) {
//         res.status(200).json(genre);
//     } else {
//         res.status(404).send("Genre not found")
//     }
// })

// //READ - Return director data
// app.get('/movies/director/:directorName', (req, res) => {
//     const { directorName } = req.params;
//     const director = movies.find( movie => movie.Director.Name === directorName ).Director;

//     if (director) {
//         res.status(200).json(director);
//     } else {
//         res.status(404).send("Director not found")
//     }
// })

// //port to run app
// app.listen(8080, () => console.log("listening on 8080"))