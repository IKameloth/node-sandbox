import express from "express";
import {
  login,
  logout,
  refresh,
  registerUser,
} from "../controllers/authenticator";

export default (router: express.Router) => {
  router.post("/auth/register", registerUser);
  router.post("/auth/login", login);
  router.post("/auth/logout", logout);
  router.post("/auth/refresh", refresh);
};
