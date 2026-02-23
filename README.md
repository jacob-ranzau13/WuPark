Senior Design Project – Hardware & Setup Guide

Hardware Components 

1. Rasberry Pi
   We use a Raspberry Pi to run our system and send camera data to the main computer.

   Why we need it:
    1. Low-cost processing unit.
    2. Captures and processes image data locally 
    3. Publishes data to the local machine via MQTT
    4. Enables real-time system deployment without need a desktop computer.

2. Camera Attachment
   We use the Rasberry Pi Camera Module

   Why we need it:
    1. Captures live images.
    2. Enables real-time visula data collection.
    3. Provides image streams that are processed and transmitted via MQTT.

SoftWare Installation & Setup

Step 1 - Prepare the Raspberry Pi
    1. Install Raspberry Pi OS using Pi Imager.
    2. Boot the device and ensure:
       1. Camera interface is enabled:
          1. sudo raspi-config
       2. Navigate:
          1. Interface Options -> Camera -> Enable
    3. Update the system:
       1. sudo apt update 

Step 2 - Install Python Packages

MQTT Communication Library

We use paho-mqtt for message communication between: 
    1. Raspberry Pi
    2. Local machine
 1. Both devices must install this package:
    1. pip install paho-mqtt
   Reference: https://pypi.org/project/paho-mqtt/

 Camera Library (Raspberry Pi Only)

 The Raspberry Pi requires picamera2 to interface woth the camera module.

 Install on Raspberry Pi:
    1. pip install picamera2
   Reference: https://pypi.org/project/picamera2/0.2.2/

System Overview
   1. Raspberry Pi:
      1. Captures image data using picamera2
      2. Processes data as needed.
      3. Publishes data via MQTT using paho-mqtt.
   2.  Local Machine:
       1.  Subscribes to MQTT topics.
       2.  Receives image or data messages. 
       3.  Performs addtional processing, visualization, or analysis.  



