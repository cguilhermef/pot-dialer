from gpiozero import Button, MCP3008
from signal import pause
import requests
import smbus
import time

dialer_01 = MCP3008(0);
dialer_02 = MCP3008(7);

btn_a_send = Button(23)
btn_a_erase = Button(24)
btn_b_send = Button(27)
btn_b_erase = Button(22)
bus = smbus.SMBus(1)
address = 0x04

terminal_a_letter = 'x';
terminal_b_letter = 'Y';

def writeNumber(value):
        bus.write_byte(address, value)
        return -1

def a_send():
    requests.post(url = "http://localhost:3000/api/write", json = {
      'terminal':1,
      'letter': chr(terminal_a_letter + 65)    
    });

def b_send():
    requests.post(url = "http://localhost:3000/api/write", json = {
      'terminal':2,
      'letter': chr(terminal_b_letter + 65)
    });


def a_erase():
    requests.post(url = "http://localhost:3000/api/erase", json = {
      'terminal':1,
    });


def b_erase():
    requests.post(url = "http://localhost:3000/api/erase", json = {
      'terminal':2,
    });

btn_a_send.when_pressed = a_send
btn_a_erase.when_pressed = a_erase
btn_b_send.when_pressed = b_send
btn_b_erase.when_pressed = b_erase

while True:
  
  terminal_a_letter = int((dialer_01.value * 1023)/39.49)
  terminal_b_letter = int((dialer_02.value * 1023)/39.49)
  writeNumber(terminal_a_letter + 100);
  writeNumber(terminal_b_letter + 200);
  time.sleep(.15)

pause()
