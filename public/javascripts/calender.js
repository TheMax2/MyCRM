console.log("connected to calender.js");

const WINDOW_WIDTH = window.innerWidth;
const SQUARE_SIZE = WINDOW_WIDTH/14;
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
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

f=3;
appointYear = parseInt(appointments[f].appointDate.substring(0,4));
appointMonth = parseInt(appointments[f].appointDate.substring(5,7));
appointDate = parseInt(appointments[f].appointDate.substring(8,10));
console.log(appointments[f].appointDate);
console.log(appointDate+" "+appointMonth+" "+appointYear);



createCalender();

function createCalender() {
    
    createGrid();
    createLabels();
    fillSquares(TODAYS_MONTH, TODAYS_YEAR);
    createTitle();

}

// creates and returns a div to represent a day square on the calender
function dayContainer() {
    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.background = "hsl(var(--color-base-hue), 100%, 20%)";
    div.style.border = "2px solid black";
    div.style.color = "white";
    div.style.padding = "4px"
    div.style.fontSize = "14px";
    div.style.lineHeight = "14px";
    days.push(div);
    return div;
}

// displays the name of the month and buttons
function createTitle() {
    document.getElementById("month-title").innerHTML = MONTHS[TODAYS_MONTH] + " " + TODAYS_YEAR;
    document.getElementById("prev-btn").addEventListener("click", prevMonth);
    document.getElementById("next-btn").addEventListener("click", nextMonth);
}

// creates the calender grid
function createGrid(){
    for (var i=0; i<7; i++){ // row
        for (var j = 7*i + 1; j < 7*i + 8; j++){ // column
            document.getElementById("main").appendChild(dayContainer())
        }
    }
}

// creates the labels for days of a week
function createLabels(){
    for (var i=0; i<7; i++){
        days[i].style.textAlign = "center";
        days[i].innerHTML = DAYS_OF_WEEK[i];
    }
}

// fills in the squares
function fillSquares(month, year){
    
    let date = 1; // the first day of the month 
    let day = new Date(year, month, 1).getDay(); // the day of week for the first day of month
    // calculate the start date
    var startDate = 0 - day + date%7;
    if (day - date%7 > 5) startDate += 7;

    let k = 1; // counter for current day
    let j = 7; // counter for current square (including day labels)
    let dim = daysInMonth(month+1, year); // number of days in month

    for (var i = startDate; j < days.length; i++){
        if (i>0 && i<dim+1){
            days[j].innerHTML = k;
            days[j].style.background = "hsl(var(--color-base-hue), 100%, 20%)";
            populateSquare(days[j],k,month,year);
            k++;
        } else {
            days[j].style.background = "hsl(var(--color-base-hue), 100%, 14%)";
            days[j].innerHTML = "";
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

function populateSquare(div, date, month, year){
    appointments.forEach(appointment => {
        appointYear = parseInt(appointment.appointDate.substring(0,4));
        appointMonth = parseInt(appointment.appointDate.substring(5,7));
        appointDate = parseInt(appointment.appointDate.substring(8,10));
        if (date == appointDate && month+1 == appointMonth &&  year == appointYear){
            div.innerHTML += "<br />" + appointment.description;
        } else {
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

