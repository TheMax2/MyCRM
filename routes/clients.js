const express = require('express');
const router = express.Router();
const Client = require('../models/client');
const Appointment = require('../models/appointment');
const {checkLogin} = require('./middleware');

// All Clients Route
router.get('/', checkLogin, async (req, res) => {
    let searchOptions = {}
    if (req.query.firstName != null && req.query.firstName !== '') {
        searchOptions.firstName = new RegExp(req.query.firstName, 'i')
        
    }
    searchOptions.user = req.user
    try{
        const clients = await Client.find(searchOptions);
        res.render('clients/index', {
            clients: clients,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/')
    }
});

// New Client Route
router.get('/new', checkLogin, (req, res) => {
    res.render('clients/new', {myClient: new Client()});
});

// Create Client Route
router.post('/', async (req, res) => {
    const client = new Client({
        user:req.user,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        phone:req.body.phone
    })
    try{
        const newClient = await client.save();
        res.redirect(`clients/${newClient.id}`)
        //res.redirect(`clients/`);
    } catch {
        res.render('clients/new', {
            myClient: client,
            errorMessage: "Error creating client"
        });
    }
});

// View Client Route
router.get('/:id', checkLogin, async (req, res) => {
    try{
        const client = await Client.findById(req.params.id).populate('user').exec();
        const appointments = await Appointment.find({client: client.id}).limit(6).exec();
        res.render('clients/show', {
            myClient: client,
            appointmentsByClient: appointments
    })
    } catch {
        res.redirect('/');
    }
})

// Edit Client Route
router.get('/:id/edit', checkLogin, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        res.render('clients/edit', {myClient: client});
    } catch {
        res.redirect('/clients');
    } 
})

// Update Client info
router.put('/:id', async (req, res) => {
    let client;
    try{
        client = await Client.findById(req.params.id);
        client.user = req.user
        client.firstName = req.body.firstName
        client.lastName = req.body.lastName
        client.email = req.body.email
        client.phone = req.body.phone
        await client.save();
        res.redirect(`/clients/${client.id}`);
    } catch {
        if (client == null ){
            res.redirect('/');
        } else {
            res.render('clients/edit', {
                myClient: client,
                errorMessage: "Error updating client"
            });
        } 
    }
})

// Delete Client Route
router.delete('/:id', async (req, res) => {
    let client;
    try{
        client = await Client.findById(req.params.id);
        await client.remove();
        res.redirect('/clients');
    } catch {
        if (client == null ){
            res.redirect('/');
        } else {
            res.redirect(`/clients/${client.id}`);
        } 
    }
})

module.exports = router;