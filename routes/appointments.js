const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const Client = require('../models/client');
const e = require('express');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// All Appointments Route
router.get('/', async (req, res) => {
    let query = Appointment.find();
    if (req.query.title != null && req.query.title != '') { // redundant?
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    try {
        const appointments = await query.populate('client').exec();
        // await appointments.forEach(appointment => {
        //     appointment.populate('client').exec();
        // });
        
        res.render('appointments/index', {
            appointments: JSON.stringify(appointments),
            searchOptions: req.query
        });
    } catch (e) {
        console.log(e);
        res.redirect('/')
    }
})

// New Appointment Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Appointment());
})

// Create Appointment Route
router.post('/', async (req, res) => {
    const appointment = new Appointment({
        client: req.body.client,
        appointDate: new Date(req.body.appointDate + "T00:00:00"),
        appointTime: req.body.appointTime.toString(),
        description: req.body.description
    })
    //saveCover(appointment, req.body.cover);

    try{
        const newAppointment = await appointment.save();
        res.redirect(`appointments/${newAppointment.id}`);
    } catch {
        renderNewPage(res, appointment, true);
    }
})

// Show Appointment Route
router.get('/:id', async(req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('client').exec();
        res.render('appointments/show', ( {appointment: appointment} ))
    } catch {
        res.redirect('/');
    }
})


// Edit Appointment Route
router.get('/:id/edit', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        renderEditPage(res, appointment);
    } catch {
        res.redirect('/');
    }
})

// Update Appointment Route
router.put('/:id', async (req, res) => {
    let appointment;
    try{
        appointment = await Appointment.findById(req.params.id);
        appointment.client = req.body.client;
        appointment.appointDate = new Date(req.body.appointDate + "T00:00:00");
        appointment.appointTime = req.body.appointTime;
        appointment.description = req.body.description;
        await appointment.save();
        res.redirect(`/appointments/${appointment.id}`);
    } catch {
        if (appointment != null) {
            renderEditPage(res, appointment, true);
        } else {
            redirect('/');
        }
    }
})

// Delete Appointment Route
router.delete('/:id', async (req, res) => {
    let appointment;
    try {
        appointment = await Appointment.findById(req.params.id);
        await appointment.remove();
        res.redirect('/appointments');
    } catch {
        if (appointment != null ) {
            res.render('appointments/show', {
                errorMessage: 'Could not remove appointment'
            });
        } else {
            res.redirect('/');
        }
    }
})

async function renderNewPage(res, appointment, hasError = false){
    renderFormPage(res, appointment, 'new', hasError);
}


async function renderEditPage(res, appointment, hasError = false){
    renderFormPage(res, appointment, 'edit', hasError);
}


async function renderFormPage(res, appointment, form, hasError = false){
    try {
        const clients = await Client.find({});
        const params = {
            clients: clients,
            appointment: appointment
        }
        if (hasError) {
            if (form == 'edit'){
                params.errorMessage = 'Error editing appointment';
            } else {
                params.errorMessage = 'Error creating appointment'
            }
        }
        res.render(`appointments/${form}`, params);
    } catch {
        res.redirect('/appointments');
    }
}


module.exports = router;