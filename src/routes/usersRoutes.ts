import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyToken";

export default (router: express.Router) => {
  router.get("/users", verifyToken, getAllUsers);
  router.get("/users/:id", verifyToken, getUser);
  router.delete("/users/:id", verifyToken, deleteUser);
  router.patch("/users/:id", verifyToken, updateUser);
};
