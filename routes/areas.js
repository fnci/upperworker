import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import validateArea from "../utils/validateArea.js";
import isLoggedIn from "../utils/isLoggedIn.js";
import isAuthor from "../utils/isAuthor.js";
// Controller
import {
  index,
  newArea,
  createArea,
  showArea,
  editArea,
  updateArea,
  deleteArea,
} from "../controllers/areaController.js";

router
  .route('/')
  .get(catchAsync(index))
  .post(isLoggedIn, validateArea, catchAsync(createArea));
router.get('/new', isLoggedIn, newArea);
router
  .route('/:id')
  .get(catchAsync(showArea))
  .put(isLoggedIn, isAuthor, validateArea, catchAsync(updateArea))
  .delete(isLoggedIn, isAuthor, catchAsync(deleteArea));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editArea));

export default router;
