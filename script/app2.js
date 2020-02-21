// IMPORT NEEDED MODULES AND SCRIPTS
var five = require("johnny-five"),
	handToHand = require('../lib/handToHand'),
	Leap = require("../lib/index"),
	board, servo;

// ASSIGN ARDUINO BOARD
board = new five.Board();

// ASSIGN SERVOS SENSIBILITY (THIS IS THE ANGLES THRESHOLD)
servoSensibility = {'pollice': 0, 'indice': 2, 'medio': 2, 'anulare': 2, 'mignolo': 2};


// ASSIGN LEAP MOTION CONTROLLER
var controller = new Leap.Controller()

// THIS OBJECT CONTAINS ID-SERVOS ASSOCIATIONS
var idsToServos = {};

// THIS OBJECT CONTAINS DI-X_COORDINATES
var idsToStabilizedX = {};

// THIS OBJECT CONTAINS LATEST SERVOS ANGLES
var oldServoAngles = {};

// THIS ARRAY CONTAINS ALL SERVOS
var servoFinger = new Array();

// ASSIGN THIS VARIABLE TO ALL USEFUL FUNCTIONS LOADED WITH /lib/handToHand
handToHand = new handToHand();

/********************************************************************************************************/
/************************************* ARDUINO AND SERVOS RELATED PART **********************************/
/********************************************************************************************************/

board.on("ready", function() {

	// DEFINING ALL SERVOS CONNECTED TO ARDUINO PWM PORTS

	// PINKIE
	servoFinger['mignolo'] = new five.Servo({
		pin: 10, // Servo 1
		range: [0, 180], // Default: 0-180
		type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
		startAt: 180, // if you would like the servo to immediately move to a degree
		center: false // overrides startAt if true and moves the servo to the center of the range
	});

	// ANNULAR
	servoFinger['anulare'] = new five.Servo({
		pin: 3, // Servo 3
		range: [0, 180], // Default: 0-180
		type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
		startAt: 180, // if you would like the servo to immediately move to a degree
		center: false // overrides startAt if true and moves the servo to the center of the range
	});

	// MIDDLE FINGER
	servoFinger['medio'] = new five.Servo({
		pin: 6, // Servo 5
		range: [0, 180], // Default: 0-180
		type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
		startAt: 180, // if you would like the servo to immediately move to a degree
		center: false // overrides startAt if true and moves the servo to the center of the range
	});

	// THUMB
	servoFinger['pollice'] = new five.Servo({
		pin: 9, // Servo 2
		range: [0, 180], // Default: 0-180
		type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
		startAt: 0, // if you would like the servo to immediately move to a degree
		center: false // overrides startAt if true and moves the servo to the center of the range
	});

	// INDEX FINGER
	servoFinger['indice'] = new five.Servo({
		pin: 5, // Servo 4
		range: [0, 180], // Default: 0-180
		type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
		startAt: 180, // if you would like the servo to immediately move to a degree
		center: false // overrides startAt if true and moves the servo to the center of the range
	});



	// RETRIEVE LEAP MOTION FRAMES
	controller.on("frame", function(frame) {

		 // NUMBER OF DETECTED HANDS BY LEAP MOTION 
	    var nHands = frame.hands.length;

	    // IF THERE IS JUST 1 HAND
	    if(nHands == 1){

	    	// RETRIEVE THE HAND OBJECT
  			var hand = frame.hands[0];

  			// RETRIEVE FINGER OBJECT
  			var finger_obj = hand.fingers;

  			// FIND THE NUMBER OF DETECTED FINGERS
  			detectedFingers = finger_obj.length;

  			// IF THERE ARE SOME DETECTED FINGERS
  			if(detectedFingers > 0){

  				// IF THE ID-SERVOS OBJECT IS NOT VALID WE MUST RENEW IT
  				if(handToHand.checkIdsToServos(finger_obj, idsToServos) == false){

  					// TO RENEW THE OBJECT WE NEED A FULL OPENED HAND
  					if(detectedFingers == 5){

  						// FIRST WE CLEAN THE OBJECT
						delete idsToServos;
						idsToServos = {};

						// THEN WE RENEW IT
						idsToServos = handToHand.refreshIdsToServos(finger_obj);

						/* JUST SOME DEBUG
						for (var key in idsToServos) {

				          var nome_servo = idsToServos[key];
				          var id_leap = key;

				          console.log('ID: '+id_leap+', SERVO: '+nome_servo);

				        }
				        */

					} else
						console.log("Place your open hand to recalibrate the device!");

				// ELSE IF THE OBJECT IS VALID WE CAN PROCEED
  				} else {

  					// IF SOME FINGERS WERE NOT DETECTED THEN WE MUST SEARCH AND CLOSE THEM
					if(detectedFingers < 5){
						
						// FIND AND CLOSE ABSENT FINGERS
						handToHand.closeAbsentFingers(finger_obj, idsToServos, servoFinger);

					}

					// NOW FOR EACH DETECTED FINGER
					for( var j = 0; j < detectedFingers; j++ ){

						// ASSIGN THIS FINGER
						var this_finger = finger_obj[j];

			        	// RETRIEVE FINGER ID ASSIGNED BY LEAP MOTION
			        	var this_finger_id = this_finger.id;

			        	// RETRIEVE RELATED SERVO
			        	var servo = idsToServos[this_finger_id];

			        	// CALCULATING THE ANGLE BETWEEN THE PALM NORMAL AND FINGER DIRECTION
			        	var fingerAngle = handToHand.vectorAngle(hand.palmNormal, this_finger.direction).toFixed(0);

			        	// LET'S MOVE THE SERVO IF THE SENSIBILITY THRESHOLD IS EXCEEDED
			      		handToHand.moveFingerTo(servoFinger, fingerAngle, servo, oldServoAngles, servoSensibility);
			      		
					}

  				}

  			} else {

  				// MAKE A FIST
  				handToHand.punch(servoFinger);

  				// CLEAN THE ID-SERVOS OBJECT
				delete idsToServos;
				idsToServos = {};
  			}


	    } else {

	    	// RELAX THE HAND AND SHOW THE ALERT
	    	handToHand.relax(servoFinger);
	    	console.log("Please, place one hand...");
	    }
	    	

	});


}); // BOARD READY CLOSE


/*********************************************************************************************************/
/******************************** LEAP MOTION STATUS AND INITIALIZATION **********************************/
/*********************************************************************************************************/

controller.on('ready', function() {
    console.log("Leap Motion is ready...");
});

controller.on('deviceConnected', function() {
    console.log("Leap Motion is connected...");
});

controller.on('deviceDisconnected', function() {
    console.log("Leap Motion is disconnected...");
});

// CONNECT TO THE LEAP MOTION
controller.connect();


