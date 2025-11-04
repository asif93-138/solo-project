import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize";

class RR extends Model { }

RR.init(
  {
    rr_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "ratings_reviews",
    timestamps: false,
    indexes: [
      {
        fields: ['movie_id']
      },
      {
        fields: ['user_id']
      }
    ]
  }
);


export default RR;