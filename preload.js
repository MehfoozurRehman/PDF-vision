const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFileDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  saveFileDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),
  
  // Menu events
  onMenuOpenFile: (callback) => ipcRenderer.on('menu-open-file', callback),
  onMenuNewFile: (callback) => ipcRenderer.on('menu-new-file', callback),
  onMenuSaveFile: (callback) => ipcRenderer.on('menu-save-file', callback),
  onMenuSaveAsFile: (callback) => ipcRenderer.on('menu-save-as-file', callback),
  onMenuMergePdfs: (callback) => ipcRenderer.on('menu-merge-pdfs', callback),
  onMenuSplitPdf: (callback) => ipcRenderer.on('menu-split-pdf', callback),
  onMenuSignDocument: (callback) => ipcRenderer.on('menu-sign-document', callback),
  onMenuShowAbout: (callback) => ipcRenderer.on('menu-show-about', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // Node.js APIs (limited and secure)
  path: {
    join: (...args) => require('path').join(...args),
    dirname: (path) => require('path').dirname(path),
    basename: (path) => require('path').basename(path),
    extname: (path) => require('path').extname(path)
  },
  
  // File system operations (secure)
  fs: {
    readFile: (path) => require('fs').promises.readFile(path),
    writeFile: (path, data) => require('fs').promises.writeFile(path, data),
    exists: (path) => require('fs').promises.access(path).then(() => true).catch(() => false)
  }
});

// Expose a limited crypto API for PDF signing
contextBridge.exposeInMainWorld('cryptoAPI', {
  generateKeyPair: () => {
    const forge = require('node-forge');
    const keys = forge.pki.rsa.generateKeyPair(2048);
    return {
      privateKey: forge.pki.privateKeyToPem(keys.privateKey),
      publicKey: forge.pki.publicKeyToPem(keys.publicKey)
    };
  },
  
  createCertificate: (keyPair, subject) => {
    const forge = require('node-forge');
    const cert = forge.pki.createCertificate();
    
    cert.publicKey = forge.pki.publicKeyFromPem(keyPair.publicKey);
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    
    const attrs = [
      { name: 'commonName', value: subject.commonName || 'PDF Vision User' },
      { name: 'countryName', value: subject.country || 'US' },
      { shortName: 'ST', value: subject.state || 'State' },
      { name: 'localityName', value: subject.locality || 'City' },
      { name: 'organizationName', value: subject.organization || 'MF Visions' },
      { shortName: 'OU', value: subject.organizationalUnit || 'PDF Vision' }
    ];
    
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    
    const privateKey = forge.pki.privateKeyFromPem(keyPair.privateKey);
    cert.sign(privateKey);
    
    return forge.pki.certificateToPem(cert);
  }
});

// Security: Remove any global Node.js objects
delete global.require;
delete global.exports;
delete global.module;
delete global.__dirname;
delete global.__filename;
delete global.process;
delete global.Buffer;
delete global.setImmediate;
delete global.clearImmediate;