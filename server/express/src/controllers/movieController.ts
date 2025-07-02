// @ts-nocheck
import { RequestHandler } from "express";
import { Request, Response } from "express";
import sequelize from "../models/sequelize";
import User from "../models/Users";
import fs from 'fs';
import db from "../models";
import { Op, Sequelize } from "sequelize";

const Movie = db.Movie;
const Genre = db.Genre;
const MG = db.MG;
const RR = db.RR;

export const createMovie: RequestHandler = async (
  req: Request,
  res: Response
) => {
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

      if (!movie.dataValues.movie_id) {
        throw new Error("Movie ID is null after creation");
      }

      const genreInstances = await Promise.all(
        genre.map(async (g: string) =>
          Genre.findOrCreate({ where: { genre: g }, transaction })
        )
      );

      const movieGenreAssociations = genreInstances.map(([genreInstance]) => ({
        movie_id: movie.dataValues.movie_id,
        genre_id: genreInstance.genre_id,
      }));

      await MG.bulkCreate(movieGenreAssociations, { transaction });
      await transaction.commit();

      res.status(201).json({ message: "Movie created successfully", movie });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
      console.error(error);
      res.status(500).json({ error: "title must be unique" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Failed to create movie" });
    }
  }
};

export const getMovieById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const ratings = await RR.findAll({
      where: { movie_id: movie.dataValues.movie_id },
    });

    const user = await User.findOne({
      where: { user_id: movie.dataValues.user_id },
    });

    const averageRating =
      ratings.reduce((sum, item) => sum + item.dataValues.rating, 0) /
      (ratings.length || 1);

    const genres = await MG.findAll({
      where: { movie_id: movie.dataValues.movie_id },
      include: [{ model: Genre, attributes: ["genre"] }],
    });

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

    res.status(200).json({
      ...movie.dataValues,
      rating: averageRating || null,
      genres: genres.map((x) => x.dataValues.Genre?.genre || "Unknown Genre"),
      user: user?.dataValues.name || "Unknown User",
      rr,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
};

export const getMovieByUserId: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const movies = await Movie.findAll({
      where: { user_id: req.params.id },
      attributes: {
        include: [
          [
            Sequelize.fn("AVG", Sequelize.col("ratingsReviews.rating")),
            "averageRating",
          ],
        ],
      },
      include: [
        {
          model: RR,
          as: "ratingsReviews",
          attributes: [],
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["genre"],
          through: { attributes: [] },
        },
      ],
      group: ["Movie.movie_id", "genres.genre_id"],
      order: [["movie_id", "DESC"]],
    });
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies with genres and ratings:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch movies with genres and ratings" });
  }
};

export const editMovie: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const movie = await Movie.findByPk(id);

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    if (updatedData.file) fs.unlinkSync("C:\\Users\\WIN 10\\solo-project\\server\\express\\uploads" + "\\" + updatedData.file.substring(9));

    await movie.update(updatedData);

    res.status(200).json(movie);
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
      console.error("Error updating movie:", error.errors[0].message);
      res.status(500).json({ error: "title must be unique" });
    } else {
      console.error("Error updating movie:", error);
      res.status(500).json({ error: "Failed to update movie" });
    }
  }
};

export const deleteMovie: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    // console.log("dsvsav");
    // console.log(req.body.fileName);
    // Delete previous file from local storage
    fs.unlinkSync("C:\\Users\\WIN 10\\solo-project\\server\\express\\uploads" + "\\" + req.body.fileName);
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

    res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Failed to delete movie" });
  }
};

export const getAllMovies: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, genre } = req.query;

    const queryOptions: any = {
      attributes: {
        include: [
          [
            Sequelize.fn("AVG", Sequelize.col("ratingsReviews.rating")),
            "averageRating",
          ],
        ],
      },
      include: [
        {
          model: RR,
          as: "ratingsReviews",
          attributes: [],
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["genre"],
          through: { attributes: [] },
        },
      ],
      group: ["Movie.movie_id", "genres.genre_id"],
      order: [["movie_id", "DESC"]],
    };

    if (title) {
      queryOptions.where = {
        ...queryOptions.where,
        title: {
          [Op.iLike]: `%${title}%`,
        },
      };
    }

    if (genre) {
      queryOptions.include[1].where = { genre };
    }

    const movies = await Movie.findAll(queryOptions);


    if (movies.length === 0) {
      res.status(200).json({ message: "No movies found" });
    } else {
      res.status(200).json(movies);
    }
  } catch (error) {
    console.error("Error searching for movies:", error);
    res.status(500).json({ error: "Failed to search for movies" });
  }
};


export async function checkTitle(req, res) {
  const result = await Movie.findOne({
    where: {
      title: req.query.title,
    },
  });
  if (result) res.status(412).send("title already exists!");
  else res.status(200).send("OK");
}