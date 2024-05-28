const express = require("express");
const router = express.Router();

const viewController = require("../controller/viewController");

router.get("/data", viewController.getData);
router.post("/updateFile", viewController.updateData);

module.exports = router;
