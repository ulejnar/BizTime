const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT id, comp_code 
               FROM invoices`);
  
      return res.json(results.rows);
    }catch (err) {
      return next(err);
    }
  })

  module.exports = router;
