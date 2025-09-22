# WuPark
Senior Design Project 

## Send/Receive Datatype
The data sent/received will be in the following format:

Byte 1: To be interpreted as an integer, will tell the backend how many further bytes to read (minimum of one)

Byte 2: To be interpreted as an integer, will hold the lot number

Bytes 3-n: each bit of trailing bytes will represent the status of a parking spot - 1 means taken, 0 means empty

### Example: Three bytes

00000010 00000101 10100011

The preceding sequence tells us the following: 

1. Byte 1, the leftmost byte, has a value of 2, telling us to expect 2 further bytes
1. Byte 2 has a value of 5 - we're receiving this message from Lot 5
1. Byte 3's bits tell us that there are four taken spots and four empty spots

Future implementations may include a signing or checksum to verify data integrity