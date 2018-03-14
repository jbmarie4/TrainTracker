
//display current time
$(document).ready(function clock(){
	var interval= setInterval(clock, 1000);
	$("#currentDate").html(Date())
})

$("#reset").on("click", function(){
	location.reload();
})

//link to firebase
var database=firebase.database();

//pull train name and display
	$("#submit").on("click", function(e){
//prevents page refresh
	e.preventDefault();
	var trainName= $("#tName").val().trim();
//$("#inputName").html(trainName);
//pull destination and display		
	var trainDes= $("#tDestination").val().trim();
//$("#inputDes").html(trainDes);
//pull frequency and display		
	var userInput=$("#tFrequency").val().trim();
//$("#inputFreq").html(userInput);
//pull departure time and display		
	var trainLeave= moment($("#tDeparture").val().trim(), "HH:mm").subtract(10, "years").format("x");
	
	
//pushes input data to firebase database
	database.ref().push({
		TrainName: trainName,
		Destination: trainDes,
		DepartureTime: trainLeave,
		Frequency: userInput
	})
	
	
//clears input in text boxes
	trainName= $("#tName").val("");
	trainDes= $("#tDestination").val("");
	userInput=$("#tFrequency").val("");
	trainLeave= $("#tDeparture").val("");
	
	
//pull info from database, store in var snapshot, assign snapshot data to variables
	database.ref().once("child_added", function(snapshot){
	console.log(snapshot.val());
	var firebaseName= snapshot.val().TrainName;
	var firebaseDestination= snapshot.val().Destination;
	var firebaseDeparture= snapshot.val().DepartureTime;
	var firebaseFrequency= snapshot.val().Frequency;
	var diffTime = moment().diff(moment.unix(firebaseDeparture), "minutes");
	var timeRemainder = moment().diff(moment.unix(firebaseDeparture), "minutes") % firebaseFrequency ;
	var minutes= firebaseFrequency - timeRemainder;
	var nextTrain= moment().add(minutes, "m").format("hh:mm A");
	
//input data while creating new data rows
	
	$("#trainDisplay > tbody").append("<tr><td>" + firebaseName + "</td><td>"+ firebaseDestination + "</td><td>"+ firebaseFrequency + "min" + "</td><td>" + minutes+ "min" +"</td><td>" +  nextTrain + "</td>");
	})
	})