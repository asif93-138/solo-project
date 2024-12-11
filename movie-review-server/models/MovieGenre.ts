import { DataTypes, Model } from "sequelize";
import sequelize from "./../src/sequelize";

class MG extends Model {}

MG.init(
  {
    mg_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "movie_genre",
    timestamps: false,
  }
);

export default MG;