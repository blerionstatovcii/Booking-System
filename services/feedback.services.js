const { pool } = require('../db/connection');
const { createId, findById, updateById, deleteById } = require('../db/queries');
const userServices = require('./user.services');
const appointmentServices = require('./appointment.services');

const withAppointment = async (feedback) => {
    if (!feedback) {
        return null;
    }
    return {
        ...feedback,
        appointmentId: await findById('appointments', feedback.appointmentId)
    };
};

const createFeedback = async (appointmentId, userId, feedback) => {
    const appointment = await appointmentServices.getAppointmentById(appointmentId);
    if (!appointment) {
        throw new Error('Appointment not found to create feedback');
    }
    const user = await userServices.findUser(userId);
    if (!user) {
        throw new Error('This user does not exist');
    }

    try {
        const id = createId();
        await pool.execute(
            'INSERT INTO feedbacks (_id, appointmentId, userId, comment, rating, language, needToImprove) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                appointmentId,
                userId,
                feedback.comment,
                feedback.rating,
                feedback.language,
                feedback.needToImprove || 'Everything is good'
            ]
        );
        return withAppointment(await findById('feedbacks', id));
    } catch (err) {
        throw new Error('Feedback create failed: ' + err.message);
    }
};

const findFeedbackByAppointment = async (appointmentId) => {
    const [feedbacks] = await pool.execute('SELECT * FROM feedbacks WHERE appointmentId = ? LIMIT 1', [appointmentId]);
    if (!feedbacks[0]) {
        throw new Error('Feedback not found for this appointment');
    }
    return withAppointment(feedbacks[0]);
};

const getFeedbackById = async (feedbackId) => {
    try {
        const feedback = await withAppointment(await findById('feedbacks', feedbackId));
        if (!feedback) {
            throw new Error('Feedback not found');
        }
        return feedback;
    } catch (err) {
        throw new Error('Could not get feedback: ' + err.message);
    }
};

const updateFeedback = async (feedbackId, updates) => {
    try {
        const updated = await updateById('feedbacks', feedbackId, updates, [
            'comment', 'rating', 'language', 'needToImprove'
        ]);
        if (!updated) {
            throw new Error('Feedback not found to update');
        }
        return updated;
    } catch (err) {
        throw new Error('Could not update feedback: ' + err.message);
    }
};

const deleteFeedback = async (feedbackId) => {
    try {
        const deleted = await deleteById('feedbacks', feedbackId);
        if (!deleted) {
            throw new Error('Feedback not found to delete');
        }
        return deleted;
    } catch (err) {
        throw new Error('Could not delete feedback: ' + err.message);
    }
};

module.exports = {
    createFeedback,
    findFeedbackByAppointment,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};
