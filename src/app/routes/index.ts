import express from "express";
import { RegistrationRoute, loginRoute } from "../modules/auth/auth.route";

const router = express.Router();

const routes = [
  {
    path: "/register",
    router: RegistrationRoute,
  },
  {
    path: "/login",
    router: loginRoute,
  },
];

routes.map((route) => {
  router.use(route.path, route.router);
});

export default router;
