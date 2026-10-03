const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT) || 10;

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.MY_SECRET, { expiresIn: '30d' });
    return token;
};
const register = async (fullName, age, email, password, location, Image) => {
    console.log("Register lookup:", email);
    const userRegister = await User.findOne({ email: email });
    console.log("Register lookup complete:", Boolean(userRegister));
    if (userRegister) {
        const error = new Error("This User Is Registered");
        error.code = "USER_EXISTS";
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);
    const newUser = new User({
        fullName: fullName,
        age: age,
        email: email,
        password: hashedPassword,
        location: location,
        Image: Image
    });
    await newUser.save();
    return newUser;
};

const findUser = async (userId) => {
    return await User.findById(userId);
};

const login = async(email, password)=>{
    const user = await User.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = generateToken(user._id);
            return {
                user: user,
                accessToken: token
            }
        }
    }                                                                               
    return null;
};

const getAllUsers = async () => {
    try {
        return await User.find();
    } catch (err) {
        throw new Error('Could not get users: ' + err.message);
    }
};

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (err) {
        throw new Error('Could not get user: ' + err.message);
    }
};

const updateUser = async (id, updates) => {
    try {
        const updated = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) {
            throw new Error("User    can not be found to update");
        }
        return updated;
    } catch (err) {
        throw new Error('Could not update user: ' + err.message);
    }
};

const deleteUser = async (userId) => {
    try {
        const deleted = await User.findByIdAndDelete(userId);
        if (!deleted) {
            throw new Error("User can not be found to delete");
        }
        return deleted;
    } catch (err) {
        throw new Error('Could not delete user: ' + err.message);
    }
};


module.exports ={
    register,
    login,
    findUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
