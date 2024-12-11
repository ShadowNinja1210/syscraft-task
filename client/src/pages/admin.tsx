import MovieForm from "@/components/movie-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, isBefore } from "date-fns";
import { LucideTrash2 } from "lucide-react";
import mongoose from "mongoose";
import { useEffect, useState } from "react";

export interface IMovie {
  _id: mongoose.Types.ObjectId;
  title: string;
  cast: string[];
  releaseDate: Date;
  genre: string;
  likes: number;
  comments: { userId: mongoose.Types.ObjectId; comment: string }[];
  ratings: { userId: mongoose.Types.ObjectId; rating: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Admin() {
  const [movies, setMovies] = useState<IMovie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch("http://localhost:5000/api/movies");
      const fetchedMovies = await response.json();

      setMovies(fetchedMovies.movies);
      console.log("Fetching movies...");
    };

    fetchMovies();
  }, []);

  const handleDelete = (id: mongoose.Types.ObjectId) => {
    // Delete the movie
    console.log("Deleting movie...", id);
  };

  const today = new Date();

  return (
    <main className="w-screen flex flex-col h-screen items-center p-8 gap-4 ">
      <h2 className="font-bold text-4xl text-center underline">Admin</h2>
      <div className="flex justify-between min-w-96">
        <h2 className="font-bold text-2xl text-center">Movies</h2>
        <MovieForm />
      </div>

      <section>
        {movies.map((movie) => (
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between items-end">
                <div>
                  <CardTitle className="text-xl">{movie.title}</CardTitle>
                  <CardDescription>
                    {isBefore(movie.releaseDate, today) ? "Released on: " : "Releasing on: "}{" "}
                    {format(movie.releaseDate, "PP")}
                  </CardDescription>
                </div>

                <Badge className="h-fit">{movie.genre}</Badge>
              </div>
              <Separator />
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <CardTitle>Cast:</CardTitle>
                <ul className="grid grid-cols-2">
                  {movie.cast.map((actor) => (
                    <li className="" key={actor}>
                      {actor}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <CardTitle>
                  Likes:
                  <span className="font-normal">
                    {" "}
                    {movie.likes >= 1000
                      ? movie.likes >= 1000000
                        ? `${movie.likes / 1000000}M`
                        : `${movie.likes / 1000}k`
                      : movie.likes}
                  </span>
                </CardTitle>
              </div>
            </CardContent>

            <CardFooter className="grid grid-cols-2 gap-4">
              <MovieForm edit={movie} />

              <Button variant="destructive" onClick={() => handleDelete(movie._id)}>
                <LucideTrash2 /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  );
}
