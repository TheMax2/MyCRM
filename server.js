if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const indexRouter = require('./routes/index');
const clientRouter = require('./routes/clients');
const appointmentRouter = require('./routes/appointments');
const calendarRouter = require('./routes/calendar');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

const mongoose = require('mongoose');
//mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
mongoose
.connect(process.env.DATABASE_URL, {
useUnifiedTopology: true,
useNewUrlParser: true,
})

const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/clients', clientRouter);
app.use('/appointments', appointmentRouter);
app.use('/calendar', calendarRouter);

app.listen(process.env.PORT || 3030);
