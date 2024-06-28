import express from "express";
import {
  AuthRouter,
  RegistrationRoute,
  loginRoute,
} from "../modules/auth/auth.route";
import { DonorRoute, ProfileRoute } from "../modules/profile/profile.route";
import {
  DonationRequestRoute,
  DonorListRoute,
} from "../modules/donation/donation.route";
import { MetaRoute } from "../modules/meta/meta.route";
import { ReviewRoute } from "../modules/review/review.route";
import { UserRoute } from "../modules/user/user.route";
import {EventRoute} from "../modules/event/event.route";

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
    path: "/auth",
    router: AuthRouter,
  },
  {
    path: "/my-profile",
    router: ProfileRoute,
  },
  {
    path: "/donor-details",
    router: DonorRoute,
  },
  {
    path: "/donation-request",
    router: DonationRequestRoute,
  },
  {
    path: "/donor-list",
    router: DonorListRoute,
  },
  {
    path: "/meta-data",
    router: MetaRoute,
  },
  {
    path: "/review",
    router: ReviewRoute,
  },
  {
    path: "/users",
    router: UserRoute,
  },
  {
    path: "/event",
    router: EventRoute,
  },
];

routes.map((route) => {
  router.use(route.path, route.router);
});

export default router;
