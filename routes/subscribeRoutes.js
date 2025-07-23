const express = require("express");
const router = express.Router();
const {subscribeEmail} = require("../controllers/subscribeController")

router.post("/subscribeEmail",subscribeEmail)

module.exports = router