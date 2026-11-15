const userService = require('./user.services');
const { pool } = require('../db/connection');
const { createId, findById, updateById, deleteById } = require('../db/queries');

const create = async (userId, appointment) => {
    const user = await userService.findUser(userId);
    if (!user) {
        throw new Error('User not found');
    }

    try {
        const id = createId();
        await pool.execute(
            'INSERT INTO appointments (_id, userId, paymentId, Trajtimi, `date`, `time`, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                userId,
                appointment.paymentId || null,
                appointment.Trajtimi,
                appointment.date,
                appointment.time,
                appointment.status || 'Scheduled'
            ]
        );
        return findById('appointments', id);
    } catch (err) {
        throw new Error('Could not create appointment: ' + err.message);
    }
};

const findCurrentAppointments = async (userId) => {
    const [appointments] = await pool.execute('SELECT * FROM appointments WHERE userId = ?', [userId]);
    if (appointments.length === 0) {
        throw new Error('This user does not have Appointments');
    }
    return appointments;
};

const getAppointmentById = async (appointmentId) => {
    try {
        const appointment = await findById('appointments', appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    } catch (err) {
        throw new Error('Could not get appointment: ' + err.message);
    }
};

const updateAppointment = async (id, updates) => {
    try {
        const updated = await updateById('appointments', id, updates, [
            'userId', 'paymentId', 'Trajtimi', 'date', 'time', 'status'
        ]);
        if (!updated) {
            throw new Error('Appointment can not be found to update');
        }
        return updated;
    } catch (err) {
        throw new Error('Could not update appointment: ' + err.message);
    }
};

const deleteAppointment = async (appointmentId) => {
    try {
        const deleted = await deleteById('appointments', appointmentId);
        if (!deleted) {
            throw new Error('Appointment can not be found to delete');
        }
        return deleted;
    } catch (err) {
        throw new Error('Could not delete appointment: ' + err.message);
    }
};

module.exports = {
    create,
    findCurrentAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};
