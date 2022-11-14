const {app, components, BrowserWindow} = require('electron');
const contextMenu = require('electron-context-menu');
app.commandLine.appendSwitch('enable-tcp-fastopen')

contextMenu({
	prepend: (defaultActions, params, browserWindow, dictionarySuggestions) => [
		{
			label: 'Search Google for “{selection}”',
			// Only show it when right-clicking text
			visible: params.selectionText.trim().length > 0,
			click: () => {
				shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
			}
		}
	]
});

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 750,
    icon: __dirname + '/icon.png',
    backgroundColor: '#2C2C2C',
    webPreferences: {
     contextIsolation: true,
     spellcheck: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('splash.html')
  setTimeout(function () {
    mainWindow.loadURL('https://www.starplus.com/pt-br/login');
  }, 3000) // Load store page after 3 secs
  mainWindow.maximize() // start maximized
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setMenu(null)
  mainWindow.show();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.on('widevine-ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.whenReady().then(async () => {
  await components.whenReady();
  console.log('components ready:', components.status());
  createWindow();
});
