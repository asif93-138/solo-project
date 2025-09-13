import cors from "cors";
import path from "path";
import sequelize from "./models/sequelize";
import userRoute from "./routes/userRoute";
import movieRoute from "./routes/movieRoute";
import reviewRoute from "./routes/reviewRoute";
import genreRoute from "./routes/genreRoute";
import uploadRoute from "./routes/uploadRoute";
import express, { Express } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/movie", movieRoute);
app.use("/api/review", reviewRoute);
app.use("/api/genre", genreRoute);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/upload", uploadRoute)

sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
