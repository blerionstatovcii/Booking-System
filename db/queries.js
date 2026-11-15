const crypto = require('crypto');
const { pool } = require('./connection');

const createId = () => crypto.randomBytes(12).toString('hex');

const findById = async (table, id) => {
    const [rows] = await pool.execute(`SELECT * FROM \`${table}\` WHERE _id = ? LIMIT 1`, [id]);
    return rows[0] || null;
};

const updateById = async (table, id, updates, allowedFields) => {
    const entries = Object.entries(updates)
        .filter(([field, value]) => allowedFields.includes(field) && value !== undefined);

    if (entries.length) {
        const assignments = entries.map(([field]) => `\`${field}\` = ?`);
        await pool.execute(
            `UPDATE \`${table}\` SET ${assignments.join(', ')}, updatedAt = CURRENT_TIMESTAMP(3) WHERE _id = ?`,
            [...entries.map(([, value]) => value), id]
        );
    }

    return findById(table, id);
};

const deleteById = async (table, id) => {
    const existing = await findById(table, id);
    if (!existing) {
        return null;
    }
    await pool.execute(`DELETE FROM \`${table}\` WHERE _id = ?`, [id]);
    return existing;
};

module.exports = { createId, findById, updateById, deleteById };
