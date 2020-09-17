const { time } = require('console');
const mongoose = require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/appointmentCovers'

const appointmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    appointDate: {
        type: Date,
        require: true
    },appointTime: {
        type: String,
        require: true
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('Appointment', appointmentSchema);