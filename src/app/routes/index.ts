import express from "express";
import { RegistrationRoute, loginRoute } from "../modules/auth/auth.route";
import { ProfileRoute } from "../modules/profile/profile.route";

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
  {
    path: "/my-profile",
    router: ProfileRoute,
  },
];

routes.map((route) => {
  router.use(route.path, route.router);
});

export default router;
