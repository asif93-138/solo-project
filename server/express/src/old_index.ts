// @ts-nocheck
import cors from "cors";
import path from "path";
import db from "./models";
import { ParsedQs } from "qs";
import User from "./models/Users";
import sequelize from "./models/sequelize";
import { Sequelize, Op } from "sequelize";
import userRoute from "./routes/userRoute";
import movieRoute from "./routes/movieRoute";
import reviewRoute from "./routes/reviewRoute";
import genreRoute from "./routes/genreRoute";
import uploadRoute from "./routes/uploadRoute";
import { ParamsDictionary } from "express-serve-static-core";
import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 3000;
const Movie = db.Movie;
const RR = db.RR;
const Genre = db.Genre;
const MG = db.MG;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoute);
app.use("/api/movie", movieRoute);
app.use("/api/review", reviewRoute);
app.use("/api/genre", genreRoute);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/upload", uploadRoute)

app.get("/", (req: Request, res: Response) => {
    res.send("DB testing!");
});

app.post("/", (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Got a POST request");
});

/* Route: Insert a single user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
}); 
*/

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

// Route: Read a single user by email
// app.get("/user/:id", async (req: Request, res: Response) => {
//   try {
//     const user = await User.findOne({ where: { email: req.params.id } });
//     // console.log('user :', user);
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch user" });
//   }
// });

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
    // console.log(req.body);
    const {
        user_id,
        title,
        img,
        desc,
        release_yr,
        director,
        length,
        producer,
        genre,
    } = req.body;

    try {
        const transaction = await sequelize.transaction();

        try {
            const movie = await Movie.create(
                { user_id, title, img, desc, release_yr, director, length, producer },
                { transaction }
            );

            // console.log("Created movie:", movie);
            // console.log("Movie ID:", movie.dataValues.movie_id);

            if (!movie.dataValues.movie_id) {
                throw new Error("Movie ID is null after creation");
            }

            const genreInstances = await Promise.all(
                genre.map(async (g: string) =>
                    Genre.findOrCreate({ where: { genre: g }, transaction })
                )
            );

            // Mapping through the genreInstances and using genreInstance correctly
            await Promise.all(
                genreInstances.map(async ([genreInstance]) =>
                    MG.create(
                        {
                            movie_id: movie.dataValues.movie_id,
                            genre_id: genreInstance.genre_id,
                        },
                        { transaction }
                    )
                )
            );

            await transaction.commit();
            res.status(201).json({ message: "Movie created successfully", movie });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error("Error during movie creation:", error);
        res.status(500).json({ error: "Failed to create movie" });
    }
});

// Route: Read a single movie by ID
app.get("/movies/:id", async (req: Request, res: Response) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }

        // Fetch all ratings for the movie
        const ratings = await RR.findAll({
            where: { movie_id: movie.dataValues.movie_id },
        });

        // Fetch the user who created the movie
        const user = await User.findOne({
            where: { user_id: movie.dataValues.user_id },
        });

        // Calculate the average rating
        const averageRating =
            ratings.reduce((sum, item) => sum + item.dataValues.rating, 0) /
            (ratings.length || 1); // Avoid division by zero

        // Fetch all genres associated with the movie
        const genres = await MG.findAll({
            where: { movie_id: movie.dataValues.movie_id },
            include: [{ model: Genre, attributes: ["genre"] }],
        });

        // Resolve reviews (rr array) with user data
        const rr = await Promise.all(
            ratings.map(async (rating) => {
                const user = await User.findOne({
                    where: { user_id: rating.dataValues.user_id },
                });
                return {
                    rr_id: rating?.dataValues.rr_id,
                    user_id: user?.dataValues.user_id,
                    user: user?.dataValues.name,
                    review: rating.dataValues.review,
                    rating: rating.dataValues.rating,
                };
            })
        );

        // Respond with the movie data
        res.status(200).json({
            ...movie.dataValues,
            rating: averageRating || null, // Handle no ratings gracefully
            genres: genres.map((x) => x.dataValues.Genre?.genre || "Unknown Genre"),
            user: user?.dataValues.name || "Unknown User", // Handle missing user gracefully
            rr,
        });
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

// Route: Delete a single movie by ID
app.delete("/movies/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get movie ID from URL

        // Delete the movie by ID
        const movie = await Movie.destroy({
            where: {
                movie_id: id,
            },
        });
        const rr = await RR.destroy({
            where: {
                movie_id: id,
            },
        });
        const mg = await MG.destroy({
            where: {
                movie_id: id,
            },
        });
        // console.log(movie, rr, mg);
        // Return the deleted movie
        res.status(200).json({ deleted: true });
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ error: "Failed to delete movie" });
    }
});

