# ZIP Manufacturing Test Unit

# What

# How to use
- The test hardware needs to be named (have a `displayName` property of) `H2Z-Tester`. The system looks for this name across active comm ports, so its usage is never tied to a specific port.

# Build Process
## Mac
System was developed on Mac ARM64
- Checkout repo
- `npm install`
- This will also run the postinstall script, which should rebuild better-sqlite3 for ARM64
- `npm run buildMac`
- The output is in the `release` folder
- Look for the .dmg file.
- There is also an 'unpacked' folder has a copy of the program in it which can be run directly, to confirm everything works.

## Ubuntu
- The laptop already has all of the configuration & libraries needed to build for Ubuntu.
  - A fresh install of Ubuntu has most of what's needed.
  - If not, then install:
    - nvm
    - node 22.1 via nvm
    - npm
    - You will need to install a new copy of python setuptools `python -m pip install setuptools` in order to natively build better-sqlite3
- If you're missing other dependencies (such as distutils), the build scripts will aggressively let you know about these.
- If there's already a project in `/home/zip/dev/`, delete everything in the `dev` folder.
  - `sudo rm -rf <folder_name>`. A GUI based delete won't work as some permissions need to be set for the underlying chrome-sandbox move ownership to root instead of zip.
- Copy / clone / unzip the entire project directory, *minus node_modules* to the target laptop, into the `/home/zip/dev/` folder.
  - SMBD sharing has been enabled on the laptop. Credentials for it are the same as the laptop user / password. 
  - Everything gets moved in an out via the /home/zip/sambashare folder
- Run `npm install`
- It will work for installing the node_modules, but will fail when it gets to running the `postinstall` script - due to permission issues.
- Run:
  - `sudo chown root:root node_modules/electron/dist/chrome-sandbox` 
  - `sudo chmod 4755 node_modules/electron/dist/chrome-sandbox`
  - `npm run rebuild`
    - This should rebuild the nominated better-sqlite3 package for linux x64
- `npm run buildDeb`
- Look for the .AppImage file in the `release` folder
- Move the .AppImage to the ZIP Test System folder on the desktop (Ubuntu seems to have very restrictive permissions around running AppImages from the desktop, which I haven't had the time time to work around yet.)

### serial port permissions on Ubuntu
If you can't read serial comms when the tester is plugged in, it's most likely being denied access by the system itself.
- Ensure the port and user are added to the correct dailout group

## Windows

# TODO:
- [x] Save batch 
- [x] Save loaded resistance
- [x] Save timestap stamp
- More graceful serial comms handling, especially on disconnect and reconnect
  - Lock serial comms read until at the results page?
- Windows build
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


