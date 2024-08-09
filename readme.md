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
- `mv /home/zip/sambashare/dist/zip-mnfg-test-system-ui.AppImage /home/zip/zip-test-system/zip-mnfg-test-system-ui/AppImage`
- `chmod a+x ./zip-mnfg-test-system-ui.AppImage`
- `./zip-mnfg-test-system-ui.AppImage --appImage-extract`
- `cd squashfs-root/`
- `sudo chown root:root chrome-sandbox`
- `sudo chmod 4755 chrome-sandbox`
- `cd ..`
- `./squashfs-root/AppRun`


# TODO:
- Fill in readme.
- Make so that QR code scanner commits / submits on new line.
- Currently 'pass / fail' indication isn't showing correctly
- More graceful serial comms handling, especially on disconnect and reconnect
- TS / General tidy up
- Debian / Ubuntu testing.
- Move configuration to single file
- What does this mean? `if v_cell_unloaded is OK but have no resistance`
- Let Tim know what I'll be saving to SQLite
- Send first command as /n on first connect => What was reason for this?
- More testing with other units, especially faulty ones.
- Fix up pathing in linux distribution
- Write up better doucmentation in linux distribution
- Update output path in main.ts

Changes
- No timeout on success or failure. Use enter button to proceed.
- proceed on enter for any text input
- Pause on results screen on fail - press enter to continue.
- If resistance has an error, it will produce a 'resistance error' code.
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


