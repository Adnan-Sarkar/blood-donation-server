import express from "express";

const router = express.Router();

const routes = [
  {
    path: "",
    router: express.Router(),
  },
];

routes.map((route) => {
  router.use(route.path, route.router);
});

export default router;
