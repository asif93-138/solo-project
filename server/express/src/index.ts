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
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/movie", movieRoute);
app.use("/api/review", reviewRoute);
app.use("/api/genre", genreRoute);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/upload", uploadRoute)

// Don't use `sync({ alter: true })` in production or when using migrations/triggers.
// Altering columns at runtime can fail when DB objects (triggers/functions) depend on them.
// Instead, just authenticate the connection and start the server. Schema changes
// should be applied via migrations (you're already using `src/migrations`).
sequelize
  .authenticate()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server - DB connection error:', err);
    process.exit(1);
  });
