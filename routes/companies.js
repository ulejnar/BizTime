// all routes here are under companies/
// response with JSON

const express = require("express");
const router = new express.Router();

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

// router.get("/companies/:code", async function (req, res, next) {
//     try {
//         const results = await db.query(
//             `SELECT code, name, description
//             FROM `
//         )
//     }
//     catch{

//     }
// })


module.exports = router;