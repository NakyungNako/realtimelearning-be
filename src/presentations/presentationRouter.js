const express = require("express");
const {
  createNewPre,
  deletePre,
  findPreById,
  addSlideToPre,
  updateSlides,
  updatePresent,
} = require("./presentationController");

const router = express.Router();

router.post("/create", createNewPre);
router.post("/delete", deletePre);
router.get("/", findPreById);
router.put("/updatepresent", updatePresent);
router.put("/addslide", addSlideToPre);
router.put("/updateslides", updateSlides);
// router.put("/removeSlide");
// router.put("/updateSlide");

module.exports = router;
