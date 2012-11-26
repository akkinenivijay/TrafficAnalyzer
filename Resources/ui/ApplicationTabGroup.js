function ApplicationTabGroup() {
	var self = Ti.UI.createTabGroup();

	var MapWindow = require('ui/MapWindow');
	var SettingsWindow = require('ui/SettingsWindow');
	
	var mapWin = new MapWindow(), settingsWin = new SettingsWindow();

	var tab1 = Ti.UI.createTab({
		title : 'Map',
		window : mapWin
	});

	var tab2 = Ti.UI.createTab({
		title : 'Settings',
		window : settingsWin
	});

	self.addTab(tab1);
	self.addTab(tab2);

	return self;
};

module.exports = ApplicationTabGroup;
