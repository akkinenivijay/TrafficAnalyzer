// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

var LoginWindow = require('ui/LoginWindow');
var facebookLoginWindow = new LoginWindow();

var MapWindow = require('ui/MapWindow');
var mapWindow = new MapWindow();

var SettingsWindow = require('ui/SettingsWindow');
var settingsWindow = new SettingsWindow();

var rootwin = Ti.UI.createWindow({
	title : 'Traffic Analyzer',
	exitOnClose : true
});

Ti.Facebook.addEventListener('login', function(e) {
	if (e.success) {
		rootwin.remove(facebookLoginWindow);
		rootwin.add(mapWindow);
	} else if (e.error) {
		alert(e.error);
	} else if (e.cancelled) {
		alert("Canceled");
	}
});

Ti.Facebook.addEventListener('logout', function(e) {
	rootwin.remove(settingsWindow);
	rootwin.add(facebookLoginWindow);
});

if (Ti.Facebook.loggedIn) {
	rootwin.add(mapWindow);
	rootwin.open();
} else {
	rootwin.add(facebookLoginWindow);
	rootwin.open();
}