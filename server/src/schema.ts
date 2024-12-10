import mongoose, { Model } from "mongoose";

// ------------------- User ------------------- //
export interface IUser {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "User";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "User"], required: true },
  },
  { timestamps: true }
);

let User: Model<IUser>;
if (mongoose.models.User) {
  User = mongoose.models.User;
} else {
  User = mongoose.model<IUser>("User", userSchema);
}

// ------------------- Movie ------------------- //
export interface IMovie {
  id: mongoose.Types.ObjectId;
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

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cast: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: [{ userId: mongoose.Types.ObjectId, comment: String }], default: [] },
    ratings: { type: [{ userId: mongoose.Types.ObjectId, rating: Number }], default: [] },
  },
  { timestamps: true }
);

let Movie: Model<IMovie>;
if (mongoose.models.Movie) {
  Movie = mongoose.models.Movie;
} else {
  Movie = mongoose.model<IMovie>("Movie", movieSchema);
}

export { User, Movie };
