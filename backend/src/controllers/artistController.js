const artistModel = require('../models/artistModel');
const logger = require('../utils/logger');
const { Parser } = require('json2csv');
const fs = require('fs');
const csv = require('csv-parser');

exports.createArtist = (req, res) => {
    const { name, dob, gender, address, first_release_year, no_of_albums_released } = req.body;

    const newArtist = { name, dob, gender, address, first_release_year, no_of_albums_released };

    artistModel.createArtist(newArtist, (error, results) => {
        if (error) {
            logger.error(`Database error while creating artist: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        logger.info(`Artist created successfully: ${name}`);
        res.status(201).json({ message: 'Artist created successfully', artistId: results.insertId });
    });
};

exports.getArtists = (req, res) => {
    const select = req.query.select || null;
    console.log("select", select);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'created_at DESC';
    const offset = (page - 1) * limit;

    artistModel.getArtistsWithPagination(select, limit, offset, sort, (error, results) => {
        if (error) {
            logger.error(`Database error while fetching artists: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        res.json({
            page,
            limit,
            artists: results.artists,
            total: results.total
        });
    });
};

exports.getArtistById = (req, res) => {
    const id = req.params.id;

    artistModel.getArtistById(id, (error, results) => {
        if (error) {
            logger.error(`Database error while fetching artist: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.length === 0) {
            logger.warn(`Artist not found: ${id}`);
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.json(results[0]);
    });
};

exports.updateArtist = (req, res) => {
    const id = req.params.id;
    const { name, dob, gender, address, first_release_year, no_of_albums_released } = req.body;

    artistModel.updateArtist(id, { name, dob, gender, address, first_release_year, no_of_albums_released }, (error, results) => {
        if (error) {
            logger.error(`Database error while updating artist: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.length === 0) {
            logger.warn(`Artist not found: ${id}`);
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.json({ message: "Artist update successful", id, payload: req.body });
    });
};

exports.deleteArtist = (req, res) => {
    const id = req.params.id;

    artistModel.deleteArtist(id, (error, results) => {
        if (error) {
            logger.error(`Database error while deleting artist: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.affectedRows === 0) {
            logger.warn(`Artist not found: ${id}`);
            return res.status(404).json({ message: 'Artist not found' });
        }
        logger.info(`Artist deleted successfully: ${id}`);
        res.json({ message: 'Artist deleted successfully' });
    });
};

exports.exportArtists = (req, res) => {
    artistModel.getAllArtists((err, results) => {
        if (err) {
            return res.status(500).json({ message: `Error fetching artist data : ${error.message}` });
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(results);
        res.header('Content-Type', 'text/csv');
        res.attachment('artists.csv');
        res.send(csv);
    });
};

exports.importArtists = (req, res) => {
    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {
            const artists = results.map(row => {
                const { name, dob, gender, address, first_release_year, no_of_albums_released } = row;
                return { name, dob, gender, address, first_release_year, no_of_albums_released };
            });

            
            artistModel.saveAllArtists(artists, (err, data) => {
                if(err) return res.status(500).json(err);
                setTimeout(() => {
                    fs.unlinkSync(filePath)
                }, 1000);
                res.json(data);
            });
        });
}