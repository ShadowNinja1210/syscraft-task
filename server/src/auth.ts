import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User } from "./schema";

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "default-secret-key", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return; // Ensure no further code runs
    }

    jwt.verify(token, process.env.JWT_SECRET || "default-secret-key", (err, decoded) => {
      if (err) {
        res.status(403).json({ message: "Forbidden", error: err.message });
        return;
      }
      req.user = decoded as JwtPayload; // Assign the decoded token payload to `req.user`
      next(); // Continue to the next middleware or route handler
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
