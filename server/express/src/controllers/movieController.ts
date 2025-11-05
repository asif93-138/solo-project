// @ts-nocheck
import { RequestHandler } from "express";
import { Request, Response } from "express";
import sequelize from "../models/sequelize";
import User from "../models/Users";
import fs from 'fs';
import db from "../models";
import { Op, Sequelize } from "sequelize";
import { title } from "process";

const Movie = db.Movie;
const Genre = db.Genre;
const MG = db.MG;
const RR = db.RR;

// Build a tsquery string for prefix matching. Returns null if tokens are all stop/too-short.
function buildPrefixTsQuery(raw: any): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;

  // Split on whitespace, remove empty tokens
  const tokens = s.split(/\s+/).map(t => t.replace(/[^a-zA-Z0-9]/g, "")).filter(Boolean);
  // For prefix matching, require token length >= 3 to avoid meaningless matches
  const terms = tokens.map(t => t.toLowerCase()).filter(t => t.length >= 3).map(t => `${t}:*`);
  if (terms.length === 0) return null;
  // Combine with AND so all tokens must match (you can change to ' | ' for OR)
  return terms.join(' & ');
}

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
    const { title, genre, start, end } = req.query;
    
    // Build up the WHERE clause (collect conditions)
    const where: any = { user_id: Number(req.params.id) };
    const andLiterals: any[] = [];
    if (title) {
      const tsq = buildPrefixTsQuery(title);
      if (tsq) {
        // If title_vector is NULL in the DB, fall back to computing the tsvector from title
        // so searches still work until DB migration/trigger has been applied.
        andLiterals.push(Sequelize.literal(`coalesce(title_vector, to_tsvector('english', title)) @@ to_tsquery('english', ${sequelize.escape(tsq)})`));
      } else {
        // Fallback to ILIKE for very short/stop-word queries (e.g. 'the')
        andLiterals.push({ title: { [Op.iLike]: `%${title}%` } });
      }
    }
    if (genre) {
      andLiterals.push(Sequelize.literal(`
        EXISTS (
          SELECT 1
            FROM "movie_genre" AS mg
            JOIN "genre"      AS g
              ON g.genre_id = mg.genre_id
           WHERE mg.movie_id = "Movie".movie_id
             AND g.genre = '${genre}'
        )
      `));
    }
    if (andLiterals.length) where[Op.and] = andLiterals;

    let paginationOpt: any = {};
    const startNum = parseInt(start as string, 10) || 1;
    const endNum = parseInt(end as string, 10) || 50;
    paginationOpt.limit = endNum - startNum + 1;
    paginationOpt.offset = startNum - 1;

    // Optimization: fetch only matching movie IDs first
    const idRows = await Movie.findAll({
      attributes: ['movie_id'],
      where,
      order: [['movie_id', 'DESC']],
      limit: paginationOpt.limit,
      offset: paginationOpt.offset,
      raw: true,
    });

    const movieIds = idRows.map((r: any) => r.movie_id);
    if (!movieIds.length) return res.status(200).json({ message: 'No movies found' });

    const movies = await Movie.findAll({
      attributes: [
        'movie_id',
        'user_id',
        'title',
        'img',
        'desc',
        'release_yr',
        'director',
        'length',
        'producer',
        [Sequelize.fn('AVG', Sequelize.col('ratingsReviews.rating')), 'averageRating'],
        [
          Sequelize.literal(`(
            SELECT json_agg(g.genre)
              FROM "movie_genre" AS mg
              JOIN "genre"      AS g
                ON g.genre_id = mg.genre_id
             WHERE mg.movie_id = "Movie".movie_id
          )`),
          'genres',
        ],
      ],
      include: [ { model: RR, as: 'ratingsReviews', attributes: [] } ],
      where: { movie_id: movieIds },
      group: [
        'Movie.movie_id',
        'Movie.user_id',
        'Movie.title',
        'Movie.img',
        'Movie.desc',
        'Movie.release_yr',
        'Movie.director',
        'Movie.length',
        'Movie.producer',
      ],
      order: [['movie_id', 'DESC']],
      subQuery: false,
    });

    if (!movies.length) {
      return res.status(200).json({ message: 'No movies found' });
    }
    return res.json(movies);
  } catch (error) {
    console.error('Error searching for movies:', error);
    return res.status(500).json({ error: 'Failed to search for movies' });
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

    if (updatedData.file) fs.unlinkSync("/opt/render/project/src/server/express/uploads/" + updatedData.file.substring(9)); // fs.unlinkSync("C:\\Users\\WIN 10\\solo-project\\server\\express\\uploads" + "\\" + updatedData.file.substring(9));

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
    // fs.unlinkSync("C:\\Users\\WIN 10\\solo-project\\server\\express\\uploads" + "\\" + req.body.fileName);
    fs.unlinkSync("/opt/render/project/src/server/express/uploads/" + req.body.fileName);
    const movie = await Movie.destroy({
      where: {
        movie_id: id,
      },
    });

    // const rr = await RR.destroy({
    //   where: {
    //     movie_id: id,
    //   },
    // });

    // const mg = await MG.destroy({
    //   where: {
    //     movie_id: id,
    //   },
    // });

    res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(501).json({ error: "Failed to delete movie" });
  }
};

