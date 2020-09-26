const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const e = require('express');

router.get('/', async (req, res) => {
    res.render('calendar/index');
})

router.get('/:day', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('client').exec();
        res.render('calendar/day', ( {appointments: appointments, day: req.params.day} ))
    } catch {
        res.redirect('/');
    }
})


module.exports = router;