import smbus
import time
bus = smbus.SMBus(1)
address = 0x04

def writeNumber(value):
	bus.write_byte(address, value)
	return -1

def readNumber():
	number = bus.read_byte(address);
	return number

while True:
	var = input("Enter 1 - 9")
	if not var:
		continue
	
#	bus.write_byte(address, 1);
#	time.sleep(1)
#	bus.write_byte(address, 'A');
#	time.sleep(1)
#        bus.write_byte(address, 0);
	writeNumber(var)
	print "RPI: Hi, sent ", var
	time.sleep(1)

	number = readNumber()
	print "Hey, received", number
#print
