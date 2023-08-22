import express from "express";

import { currentUser } from "@thinhvqnguyen-tickets/common";

const router = express.Router();

router.get("/currentuser", currentUser, async (req, res) => {
  return res.status(200).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