// Route: Search for movies by title
app.get("/search", async (req: Request, res: Response) => {
    try {
        const { title } = req.query; // Get the title from query parameters
        // console.log(title);
        // res.status(200).send(title);
        const movies = await Movie.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`, // Case-insensitive partial match
                },
            },
            attributes: {
                include: [
                    // Add the average rating as a computed field
                    [
                        Sequelize.fn("AVG", Sequelize.col("ratingsReviews.rating")),
                        "averageRating",
                    ],
                ],
            },
            include: [
                {
                    model: RR,
                    as: "ratingsReviews", // Match the alias defined in the associations
                    attributes: [], // Do not include all RR fields in the response
                },
                {
                    model: Genre,
                    as: "genres", // Match the alias for the many-to-many association
                    attributes: ["genre"], // Include only the genre name
                    through: { attributes: [] }, // Exclude junction table fields
                },
            ],
            group: ["Movie.movie_id", "genres.genre_id"], // Group by movie ID and genre ID
        });

        if (movies.length === 0) {
            res.status(404).json({ message: "No movies found" });
        } else {
            res.status(200).json(movies);
        }
    } catch (error) {
        console.error("Error searching for movies:", error);
        res.status(500).json({ error: "Failed to search for movies" });
    }
});

// Route: Read multiple movies by user ID
app.get("/moviesFromUser/:id", async (req: Request, res: Response) => {
    try {
        const movies = await Movie.findAll({
            where: { user_id: req.params.id },
            attributes: {
                include: [
                    // Add the average rating as a computed field
                    [
                        Sequelize.fn("AVG", Sequelize.col("ratingsReviews.rating")),
                        "averageRating",
                    ],
                ],
            },
            include: [
                {
                    model: RR,
                    as: "ratingsReviews", // Match the alias defined in the associations
                    attributes: [], // Do not include all RR fields in the response
                },
                {
                    model: Genre,
                    as: "genres", // Match the alias for the many-to-many association
                    attributes: ["genre"], // Include only the genre name
                    through: { attributes: [] }, // Exclude junction table fields
                },
            ],
            group: ["Movie.movie_id", "genres.genre_id"], // Group by movie ID and genre ID
            order: [["movie_id", "DESC"]], // Sort by movie_id in ascending order
        });
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies with genres and ratings:", error);
        res
            .status(500)
            .json({ error: "Failed to fetch movies with genres and ratings" });
    }
});

// Route: Search for movies by genre
app.get("/search/genre", async (req: Request, res: Response) => {
    try {
        const { genre } = req.query; // Get the genre from query params
        if (!genre) {
            res.status(400).json({ message: "Genre query parameter is required." });
        } else {
            // Query to find movies by genre
            const movies = await Movie.findAll({
                include: [
                    {
                        model: Genre,
                        as: "genres",
                        where: { genre }, // Filter by the genre
                        attributes: ["genre"],
                        through: { attributes: [] }, // Exclude join table attributes
                    },
                    {
                        model: RR,
                        as: "ratingsReviews",
                        attributes: [], // We only need averageRating, not individual reviews
                    },
                ],
                attributes: [
                    "movie_id",
                    "user_id",
                    "title",
                    "img",
                    "desc",
                    "release_yr",
                    "director",
                    "length",
                    "producer",
                    [
                        Sequelize.fn("AVG", Sequelize.col("ratingsReviews.rating")),
                        "averageRating", // Calculate average rating
                    ],
                ],
                group: ["Movie.movie_id", "genres.genre_id"], // Group by movie and genre
            });

            // Send response
            res.status(200).json(movies);
        }
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        res
            .status(500)
            .json({ message: "An error occurred while fetching movies." });
    }
});

// Route: Read all movies
app.get("/movies", async (req: Request, res: Response) => {
    try {
        // Fetch all movies with their average rating and genres
        const movies = await Movie.findAll({
            attributes: {
                include: [
                    // Add the average rating as a computed field
                    [
                        Sequelize.fn("AVG", Sequelize.col("ratingsReviews.rating")),
                        "averageRating",
                    ],
                ],
            },
            include: [
                {
                    model: RR,
                    as: "ratingsReviews", // Match the alias defined in the associations
                    attributes: [], // Do not include all RR fields in the response
                },
                {
                    model: Genre,
                    as: "genres", // Match the alias for the many-to-many association
                    attributes: ["genre"], // Include only the genre name
                    through: { attributes: [] }, // Exclude junction table fields
                },
            ],
            group: ["Movie.movie_id", "genres.genre_id"], // Group by movie ID and genre ID
            order: [["movie_id", "DESC"]], // Sort by movie_id in ascending order
        });

        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies with genres and ratings:", error);
        res
            .status(500)
            .json({ error: "Failed to fetch movies with genres and ratings" });
    }
});

sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
