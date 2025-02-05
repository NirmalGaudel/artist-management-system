const db = require('../config/db');

// Create a new user
exports.createUser = (user, callback) => {
    const sql = `INSERT INTO user (first_name, last_name, email, password, phone, gender, address, role, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    db.query(sql, [user.first_name, user.last_name, user.email, user.password, user.phone, user.gender, user.address, user.role], callback);
};

// Get users with pagination and total count
exports.getUsersWithPagination = (limit, offset, callback) => {
    const sql = `SELECT SQL_CALC_FOUND_ROWS id, first_name, last_name, email, phone, gender, address, role FROM user LIMIT ? OFFSET ?`;
    db.query(sql, [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) return callback(err);
        db.query('SELECT FOUND_ROWS() as total', (err, countResults) => {
            if (err) return callback(err);
            callback(null, { users: results, total: countResults[0].total });
        });
    });
};

// Get user by ID
exports.getUserById = (id, callback) => {
    const sql = `SELECT id, first_name, last_name, email, phone, gender, address, role FROM user WHERE id = ?`;
    db.query(sql, [id], callback);
};

// Get user by email
exports.getUserByEmail = (email, callback) => {
    const sql = `SELECT id, first_name, last_name, email, phone, gender, address, role, password FROM user WHERE email = ?`;
    db.query(sql, [email], callback);
};

// Update user
exports.updateUser = (id, user, callback) => {
    let sql = 'UPDATE user SET ';
    const values = [];
    for (const [key, value] of Object.entries(user)) {
        if(!value) continue;
        sql += `${key} = ?, `;
        values.push(value);
    }
    sql = sql.slice(0, -2); // Remove the last comma and space
    sql += ' WHERE id = ?';
    values.push(id);
    db.query(sql, values, callback);
};

// Delete user
exports.deleteUser = (id, callback) => {
    const sql = `DELETE FROM user WHERE id = ?`;
    db.query(sql, [id], callback);
};
