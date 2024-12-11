// models/Movies.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "./../src/sequelize";

class Movie extends Model {}

Movie.init(
  {
    movie_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    img: {
      type: DataTypes.TEXT,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    release_yr: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING(50),
    },
    length: {
      type: DataTypes.SMALLINT,
    },
    producer: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    tableName: "movies",
    timestamps: false,
  }
);

export default Movie;