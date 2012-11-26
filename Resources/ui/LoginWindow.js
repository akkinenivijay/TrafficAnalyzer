function LoginWindow() {

	var loginview = Ti.UI.createView({
		title : 'Traffic Analyzer',
		backgroundColor : '#000'
	});

	Ti.Facebook.appid = '411548952233760';
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream'];

	loginview.add(Ti.Facebook.createLoginButton({
		top : 105,
		zIndex : 100,
		style : Ti.Facebook.BUTTON_STYLE_WIDE
	}));

	return loginview;
};

module.exports = LoginWindow;
