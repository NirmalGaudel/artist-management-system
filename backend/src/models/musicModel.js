const db = require('../config/db');

// Create a new music record
exports.createMusic = (music, callback) => {
    const sql = `INSERT INTO music (artist_id, title, album_name, genre, created_at, updated_at)
                 VALUES (?, ?, ?, ?, NOW(), NOW())`;
    db.query(sql, [music.artist_id, music.title, music.album_name, music.genre], callback);
};

// Get music records with pagination and total count
exports.getMusicWithPagination = (artistId, limit, offset, sort, callback) => {
    const sql = `SELECT SQL_CALC_FOUND_ROWS music.id, artist_id, name as artist_name, title, album_name, genre, music.created_at, music.updated_at FROM music INNER JOIN artist on artist.id = music.artist_id where artist_id = ?  ORDER BY ${sort} LIMIT ? OFFSET ?`;
    db.query(sql, [artistId, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) return callback(err);
        db.query('SELECT FOUND_ROWS() as total', (err, countResults) => {
            if (err) return callback(err);
            callback(null, { music: results, total: countResults[0].total });
        });
    });
};

// Get music record by ID
exports.getMusicById = (id, callback) => {
    const sql = `SELECT music.id, artist_id, name as artist_name, title, album_name, genre, music.created_at, music.updated_at FROM music INNER JOIN artist on artist.id = music.artist_id WHERE music.id = ?`;
    db.query(sql, [id], callback);
};

// Update music record
exports.updateMusic = (id, music, callback) => {
    let sql = 'UPDATE music SET ';
    const values = [];
    for (const [key, value] of Object.entries(music)) {
        if (!value) continue;
        sql += `${key} = ?, `;
        values.push(value);
    }
    sql = sql.slice(0, -2); // Remove the last comma and space
    sql += ' WHERE id = ?';
    values.push(id);
    db.query(sql, values, callback);
};

// Delete music record
exports.deleteMusic = (id, callback) => {
    const sql = `DELETE FROM music WHERE id = ?`;
    db.query(sql, [id], callback);
};