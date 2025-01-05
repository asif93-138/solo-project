import { Sequelize } from 'sequelize';
import sequelize from './sequelize';
import { DB } from '../interfaces/DBinterface';
import Movie from "./Movies";
import RR from "./Ratings&Reviews";
import Genre from "./Genre";
import MG from "./MovieGenre";

const db: DB = {
    Sequelize,
    sequelize,
};

db.Movie = Movie;
db.RR = RR;
db.Genre = Genre;
db.MG = MG;

db.Movie.hasMany(db.RR, { foreignKey: 'movie_id', as: 'ratingsReviews' });
db.RR.belongsTo(db.Movie, { foreignKey: 'movie_id', onDelete: 'CASCADE' });

db.Movie.hasMany(db.MG, { foreignKey: 'movie_id' });
db.MG.belongsTo(db.Movie, { foreignKey: 'movie_id', onDelete: 'CASCADE' });

db.Genre.hasMany(db.MG, { foreignKey: 'genre_id' });
db.MG.belongsTo(db.Genre, { foreignKey: 'genre_id', onDelete: 'CASCADE' });

db.Movie.belongsToMany(db.Genre, {
    through: db.MG,
    foreignKey: 'movie_id',
    as: 'genres',
    timestamps: false
});

db.Genre.belongsToMany(db.Movie, {
    through: db.MG,
    foreignKey: 'genre_id',
    timestamps: false
});

export default db;
