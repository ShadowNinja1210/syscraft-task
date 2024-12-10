"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema_1 = require("./schema");
const login = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      const user = yield schema_1.User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      const token = jsonwebtoken_1.default.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "default-secret-key",
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  });
exports.login = login;
const authenticate = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return; // Ensure no further code runs
      }
      jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default-secret-key", (err, decoded) => {
        if (err) {
          res.status(403).json({ message: "Forbidden", error: err.message });
          return;
        }
        req.user = decoded; // Assign the decoded token payload to `req.user`
        next(); // Continue to the next middleware or route handler
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  });
exports.authenticate = authenticate;
