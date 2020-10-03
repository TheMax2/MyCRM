const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const e = require('express');

router.get('/', async (req, res) => {
    try{
        res.redirect('/appointments')
    } catch {
        res.render('calendar/index');
    }
    
})

router.get('/:day', async (req, res) => {
    try {
        const allAppointments = Appointment.find().populate('client').exec();
        var appointments = (await allAppointments).filter( function(item){
            return (item.client.user==req.user.id)
        })
        res.render('calendar/day', ( {appointments: appointments, day: req.params.day} ))
    } catch {
        res.redirect('/');
    }
})


module.exports = router;  