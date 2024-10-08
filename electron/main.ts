import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
const AWS = require('aws-sdk');
import fs from "fs";

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"; //TODO: Check this
process.env.DIST = path.join(__dirname, "../dist");
process.env.NODE_ENV = app.isPackaged 
  ? "production"
  : "development"
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// For better-sqlite3 initialize of Renderer process
ipcMain.handle("get-database-path", () =>
  path.join(app.getPath("userData"), "better-sqlite3.sqlite3")
);

// Listen for file upload request from renderer process
ipcMain.on('upload-file', (event, config) => {
  
  AWS.config.update(config)
  console.log('config', config)

  console.log(import.meta.env.VITE_AWS_ACCESS_KEY,)
  console.log(import.meta.env.VITE_AWS_SECRET,)
  console.log(import.meta.env.VITE_AWS_S3_BUCKET_NAME,)
  
  const s3 = new AWS.S3();
  const dbPath = path.join(app.getPath("userData"), "better-sqlite3.sqlite3")
  
  const shortPath = process.env.NODE_ENV.slice(0, 4)

  const fileStream = fs.createReadStream(dbPath);
  // const date = new Date().toLocaleString('en-CA', 
  //   { year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit'})
  //   .split(", ")[0].replaceAll("-", "_")

  const date = new Date().toISOString().replace('T', ' ').substring(0, 16).replace(/-/g, "_").replace(":", "_").replace(" ", "T")
  
  const params = {
    Bucket: config.bucket,
    Key: `h2-test-system/${shortPath}/${date}_${dbPath.split('/').pop()}`,  // File name in S3
    Body: fileStream,
  };

  s3.upload(params, (err:any, data:any) => {
    if (err) {
      console.error('Error uploading file: ', err);
      event.reply('upload-error', err);
    } else {
      console.log('Successfully uploaded file:', data);
      event.reply('upload-success', data.Location);  // Return S3 file URL
    }
  });
});

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(process.env.VITE_PUBLIC, "logo.svg"),
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: true, // Allow Ajax cross
      v8CacheOptions: "none",
    },
  });

  win.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "serial") {
        // Add logic here to determine if permission should be given to allow serial selection
        return true;
      }
      return false;
    }
  );

  win.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      event.preventDefault();
      const selectedPort = portList.find((device) => {
        console.log("device", device);
        console.log("port list", portList);
        return device.displayName == "H2Z-Tester";
      });
      if (!selectedPort) {
        // console.log("Port not selected");
        callback("");
      } else {
        // console.log("Port selected: ", selectedPort);
        callback(selectedPort.portId);
      }
    }
  );

  win.webContents.session.on('serial-port-revoked', (event, details) => {
    console.log(`Access revoked for serial device from origin ${details.origin}`)
  })

  win.webContents.session.on('serial-port-removed', (event, details) => {
    console.log(`Access to serial port has been removed ====>`)
    win?.webContents.send('serial-port-removed', "Port has been disconnected");
  })

  win.webContents.session.on('serial-port-added', (event, details) => {
    console.log(`Access to serial port has been added ====>`)
    win?.webContents.send('serial-port-added', "Port has been reconnected");
  })
  // win?.webContents.session.setDevicePermissionHandler((details) => {
  //   console.log('details ===========>', details)
  //   if (details.deviceType === "serial") {
  //     console.log('passed all checks')
  //     if (details.device.vendorId === 1155 && details.device.productId === 22336) {
  //       return true;
  //     }
  //   }
  //   return false;
  // });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // TODO: ISSUE is pathing in here
    const appPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app.asar/dist/')
    : path.join(__dirname);
    win.loadFile(path.join(appPath, 'index.html'))
    // win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}



app.on("window-all-closed", () => {
  app.quit();
  win = null;
});

app.whenReady().then(createWindow);
