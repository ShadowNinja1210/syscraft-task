import express from "express";
import { Movie } from "./schema";

const router = express.Router();

router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();

    if (!movies) {
      res.json({
        message: "No movies found",
        movies: [],
        status: 404,
      });
      return;
    } else {
      res
        .json({
          message: "Movies route",
          movies,
        })
        .status(200);
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting movies", error: error });
    return;
  }
});

router.post("/movie", async (req, res) => {
  try {
    const { title, cast, releaseDate, genre } = req.body;

    if (!title || !cast || !releaseDate || !genre) {
      res
        .json({
          message: "All fields are required",
          status: 400,
        })
        .status(400);
      return;
    }

    const newMovie = await Movie.create({
      title,
      cast,
      releaseDate,
      genre,
    });

    res
      .json({
        message: "Movie created",
        movie: newMovie,
      })
      .status(201);
  } catch (error) {
    res.status(500).json({ message: "Error creating movie", error: error });
    return;
  }
});

router.put("/movie-like/:id", async (req, res) => {
  try {
    const params = req.params;
    const { id } = params;

    const { userId } = req.body;

    if (!userId) {
      res.json({
        message: "User ID is required",
        status: 400,
      });
      return;
    }

    if (!id) {
      res.json({
        message: "Movie ID is required",
        status: 400,
      });
      return;
    }

    const updatedMovie = Movie.findByIdAndUpdate(
      id,
      {
        $push: {
          likes: userId,
        },
      },
      { new: true }
    );

    if (!updatedMovie) {
      res.json({
        message: "Movie not found",
        status: 404,
      });
      return;
    }

    res.json({
      message: "Movie updated for like",
      movie: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating movie for like", error: error });
    return;
  }
});

router.put("/movie-comment/:id", async (req, res) => {
  const { id } = req.params;
  const { comment, userId } = req.body;

  const updatedMovie = Movie.findByIdAndUpdate(
    id,
    {
      $push: {
        comments: {
          comment,
          userId,
        },
      },
    },
    { new: true }
  );
  res.json({
    message: "Movie updated for comment",
    movie: updatedMovie,
  });
});

router.put("/movie-rating/:id", async (req, res) => {
  const { rating, userId, movieId } = req.body;

  if (!rating || !userId || !movieId) {
    res
      .json({
        message: "Rating, User ID, and Movie ID are required",
        status: 400,
      })
      .status(400);
    return;
  }

  const updatedMovie = Movie.findByIdAndUpdate(
    movieId,
    {
      $push: {
        ratings: {
          rating,
          userId,
        },
      },
    },
    { new: true }
  );
  res
    .json({
      message: "Movie updated for rating",
      movie: updatedMovie,
    })
    .status(204);
});

export default router;
