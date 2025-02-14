const musicModel = require('../models/musicModel');
const logger = require('../utils/logger');

exports.createMusic = (req, res) => {
    const { artist_id, title, album_name, genre } = req.body;

    const newMusic = { artist_id, title, album_name, genre };

    musicModel.createMusic(newMusic, (error, results) => {
        if (error) {
            logger.error(`Database error while creating music: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        logger.info(`Music created successfully: ${title}`);
        res.status(201).json({ message: 'Music created successfully', musicId: results.insertId });
    });
};

exports.getMusics = (req, res) => {
    const artist_id = parseInt(req.query.artist_id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'created_at DESC';
    const offset = (page - 1) * limit;

    if(!artist_id) res.status(500).json({ message: 'Artist id is required'});

    musicModel.getMusicWithPagination(artist_id, limit, offset, sort, (error, results) => {
        if (error) {
            logger.error(`Database error while fetching musics: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        res.json({
            page,
            limit,
            music: results.music,
            total: results.total
        });
    });
};

exports.getMusicById = (req, res) => {
    const id = req.params.id;

    musicModel.getMusicById(id, (error, results) => {
        if (error) {
            logger.error(`Database error while fetching music: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.length === 0) {
            logger.warn(`Music not found: ${id}`);
            return res.status(404).json({ message: 'Music not found' });
        }
        res.json(results[0]);
    });
};

exports.updateMusic = (req, res) => {
    const id = req.params.id;
    const { artist_id, title, album_name, genre } = req.body;

    musicModel.updateMusic(id, { artist_id, title, album_name, genre }, (error, results) => {
        if (error) {
            logger.error(`Database error while updating music: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.length === 0) {
            logger.warn(`Music not found: ${id}`);
            return res.status(404).json({ message: 'Music not found' });
        }
        res.json({ message: "Music update successful", id, payload: req.body });
    });
};

exports.deleteMusic = (req, res) => {
    const id = req.params.id;

    musicModel.deleteMusic(id, (error, results) => {
        if (error) {
            logger.error(`Database error while deleting music: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.affectedRows === 0) {
            logger.warn(`Music not found: ${id}`);
            return res.status(404).json({ message: 'Music not found' });
        }
        logger.info(`Music deleted successfully: ${id}`);
        res.json({ message: 'Music deleted successfully' });
    });
};