export const getAllMovies: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, genre, start, end } = req.query;
    
    // WHERE clause - collect conditions and combine with Op.and
    const where: any = {};
    const andLiterals: any[] = [];
    if (title) {
      const tsq = buildPrefixTsQuery(title);
      if (tsq) {
        // Use coalesce to handle NULL title_vector values (compute on the fly)
        andLiterals.push(Sequelize.literal(`coalesce(title_vector, to_tsvector('english', title)) @@ to_tsquery('english', ${sequelize.escape(tsq)})`));
      } else {
        andLiterals.push({ title: { [Op.iLike]: `%${title}%` } });
      }
    }
    if (genre) {
      andLiterals.push(Sequelize.literal(`
        EXISTS (
          SELECT 1
            FROM "movie_genre" AS mg
            JOIN "genre"      AS g
              ON g.genre_id = mg.genre_id
           WHERE mg.movie_id = "Movie".movie_id
             AND g.genre = '${genre}'
        )
      `));
    }
    if (andLiterals.length) where[Op.and] = andLiterals;

    let paginationOpt: any = {};

    // Pagination
    const startNum = parseInt(start as string, 10) || 1;
    const endNum = parseInt(end as string, 10) || 50;
    paginationOpt.limit = endNum - startNum + 1;
    paginationOpt.offset = startNum - 1;

    // Optimization: fetch only movie IDs first (fast when using indexes / GIN) then aggregate for those IDs.
    const idRows = await Movie.findAll({
      attributes: ['movie_id'],
      where,
      order: [['movie_id', 'DESC']],
      limit: paginationOpt.limit,
      offset: paginationOpt.offset,
      raw: true,
    });

    const movieIds = idRows.map((r: any) => r.movie_id);
    if (!movieIds.length) return res.status(200).json({ message: 'No movies found' });

    const movies = await Movie.findAll({
      attributes: [
        'movie_id',
        'user_id',
        'title',
        'img',
        'desc',
        'release_yr',
        'director',
        'length',
        'producer',
        [Sequelize.fn('AVG', Sequelize.col('ratingsReviews.rating')), 'averageRating'],
        [
          Sequelize.literal(`(
            SELECT json_agg(g.genre)
              FROM "movie_genre" AS mg
              JOIN "genre"      AS g
                ON g.genre_id = mg.genre_id
             WHERE mg.movie_id = "Movie".movie_id
          )`),
          'genres',
        ],
      ],
      include: [
        { model: RR, as: 'ratingsReviews', attributes: [] },
      ],
      where: { movie_id: movieIds },
      group: [
        'Movie.movie_id',
        'Movie.user_id',
        'Movie.title',
        'Movie.img',
        'Movie.desc',
        'Movie.release_yr',
        'Movie.director',
        'Movie.length',
        'Movie.producer',
      ],
      order: [['movie_id', 'DESC']],
      subQuery: false,
    });

    if (!movies.length) {
      return res.status(200).json({ message: "No movies found" });
    }

    return res.json(movies);
  } catch (error) {
    console.error("Error searching for movies:", error);
    return res.status(500).json({ error: "Failed to search for movies" });
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