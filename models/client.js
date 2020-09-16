const mongoose = require('mongoose');
const Appointment = require('./appointment');

const clientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }

})

clientSchema.pre('remove', function(next) {
    Appointment.find({ client: this.id }, (err, appointments) => {
        if (err){
            next(err);
        } else if (appointments.length > 0) {
            next(new Error('This client has appointments'))
        } else {
            next();
        }
    })
})

module.exports = mongoose.model('Client', clientSchema);