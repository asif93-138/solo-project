import express, { Express, Request, Response } from "express";
import cors from 'cors';
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import sequelize from "./sequelize";
import User from "./../models/Users";
import Movie from "./../models/Movies";
import RR from "./../models/Ratings&Reviews";
import Genre from "./../models/Genre";
import MG from "./../models/MovieGenre";

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('DB testing!');
});

app.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  res.send('Got a POST request');
});

// Route: Insert a single user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    const dataObj = {user_id: users.length + 1, ...req.body};
    const user = await User.create(dataObj);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Route: Read a single user by ID
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Route: Read all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Route: Insert a single movie
app.post("/movies", async (req: Request, res: Response) => {
  try {
    const movies = await Movie.findAll();
    const dataObj = {movie_id: movies.length + 1, ...req.body};
    const movie = await Movie.create(dataObj);
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create movie" });
  }
});

// Route: Read a single movie by ID
app.get("/movies/:id", async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    // const movieNew = await Movie.findOne({ where: { title: 'Inception Updated' } });
    // console.log('movieNew :', movieNew);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

// Route: Update a single movie by ID
app.put(
  "/movies/:id",
  async (
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params; // Get movie ID from URL
      const updatedData = req.body; // Get new data from request body

      // Find the movie by ID
      const movie = await Movie.findByPk(id);

      if (!movie) {
        // If movie not found, return 404
        res.status(404).json({ error: "Movie not found" });
        return;
      }

      // Update the movie with the new data
      await movie.update(updatedData);

      // Return the updated movie
      res.status(200).json(movie);
    } catch (error) {
      console.error("Error updating movie:", error);
      res.status(500).json({ error: "Failed to update movie" });
    }
  }
);

// Route: Read all movies
app.get("/movies", async (req: Request, res: Response) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Route: Insert a single rr
app.post("/rrs", async (req: Request, res: Response) => {
  try {
    const rrs = await RR.findAll();
    const dataObj = {rr_id: rrs.length + 1, ...req.body};
    const rr = await RR.create(dataObj);
    res.status(201).json(rr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create rr" });
  }
});

// Route: Read a single rr by ID
app.get("/rrs/:id", async (req: Request, res: Response) => {
  try {
    const rr = await RR.findByPk(req.params.id);
    if (rr) {
      res.status(200).json(rr);
    } else {
      res.status(404).json({ error: "RR not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rr" });
  }
});

// Route: Update a single rr by ID
app.put(
  "/rrs/:id",
  async (
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params; // Get rr ID from URL
      const updatedData = req.body; // Get new data from request body

      // Find the rr by ID
      const rr = await RR.findByPk(id);

      if (!rr) {
        // If rr not found, return 404
        res.status(404).json({ error: "RR not found" });
        return;
      }

      // Update the rr with the new data
      await rr.update(updatedData);

      // Return the updated rr
      res.status(200).json(rr);
    } catch (error) {
      console.error("Error updating rr:", error);
      res.status(500).json({ error: "Failed to update rr" });
    }
  }
);

// Route: Read all rrs
app.get("/rrs", async (req: Request, res: Response) => {
  try {
    const rrs = await RR.findAll();
    res.status(200).json(rrs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rrs" });
  }
});

// Route: Insert a single genre
app.post("/genres", async (req: Request, res: Response) => {
  try {
    const genres = await Genre.findAll();
    const dataObj = {genre_id: genres.length + 1, ...req.body};
    const genre = await Genre.create(dataObj);
    res.status(201).json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create genre" });
  }
});

// Route: Read a single genre by ID
app.get("/genres/:id", async (req: Request, res: Response) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(404).json({ error: "Genre not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch genre" });
  }
});

// Route: Read all genres
app.get("/genres", async (req: Request, res: Response) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

// Route: Insert a single mg
app.post("/mgs", async (req: Request, res: Response) => {
  try {
    const mgs = await MG.findAll();
    const dataObj = {mg_id: mgs.length + 1, ...req.body};
    const mg = await MG.create(dataObj);
    res.status(201).json(mg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create mg" });
  }
});

// Route: Read a single mg by ID
app.get("/mgs/:id", async (req: Request, res: Response) => {
  try {
    const mg = await MG.findByPk(req.params.id);
    if (mg) {
      res.status(200).json(mg);
    } else {
      res.status(404).json({ error: "MG not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch mg" });
  }
});

// Route: Read all mgs
app.get("/mgs", async (req: Request, res: Response) => {
  try {
    const mgs = await MG.findAll();
    res.status(200).json(mgs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch mgs" });
  }
});

sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});


// {
//   "name": "Asif Iqbal",
//   "email": "ai@example.com",
//   "password": "1234"
// }

// {
//   "user_id": 1,
//   "title": "Inception",
//   "img": "https://image-url.com/inception.jpg",
//   "desc": "A mind-bending thriller.",
//   "release_yr": 2010,
//   "director": "Christopher Nolan",
//   "length": 148,
//   "producer": "Emma Thomas"
// }

// {
//   "rr_id": 1,
//   "movie_id": 1,
//   "user_id": 1,
//   "rating": 4.5,
//   "review": "Good Movie!"
// }

// {
//   "genre_id": 1,
//   "genre": "Horror"
// }

// {
//   "mg_id": 1,
//   "movie_id": 1,
//   "genre_id": 1
// }