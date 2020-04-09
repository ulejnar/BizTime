// all routes here are under companies/
// response with JSON

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require("../db")
const companies = []

// at localhost:3000/companies
router.get("/", async function (req, res, next) {
    try {
        console.log("route found");
        const results = await db.query(
            'SELECT code, name FROM companies;'
        )
        console.log(results);
        return res.json(results.rows);
    }
    catch{
        next(err)
    }
})

router.get("/:code", async function (req, res, next) {
    try {
        const results = await db.query(
            `SELECT code, name, description
            FROM companies
            WHERE code = $1`, [req.params.code]);

    if (results.rows.length === 0) {
        let notFoundError = new Error(`There is no compnay with code '${req.params.code}`);
        notFoundError.status = 404;
        throw notFoundError;
      }
      return res.json({ company: results.rows[0] });
    } catch (err) {
      return next(err);
    }
})

router.post("/", async function (req, res, next){
    try{
        console.log(req.body);
        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
               VALUES ($1, $2, $3) 
               RETURNING code, name, description`,
            [req.body.code, req.body.name, req.body.description]);
        return res.status(201).json({company: result.rows[0]});
    }
    catch (err) {
        return next(err);
      }
})

router.put("/:code", async function (req, res, next){
    try {
        if ("code" in req.body) {
          throw new ExpressError("Not allowed", 400)
        }
    
        const result = await db.query(
          `UPDATE companies 
               SET name = $1, description = $2
               WHERE code = $3
               RETURNING code, name, description`,
          [req.body.name, req.body.description, req.params.code]);
    
        if (result.rows.length === 0) {
          throw new ExpressError(`There is no company with code of '${req.params.code}`, 404);
        }
    
        return res.json({ company: result.rows[0]});
      } catch (err) {
        return next(err);
      }
})

router.delete("/:code", async function(req, res, next){
    try {
        const result = await db.query(
          "DELETE FROM companies WHERE code = $1 RETURNING code", [req.params.code]);
    
        if (result.rows.length === 0) {
          throw new ExpressError(`There is no company with code of '${req.params.code}`, 404);
        }
        return res.json({ status: "deleted" });
      } catch (err) {
        return next(err);
      }
})


module.exports = router;