# ZIP Manufacturing Test Unit

# What

# How to use

# Getting AppImage Running in Ubuntu
TODO: Turn this into an install script
TOOD: Create build script that builds, and also moves bashscript into `dist` folder
- Create new linux build
- Use Samba to transfer dist folder to laptop
  - Run `hostname -I` on laptop
  - Connect to smb / samba via smb://<hostip>/sambashare
- Drop `dist` folder in `sambashare`
- `cp /home/zip/sambashare/dist/zip-mnfg-test-system-ui-0.1.0.AppImage /home/zip/zip-test-system/zip-mnfg-test-system-ui.AppImage`
- `cd /home/zip/zip-test-system/`
- 'rm -rf squashfs-root'
- ~~`chmod a+x ./zip-mnfg-test-system-ui.AppImage`~~
- `./zip-mnfg-test-system-ui.AppImage --appimage-extract`
- `cd squashfs-root/`
- `sudo chown root:root chrome-sandbox`
- `sudo chmod 4755 chrome-sandbox`
  - Can also run the chown and chmod commands on the .AppImage file directly
- `cd ..`
- `./AppRun`

## serial port permissions on Ubuntu
If you can't read serial comms when the tester is plugged in, it's most likely being denied access by the syste itself.
1. Find serial port name. Run .AppImage above (without sudo but with --no-sandbox), in order to get  terminal output
2. Look for device name and associated port
3. set `sudo chmod 666 /dev/ttyACM0`


<!-- ## new version
- Drop `dist` folder in `sambashare`
- Move entire dist folder
- `cp /home/zip/sambashare/dist/ /home/zip/zip-test-system/zip-mnfg-test-system-ui.AppImage`
- `cd /home/zip/zip-test-system/`
- 'rm -rf squashfs-root'
- `sudo chmod a+x zip-mnfg-test-system-ui-0.1.0.AppImage`
- `sudo chown root:root zip-mnfg-test-system-ui-0.1.0.AppImage`
- `sudo chmod 4755 zip-mnfg-test-system-ui-0.1.0.AppImage`
- `./zip-mnfg-test-system-ui.AppImage --appImage-extract`
- `cd squashfs-root/`
  - Can also run the chown and chmod commands on the .AppImage file directly
- `cd ..`
- `./AppRun` -->


# TODO:
- Save batch 
- Save loaded resistance
- Save timestap stamp
- More graceful serial comms handling, especially on disconnect and reconnect
- Windows build
- Fill in readme.
  - Write build steps on Linux (or look at Github actions)
  - Write up better doucmentation in linux distribution
- [x] Fix up pathing in linux distribution
- [x] No timeout on success or failure. Use enter button to proceed.
- [x] proceed on enter for any text input
- If resistance has an error, it will produce a 'resistance error' code.
- [x] Currently 'pass / fail' indication isn't showing correctly
- [x] Debian / Ubuntu testing.
- Move configuration to single file
- [x] Let Tim know what I'll be saving to SQLite
- [x] Make so that QR code scanner commits / submits on new line.
- TS / General tidy up

- Serial comms
  - If device ID is known https://www.electronjs.org/docs/latest/api/session#event-select-serial-port

Ubuntu install instructions:
`$ sudo apt-get install build-essential clang libdbus-1-dev libgtk-3-dev \
                       libnotify-dev libasound2-dev libcap-dev \
                       libcups2-dev libxtst-dev \
                       libxss1 libnss3-dev gcc-multilib g++-multilib curl \
                       gperf bison python3-dbusmock openjdk-8-jre`

sudo apt update
sudo apt upgrade
sudo apt install libfuse2t64


