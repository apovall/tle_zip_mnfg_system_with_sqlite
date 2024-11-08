# ZIP Manufacturing Test Unit

# What

# How to use
- The test hardware needs to be named (have a `displayName` property of) `H2-Tester`. The system looks for this name across active comm ports, so its usage is never tied to a specific port.

# New Laptop Setup
1) Open terminal
2) `sudo apt-get update`
3) `sudo apt-get upgrade`
4) `sudo apt-get nvm`
5) `nvm install 22.1`
6) `python -m pip install setuptools`

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
    - node 22.1 using nvm
    - npm
    - You will need to install a new copy of python setuptools `python -m pip install setuptools` in order to natively build better-sqlite3
- You will need to add your user (`zip`) to the `dialout` group in order to access serial comms
  - `sudo usermod -a -G dialout <username>`
  - You will need to restart the laptop for this to take effect.
- If you're missing other dependencies (such as distutils), the build scripts will aggressively let you know about these.
- If there's already a project in `/home/zip/dev/tle_zip_mfng_system_with_sqlite`, delete the tle_zip_mfng_system_with_sqlite folder.
- Copy / clone / unzip the entire project directory, *minus node_modules, dist, dist-native and release* folders  to the target laptop, into the `/home/zip/dev/` folder.
  - SMBD sharing has been enabled on the laptop. Credentials for it are the same as the laptop user / password. 
  - Everything gets moved in an out via the /home/zip/sambashare folder
- `cd /home/zip/dev/tle_zip_mfng_system_with_sqlite`
- `npm install`
- `npm run buildDeb`
- This will produce a .AppImage file in the `release` folder
- Copy this into the folder on the desktop, replacing whatever is currently there
  - Note: the AppImage will not run from the desktop, due to permissions issues. Placing it in the folder and running it from there will work.


### serial port permissions on Ubuntu
If you can't read serial comms when the tester is plugged in, it's most likely being denied access by the system itself.
- Ensure the port and user are added to the correct dailout group

# Known Issues / Points for Discussion
## Dispenser Filling
- Each time a new dispenser ID is scanned, it is saved to the database (Serial# + Job ID). This is done so that data is at no point lost (given that a few hundred units will be scanned at any give time). It also means a job can be closed, reopened and continued on with at a later stage (does require the job ID to match exactly including case).
- - The issue with this is that it's not possible to _change_ the job name once a job has been started, as it would require reassinging all of the dispenser IDs. Including this feature is doable, it's just do we want to enable that functionality?
- Currently if navigating back to the Job Number screen and changing the job number - it won't update the job number for all of the existing dispensers scanned and it won't clear the list of scanned dispensers either. Should it do this?