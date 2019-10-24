// <app-root>/routes/api/streetcars.js
var express = require('express');
var router = express.Router();

/* PostgreSQL and PostGIS module and connection setup 
   loads what is in the .env file as environment variables.*/
require('dotenv').config();
// grabs the DATABASE_URL variable from our .env file
var database_url = process.env.DATABASE_URL;
/* creates a connection to the Postgres database using a "pool" of connections 
   that improves performance when communicating with the database*/
const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: database_url,
    ssl: true
});

/* GET streetcar data. 
   Tells express that if it receives an HTTP GET request to /api/steetcars, 
   keep processing it, otherwise return 404*/
router.get('/', function(req, res) {
    var featureClass = 'streetcars';
    var query = `
        SELECT jsonb_build_object(
            'type',     'FeatureCollection',
            'features', jsonb_agg(features.feature)
        ) as dataset
        FROM (
        SELECT jsonb_build_object(
            'type',       'Feature',
            'id',         id,
            'geometry',   ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
            'properties', to_jsonb(inputs) - 'geom'
        ) AS feature
        FROM (SELECT * FROM public.${featureClass}) inputs) features
    `;
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err)
            let status = 500;
            res.locals.message = "Something went wrong"
            res.locals.error = err;
            res.locals.error.status = status;
            return res.status(status).json({"message": "There was a problem communicating with the server"});
        }
        res.status(200).json(results.rows[0]['dataset'])
        console.log(results.rows[0]['dataset'])
    });
});


module.exports = router;