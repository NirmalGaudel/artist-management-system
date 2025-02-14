const db = require('../config/db');

// Create a new artist
exports.createArtist = (artist, callback) => {
    const sql = `INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    db.query(sql, [artist.name, artist.dob, artist.gender, artist.address, artist.first_release_year, artist.no_of_albums_released], callback);
};

// Get artists with pagination and total count
exports.getArtistsWithPagination = (select, limit, offset, sort, callback) => {
    select = select?.length ? select : null;
    const sql = `SELECT SQL_CALC_FOUND_ROWS id, ${select || 'name, dob, gender, address, first_release_year, no_of_albums_released, created_at'} FROM artist ORDER BY ${select ? '1 DESC' : sort } ${select ? '' : ' LIMIT ? OFFSET ?'}`;
    db.query(sql, select ? [] : [parseInt(limit), parseInt(offset)], (err, results) => {
        
        if (err) return callback(err);
        db.query('SELECT FOUND_ROWS() as total', (err, countResults) => {
            if (err) return callback(err);
            callback(null, { artists: results, total: countResults[0].total });
        });
    });
};

// Get artist by ID
exports.getArtistById = (id, callback) => {
    const sql = `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released FROM artist WHERE id = ?`;
    db.query(sql, [id], callback);
};

// Get artist by email
exports.getArtistByEmail = (email, callback) => {
    const sql = `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released FROM artist WHERE email = ?`;
    db.query(sql, [email], callback);
};

// Update artist
exports.updateArtist = (id, artist, callback) => {
    let sql = 'UPDATE artist SET ';
    const values = [];
    for (const [key, value] of Object.entries(artist)) {
        if (!value) continue;
        sql += `${key} = ?, `;
        values.push(value);
    }
    sql = sql.slice(0, -2); // Remove the last comma and space
    sql += ' WHERE id = ?';
    values.push(id);
    db.query(sql, values, callback);
};

// Delete artist
exports.deleteArtist = (id, callback) => {
    const sql = `DELETE FROM artist WHERE id = ?`;
    db.query(sql, [id], callback);
};

// Get all artists
exports.getAllArtists = (callback) => {
    const sql = `Select * from artist`;
    db.query(sql, callback);
};

exports.saveAllArtists = (artists, callback) => {
    const segmentsOf20 = [];
    for (let i = 0; i < artists.length; i += 20) {
        segmentsOf20.push(artists.slice(i, i + 20));
    }

    const sqls = segmentsOf20.map(arts => {
        const sql = `INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at) VALUES `;
        const values = arts.map(artist => `('${artist.name}', ${artist.dob ? `'${artist.dob}'` : 'NULL'}, ${artist.gender ? `'${artist.gender}'` : 'NULL'}, ${artist.address ? `'${artist.address}'` : 'NULL'}, ${artist.first_release_year || 'NULL'}, ${artist.no_of_albums_released || 'NULL'}, NOW(), NOW())`).join();
        return sql + values + ';';
    });

    console.log(sqls);

    db.beginTransaction((err) => {
        if (err) return callback({ message: 'Error starting transaction.' }, null);
        const promises = sqls.map(sql => {
            return new Promise((resolve, reject) => {
                db.query(sql, (err, result) => err ? reject(err) : resolve(result));
            })
        })
        Promise.all(promises).then(() => {
            db.commit((err) => {
                if (err) return callback({ message: 'Error committing transaction : ' + err.message }, null);
                callback(null, { message: 'Artist data imported', total: artists.length });
            })
        }).catch(error => {
            db.rollback((err) => {
                if (err) return callback({ message: 'Error rolling back transaction : ' + err.message }, null);
                callback({ message: 'Error occured during import : ' + error.message }, null);
            })
        })
    });
}
