require('dotenv').config();
const mongoose = require('mongoose');
const { initializeDatabase, pool } = require('../db/connection');

const sourceUri = process.env.MONGO_SOURCE_URI
    || process.env.MONGO_URI
    || 'mongodb://127.0.0.1:27017/bookingSystem';
const collections = ['users', 'appointments', 'payments', 'feedbacks'];
const toId = (value) => value && value.toString();
const nullable = (value) => value === undefined ? null : value;

const migrate = async () => {
    let transaction;
    try {
        await mongoose.connect(sourceUri);
        const source = mongoose.connection.db;
        const availableCollections = new Set((await source.listCollections().toArray()).map(({ name }) => name));
        const missingCollections = collections.filter((name) => !availableCollections.has(name));
        if (missingCollections.length) {
            throw new Error(`MongoDB is missing collections: ${missingCollections.join(', ')}`);
        }

        const documents = {};
        for (const name of collections) {
            documents[name] = await source.collection(name).find({}).toArray();
        }
        if (collections.every((name) => documents[name].length === 0)) {
            throw new Error('The MongoDB bookingSystem database contains no records to migrate');
        }

        await initializeDatabase();
        transaction = await pool.getConnection();
        await transaction.beginTransaction();

        for (const name of collections) {
            const [rows] = await transaction.execute(`SELECT COUNT(*) AS count FROM \`${name}\``);
            if (Number(rows[0].count) > 0) {
                throw new Error(`MySQL table "${name}" is not empty; migration stopped to avoid overwriting data`);
            }
        }

        for (const user of documents.users) {
            await transaction.execute(
                'INSERT INTO users (_id, fullName, age, email, password, location, Image, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    toId(user._id), user.fullName, user.age, user.email, user.password,
                    nullable(user.location), nullable(user.Image), user.createdAt, user.updatedAt
                ]
            );
        }

        for (const appointment of documents.appointments) {
            await transaction.execute(
                'INSERT INTO appointments (_id, userId, paymentId, Trajtimi, `date`, `time`, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    toId(appointment._id), toId(appointment.userId), nullable(toId(appointment.paymentId)),
                    appointment.Trajtimi, appointment.date, appointment.time, appointment.status,
                    appointment.createdAt, appointment.updatedAt
                ]
            );
        }

        for (const payment of documents.payments) {
            await transaction.execute(
                'INSERT INTO payments (_id, appointmentId, amount, status, `date`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    toId(payment._id), toId(payment.appointmentId), payment.amount, payment.status,
                    payment.date, payment.createdAt, payment.updatedAt
                ]
            );
        }

        for (const feedback of documents.feedbacks) {
            await transaction.execute(
                'INSERT INTO feedbacks (_id, appointmentId, userId, comment, rating, language, needToImprove, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    toId(feedback._id), toId(feedback.appointmentId), toId(feedback.userId),
                    feedback.comment, feedback.rating, feedback.language,
                    feedback.needToImprove || 'Everything is good',
                    feedback.createdAt, feedback.updatedAt
                ]
            );
        }

        await transaction.commit();
        transaction.release();
        transaction = null;
        console.log('MongoDB records copied to MySQL:', Object.fromEntries(
            collections.map((name) => [name, documents[name].length])
        ));
    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        throw err;
    } finally {
        if (transaction) {
            transaction.release();
        }
        await mongoose.disconnect();
        await pool.end();
    }
};

migrate().catch((err) => {
    console.error('MongoDB to MySQL migration failed:', err.message);
    process.exitCode = 1;
});
