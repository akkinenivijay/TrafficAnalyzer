function SettingsWindow() {

	var win = Ti.UI.createView({
		title : 'Settings',
		backgroundColor : '#eee'
	});

	win.add(Ti.Facebook.createLoginButton({
		top : 300,
		zIndex : 100,
		style : Ti.Facebook.BUTTON_STYLE_WIDE
	}));

	return win;
};

module.exports = SettingsWindow;
