const { pool } = require('../db/connection');
const { createId, findById, updateById, deleteById } = require('../db/queries');
const appointmentServices = require('./appointment.services');

const withAppointment = async (payment) => {
    if (!payment) {
        return null;
    }
    return {
        ...payment,
        appointmentId: await findById('appointments', payment.appointmentId)
    };
};

const createPayment = async (appointmentId, paymentData) => {
    const appointment = await appointmentServices.getAppointmentById(appointmentId);
    if (!appointment) {
        throw new Error('Appointment not found');
    }

    try {
        const id = createId();
        await pool.execute(
            'INSERT INTO payments (_id, appointmentId, amount, status, `date`) VALUES (?, ?, ?, ?, ?)',
            [id, appointmentId, paymentData.amount, paymentData.status || 'Pending', paymentData.date || new Date()]
        );
        return findById('payments', id);
    } catch (err) {
        throw new Error('Payment creation failed: ' + err.message);
    }
};

const findPaymentByAppointment = async (appointmentId) => {
    const [payments] = await pool.execute('SELECT * FROM payments WHERE appointmentId = ? LIMIT 1', [appointmentId]);
    if (!payments[0]) {
        throw new Error('Payment not found for this appointment');
    }
    return withAppointment(payments[0]);
};

const getPaymentById = async (paymentId) => {
    try {
        const payment = await withAppointment(await findById('payments', paymentId));
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    } catch (err) {
        throw new Error('Could not get payment: ' + err.message);
    }
};

const updatePayment = async (paymentId, updates) => {
    try {
        const updated = await updateById('payments', paymentId, updates, ['amount', 'status', 'date']);
        if (!updated) {
            throw new Error('Payment not found to update');
        }
        return updated;
    } catch (err) {
        throw new Error('Could not update payment: ' + err.message);
    }
};

const deletePayment = async (paymentId) => {
    try {
        const deleted = await deleteById('payments', paymentId);
        if (!deleted) {
            throw new Error('Error can not be found');
        }
        return deleted;
    } catch (err) {
        throw new Error('Could not delete payment: ' + err.message);
    }
};

module.exports = {
    createPayment,
    findPaymentByAppointment,
    getPaymentById,
    updatePayment,
    deletePayment
};
