"use strict";

/* eslint-env node */
const createWindowsInstaller = require("electron-winstaller").createWindowsInstaller;
const path = require("path");

getInstallerConfig().then(createWindowsInstaller).catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

function getInstallerConfig() {
  console.log("windows kurulum paketi oluşturuluyor");
  const rootPath = path.join("./");
  const outPath = path.join(rootPath, "dist");

  return Promise.resolve({
    appDirectory: path.join(outPath, "Solfej\ MP-win32-x64"),
    authors: "Bikalab",
    noMsi: true,
    outputDirectory: path.join(outPath, "windows-installer"),
    iconUrl: "https://bikalab.github.io/solfej/img/solfej.png",
    exe: "Solfej.exe",
    setupExe: "SolfejInstaller.exe",
    setupIcon: path.join(rootPath, "img/solfej.png"),
    skipUpdateIcon: true
  });
}
