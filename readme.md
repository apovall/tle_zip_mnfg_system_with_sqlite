# ZIP Manufacturing Test Unit

# What

# How to use

# TODO:
- Make so that QR code scanner commits / submits on new line.


- Serial comms
  - If device ID is known https://www.electronjs.org/docs/latest/api/session#event-select-serial-port


## Notes 
Start test - initiated by me or test system? Yes from test system

Have to tell the device that resistance value has passed. Check whether I expected. Possibly only do after both blocks.

Have to tell the device that battery voltage is OK
v_cell_unloaded compared to internal reference. Hardcoded. 1.1v

v_cell_loaded recorded.

Resistance tolerance 5%. Harcoded.  = 5 %

Selecting resistor values via dropdown. Preference for display is 3.6k etc. = 3,600

Results recorded even if unit fails. Make fields nullable. 

if v_cell_unloaded is OK but have no resistance 

Let Tim know what I'll be saving to SQLite

send first command as /n on first connect.


TODO:
- save to database
- Get 'pass' to show
- Look into crash
