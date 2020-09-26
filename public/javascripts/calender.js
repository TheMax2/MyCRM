console.log("connected to calender.js");

const WINDOW_WIDTH = window.innerWidth;
const SQUARE_SIZE = WINDOW_WIDTH/14;
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_OF_WEEK_ABRV = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const MONTHS_ABRV = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const today = new Date();
const TODAYS_DATE = today.getDate();
const TODAYS_DAY = today.getDay();
const TODAYS_MONTH = today.getMonth();
const TODAYS_YEAR = today.getFullYear();

var days = [];
var displayMonth = TODAYS_MONTH;

var appointments = document.getElementById("appointments");
var data = appointments.innerHTML;
appointments = JSON.parse(data);

createCalender();

//test stuff here:
function testStuff(){
}
testStuff();

// main method. Creates the calendar.
function createCalender() {
    
    createGrid();
    createLabels();
    fillSquares(TODAYS_MONTH, TODAYS_YEAR);
    createTitle();

}

// creates and returns a div to represent a day square on the calender.
// todo: this should be refactored to return a day object containing a div and date.
function dayContainer() {
    var div = document.createElement("div");
    div.style.border = "2px solid black";
    div.style.color = "white";
    div.style.padding = "4px";
    div.href = "/calendar/day";
    days.push(div);
    return div;
}

// displays the name of the month and forward/backward buttons
function createTitle() {
    document.getElementById("month-title").innerHTML = MONTHS[TODAYS_MONTH] + " " + TODAYS_YEAR;
    document.getElementById("prev-btn").addEventListener("click", prevMonth);
    document.getElementById("next-btn").addEventListener("click", nextMonth);
}

// creates the calendar grid
// calendar grid is consisted of a bunch of day containers
function createGrid(){
    for (var i=0; i<7; i++){ // row
        for (var j = 7*i + 1; j < 7*i + 8; j++){ // column
            document.getElementById("main").appendChild(dayContainer())
        }
    }
}

// creates the labels for days of the week on the first row of calendar
function createLabels(){
    for (var i=0; i<7; i++){
        days[i].innerHTML = DAYS_OF_WEEK[i];
        days[i].classList.add("label");
    }
}

// fills in the squares.
// first puts correct numbers on squares based on month and year,
// then fills in each square with an appointment if it has any
function fillSquares(month, year){
    
    let date = 1; // the first day of the month 
    let day = new Date(year, month, 1).getDay(); // the day of week for the first day of month
    // calculates the starting square
    var startDate = 0 - day + date%7;
    if (day - date%7 > 5) startDate += 7;

    let k = 1; // counter for current day
    let j = 7; // counter for current square (including day labels)
    let dim = daysInMonth(month+1, year); // number of days in month

    for (var i = startDate; j < days.length; i++){
        if (i>0 && i<dim+1){ // if the square is a day (not blank like in begining and end), fill in the square
            days[j].innerHTML = k;
            populateSquare(days[j],k,month,year);
            days[j].classList.add("day");
            days[j].addEventListener("click", function( event ) {   
                highlightSquare(event.target);
                window.location.href = calendarURL(event.target.innerHTML.split("<")[0], month, year);
            });
            k++;
        } else { // else, empty the square
            days[j].innerHTML = "";
            days[j].classList.remove("day");
        }
        j++;
    }
    // display or hide the last row depending on the month
    if (days[42].innerHTML == ""){
        for (var i = 42; i < 49; i++){
            days[i].style.display = "none";
        }
    } else {
        for (var i = 42; i < 49; i++){
            days[i].style.display = "inline-block";
        }
    }
    
}

// function used to highlight a square on the calendar when clicked.
// currently not in use but could be used in the future.
function highlightSquare(div){
    if (div.classList.contains("mouseClicked")){
        days.forEach(cell=>{
            cell.classList.remove("mouseClicked");
        });
    } else {
        days.forEach(cell=>{
            cell.classList.remove("mouseClicked");
        });
        div.classList.add("mouseClicked")
    }
}

// function to return the url of the "day" page of a given day(views/calendar/day).
// used in fillSquares() function.
function calendarURL(date, month, year){
    let day = new Date(year, month, date).getDay();
    return "/calendar/" + DAYS_OF_WEEK_ABRV[day] + " " + MONTHS_ABRV[month] + " " + date + " " + year;
}

// helper method for fillSquares() function.
// checks if there are any appointments on this given day.
function populateSquare(div, date, month, year){
    // sets the color of todays square. refactor this code later its not perfect
    if (date == TODAYS_DATE && month == TODAYS_MONTH && year == TODAYS_YEAR){
        div.classList.add("today");
    } else {
        div.classList.remove("today");
    }
    appointments.forEach(appointment => {
        appointYear = parseInt(appointment.appointDate.substring(0,4));
        appointMonth = parseInt(appointment.appointDate.substring(5,7));
        appointDate = parseInt(appointment.appointDate.substring(8,10));
        if (date == appointDate && month+1 == appointMonth &&  year == appointYear){
            div.innerHTML += "<br />" + appointment.description;
        }else {
            // leave square empty
        }
    });
    
}

// show previous month
function prevMonth(){
    displayMonth -= 1;
    yearOffset = Math.floor(displayMonth / 12);
    document.getElementById("month-title").innerHTML = MONTHS[displayMonth % 12] + " " + (TODAYS_YEAR+yearOffset);
    fillSquares(displayMonth % 12, TODAYS_YEAR+yearOffset);
}

// show next month
function nextMonth(){
    displayMonth += 1;
    yearOffset = Math.floor(displayMonth / 12);
    document.getElementById("month-title").innerHTML = MONTHS[displayMonth % 12] + " " + (TODAYS_YEAR+yearOffset);
    fillSquares(displayMonth % 12, TODAYS_YEAR+yearOffset);
}

// finds the number of days in a given month starting at 1=January
function daysInMonth (month, year) { 
    return new Date(year, month, 0).getDate(); 
} 

