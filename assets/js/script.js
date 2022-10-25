var events = [];
var bufEventTime = "";
var bufEventTxt = "";

var today = moment().format("dddd, MMMM Do, YYYY");
    console.log(today);
    $("#currentDay").text(today);

var time = moment().format('LTS');
    console.log(time)
    $("#currentTime").text(time);

    window.setInterval(function () {
        var time = moment().format('LTS');
        console.log(time)
        $("#currentTime").text(time);
    }, 1000);

var loadEvents = function() {
    events = JSON.parse(localStorage.getItem("events"));
    console.log("Inside loadEvents");
    console.log(events);
    if (!events){
        events = [];
    }
    for (var i = 0; i < events.length; i++){
        console.log ("looping through the loaded events: " + i);
        console.log(events[i].time);
        console.log(events[i].text);
        var loadingBlock = $(".hour:contains('"+ events[i].time +"')");
        console.log(loadingBlock);
        loadingBlock.siblings(".text-box").children(".event-text").text(events[i].text);
    }

    $(".hour").each(function() {
        auditEvents(this);
    })
};

var saveEvents = function(){
    localStorage.setItem("events", JSON.stringify(events));
};

$(".time-block").on("click", ".text-box", function () {
    var text = $(this).text().trim();
    console.log(this);

    var textInput = $("<textarea>").addClass("form-control").val(text);
    var replaceP = $("p", this);
    replaceP.replaceWith(textInput);
    textInput.trigger("focus");

    if ($(this).hasClass("past")) {
        textInput.addClass("past-textarea");
    }
    else if ($(this).hasClass("present")) {
        textInput.addClass("present-textarea");
    }
    else if ($(this).hasClass("future")) {
        textInput.addClass("future-textarea");
    }
});

$(".save-btn").on("click", function() {
    var eventText = $(this).siblings(".text-box").children("textarea").val();
  
    if(eventText === undefined) {
        return;
    }
    var eventTime = $(this).siblings(".hour").text();

    var newEvent = true;

    for (var i = 0; i < events.length; i++) {
  
        if (events[i].time === eventTime) {
            newEvent = false;
            
            events[i].text = eventText;
            
            if (eventText === ""){
                events.splice(i, 1);
                break;
            }
        }
    }

    if (newEvent === true) {
    events.push({time: eventTime, text: eventText});
    }

    var replaceP = $("<p>").addClass("event-text").text(eventText);
    $(this).siblings(".text-box").children("textarea").replaceWith(replaceP);

    saveEvents();
});

var auditEvents = function (eventEl) {

    var timeBlock = $(eventEl).text();
    timeBlock = timeBlock.split(" ");
    
    
    if (timeBlock[1] === "pm" && timeBlock[0] !== "12"){
        timeBlock[0] = parseInt(timeBlock[0]);
        timeBlock[0] += 12;
    }

    var colorBox = $(eventEl).siblings(".text-box");
    colorBox.removeClass("past present future");

    if (moment().isAfter(moment().hour(timeBlock[0]))) {
        console.log("The timeBlock is in the past");
        colorBox.addClass("past");
    }
    else if (moment().isBefore(moment().hour(timeBlock[0]))) {
        console.log("The timeBlock is in the future");
        colorBox.addClass("future");
    }
    else if (moment().isSame(moment().hour(timeBlock[0]))) {
        console.log("The timeBLock is NOW!");
        colorBox.addClass("present");
    }   
};

loadEvents();

var timer = setInterval(function() {
    $(".hour").each(function() {
        auditEvents(this);
    });
}, 150000);
