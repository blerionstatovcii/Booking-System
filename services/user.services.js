const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../db/connection');
const { createId, findById, updateById, deleteById } = require('../db/queries');
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT, 10) || 10;

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.MY_SECRET, { expiresIn: '30d' });

const register = async (fullName, age, email, password, location, Image) => {
    const [existingUsers] = await pool.execute('SELECT _id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingUsers.length) {
        const error = new Error('This User Is Registered');
        error.code = 'USER_EXISTS';
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);
    const id = createId();
    await pool.execute(
        'INSERT INTO users (_id, fullName, age, email, password, location, Image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, fullName, age, email, hashedPassword, location || null, Image || null]
    );
    return findById('users', id);
};

const findUser = async (userId) => findById('users', userId);

const login = async (email, password) => {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = users[0];
    if (user && await bcrypt.compare(password, user.password)) {
        return { user, accessToken: generateToken(user._id) };
    }
    return null;
};

const getAllUsers = async () => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        return users;
    } catch (err) {
        throw new Error('Could not get users: ' + err.message);
    }
};

const getUserById = async (userId) => {
    try {
        const user = await findById('users', userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (err) {
        throw new Error('Could not get user: ' + err.message);
    }
};

const updateUser = async (id, updates) => {
    try {
        const updated = await updateById('users', id, updates, [
            'fullName', 'age', 'email', 'password', 'location', 'Image'
        ]);
        if (!updated) {
            throw new Error('User can not be found to update');
        }
        return updated;
    } catch (err) {
        throw new Error('Could not update user: ' + err.message);
    }
};

const deleteUser = async (userId) => {
    try {
        const deleted = await deleteById('users', userId);
        if (!deleted) {
            throw new Error('User can not be found to delete');
        }
        return deleted;
    } catch (err) {
        throw new Error('Could not delete user: ' + err.message);
    }
};

module.exports = {
    register,
    login,
    findUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
