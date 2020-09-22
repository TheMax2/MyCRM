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
    div.style.border = "2px solid black";
    div.style.color = "white";
    div.style.padding = "4px"
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
        days[i].innerHTML = DAYS_OF_WEEK[i];
        days[i].classList.add("label");
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
            populateSquare(days[j],k,month,year);
            
            days[j].addEventListener("click", function( event ) {   
                if (event.target.classList.contains("mouseClicked")){
                    days.forEach(cell=>{
                        cell.classList.remove("mouseClicked");
                    });
                } else {
                    days.forEach(cell=>{
                        cell.classList.remove("mouseClicked");
                    });
                    event.target.classList.add("mouseClicked")
                }
            });
            days[j].classList.add("day");
            k++;
        } else {
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

