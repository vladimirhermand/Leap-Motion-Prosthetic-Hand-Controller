
#include <Servo.h>

Servo thumb;  // create servo object to control a servo
Servo index;  // create servo object to control a servo
Servo middle;  // create servo object to control a servo
Servo annular;  // create servo object to control a servo

// These constants won't change:
const int sensorPin1 = A0;    // pin that the sensor is attached to
const int sensorPin2 = A1;    // pin that the sensor is attached to
const int sensorPin3 = A2;    // pin that the sensor is attached to
const int sensorPin4 = A3;    // pin that the sensor is attached to
const int sensorPin5 = A4;    // pin that the sensor is attached to


// variables:
int sensorValue1 = 0;         // the sensor value
int sensorValue2 = 0;         // the sensor value
int sensorValue3 = 0;         // the sensor value
int sensorValue4 = 0;         // the sensor value
int sensorValue5 = 0;         // the sensor value

int sensorMin1 = 1023;        // minimum sensor value
int sensorMax1 = 0;           // maximum sensor value

int sensorMin2 = 1023;        // minimum sensor value
int sensorMax2 = 0;           // maximum sensor value

int sensorMin3 = 1023;        // minimum sensor value
int sensorMax3 = 0;           // maximum sensor value

int sensorMin4 = 1023;        // minimum sensor value
int sensorMax4 = 0;           // maximum sensor value

int sensorMin5 = 1023;        // minimum sensor value
int sensorMax5 = 0;           // maximum sensor value


void setup() {
  annular.attach(10);  // attaches the servo on pin 9 to the servo object
  middle.attach(6);  // attaches the servo on pin 9 to the servo object
  thumb.attach(9);  // attaches the servo on pin 9 to the servo object
  index.attach(5);  // attaches the servo on pin 9 to the servo object

  // turn on LED to signal the start of the calibration period:
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
  Serial.begin(9600);
    Serial.println (" calibrating ...");

  // calibrate during the first five seconds
  while (millis() < 3000) {
  sensorValue1 = analogRead(sensorPin1);
  sensorValue2 = analogRead(sensorPin2);
  sensorValue3 = analogRead(sensorPin3);
  sensorValue4 = analogRead(sensorPin4);
  sensorValue5 = analogRead(sensorPin5);

  
    // record the maximum sensor value 1
    if (sensorValue1 > sensorMax1) {
      sensorMax1 = sensorValue1;
    }

    // record the minimum sensor value
    if (sensorValue1 < sensorMin1) {
      sensorMin1 = sensorValue1;
    }

      // record the maximum sensor value 2
    if (sensorValue2 > sensorMax2) {
      sensorMax2 = sensorValue2;
    }

    // record the minimum sensor value
    if (sensorValue2 < sensorMin2) {
      sensorMin2 = sensorValue2;
    }

  // record the maximum sensor value 3
    if (sensorValue3 > sensorMax3) {
      sensorMax3 = sensorValue3;
    }

    // record the minimum sensor value
    if (sensorValue3 < sensorMin3) {
      sensorMin3 = sensorValue3;
    }

  // record the maximum sensor value 4
    if (sensorValue4 > sensorMax4) {
      sensorMax4 = sensorValue4;
    }

    // record the minimum sensor value
    if (sensorValue4 < sensorMin4) {
      sensorMin4 = sensorValue4;
    }
  // record the maximum sensor value 5
    if (sensorValue5 > sensorMax5) {
      sensorMax5 = sensorValue5;
    }

    // record the minimum sensor value
    if (sensorValue5 < sensorMin5) {
      sensorMin5 = sensorValue5;
    }


    
  }
    Serial.println (" Calibration done !!");

  // signal the end of the calibration period
  digitalWrite(13, LOW);
}


void loop() {
  // put your main code here, to run repeatedly:

  sensorValue1 = analogRead(sensorPin1);
  sensorValue2 = analogRead(sensorPin2);
  sensorValue3 = analogRead(sensorPin3);
  sensorValue4 = analogRead(sensorPin4);
  sensorValue5 = analogRead(sensorPin5);

  
  // apply the calibration to the sensor reading
  sensorValue1 = map(sensorValue1, sensorMin1, sensorMax1, 180, 0);
  sensorValue2 = map(sensorValue2, sensorMin2, sensorMax2, 180, 0);
  sensorValue3 = map(sensorValue3, sensorMin3, sensorMax3, 180, 0);
  sensorValue4 = map(sensorValue4, sensorMin4, sensorMax4, 180, 0);
  sensorValue5 = map(sensorValue5, sensorMin5, sensorMax5, 180, 0);



  // in case the sensor value is outside the range seen during calibration
  sensorValue1 = constrain(sensorValue1, 0, 180);
  sensorValue2 = constrain(sensorValue2, 0, 180);
  sensorValue3 = constrain(sensorValue3, 0, 180);
  sensorValue4 = constrain(sensorValue4, 0, 180);
  sensorValue5 = constrain(sensorValue5, 0, 180);


    Serial.print("  thumb : ");
    Serial.print(sensorValue1);
 Serial.print("  index : ");
    Serial.print(sensorValue2);
  Serial.print("  middle : ");
    Serial.print(sensorValue3);
  Serial.print("  annular : ");
    Serial.print(sensorValue4);
  Serial.print("  pinkie : ");
    Serial.println(sensorValue5);




 thumb.write(sensorValue1);                  // sets the servo position according to the scaled value
  delay (10);
 index.write(180 - sensorValue2);                  // sets the servo position according to the scaled value
 delay (10);
middle.write(180 - sensorValue3);                  // sets the servo position according to the scaled value
 delay (10);
annular.write(180 - sensorValue4);                  // sets the servo position according to the scaled value
delay (10);
}
