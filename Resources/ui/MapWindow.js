function MapWindow() {

	var errorHandle = require('/errorhandler');
	var locationAdded = false;

	Ti.Geolocation.preferredProvider = "gps";
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.purpose = "To obtain user location for tracking distance travelled.";

	var win = Ti.UI.createView({
		title : 'Traffic Analyzer Maps',
		backgroundColor : '#fff'
	});

	var arrow_img = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'images/arrow.gif');
	var imageCompassArrow = Titanium.UI.createImageView({
		image : arrow_img,
		right : 25,
		top : 5,
		zIndex : 100
	});

	win.add(imageCompassArrow);

	if (Titanium.Geolocation.hasCompass) {
		Titanium.Geolocation.headingFilter = 10;

		Ti.Geolocation.getCurrentHeading(function(e) {
			if (e.error) {
				return;
			}
			var x = e.heading.x;
			var y = e.heading.y;
			var z = e.heading.z;
			var magneticHeading = e.heading.magneticHeading;
			accuracy = e.heading.accuracy;
			var trueHeading = e.heading.trueHeading;
			timestamp = e.heading.timestamp;

			var rotateArrow = Titanium.UI.create2DMatrix();
			var angle = 360 - magneticHeading;
			rotateArrow = rotateArrow.rotate(angle);
			imageCompassArrow.transform = rotateArrow;
		});
	} else {
		Titanium.API.info("No Compass on device");
	}

	if (Titanium.Geolocation.locationServicesEnabled === false) {
		Titanium.UI.createAlertDialog({
			title : 'Traffic Analyzer',
			message : 'Your device has geolocation feature turned off - turn it on.'
		}).show();
	} else {
		if (Ti.Platform.osname != 'android') {
			var authorization = Titanium.Geolocation.locationServicesAuthorization;
			Ti.API.info('Authorization: ' + authorization);
			if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
				Ti.UI.createAlertDialog({
					title : 'Traffic Analyzer',
					message : 'You have disallowed Titanium from running geolocation services.'
				}).show();
			} else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
				Ti.UI.createAlertDialog({
					title : 'Traffic Analyzer',
					message : 'Your system has disallowed Titanium from running geolocation services.'
				}).show();
			}
		}
	}

	//33.7537359695088 -84.3881323128301
	var mapview = Titanium.Map.createView({
		top : 60,
		height : 'auto',
		mapType : Titanium.Map.STANDARD_TYPE,
		region : {
			longitude : -84.3881323128301,
			latitude : 33.7537359695088,
			latitudeDelta : 0.05,
			longitudeDelta : 0.05
		},
		animate : true,
		regionFit : true,
		userLocation : true
	});

	var locationCallback = function(e) {

		if (!e.success || e.error) {
			Ti.API.info("Code translation: " + e.error);
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;

		mapview.region = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			latitudeDelta : 0.05,
			longitudeDelta : 0.05
		};

		//Titanium.Geolocation.distanceFilter = 100; //changed after first location event

		Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
	locationAdded = true;

	/*
	 var addr = "Georgia State University Atlanta GA";
	 Titanium.Geolocation.forwardGeocoder(addr, function(evt) {
	 Ti.API.info('in forward ' + evt.latitude + ' ' + evt.longitude);
	 mapview.region = {
	 latitude : evt.latitude,
	 longitude : evt.longitude,
	 latitudeDelta : 0.05,
	 longitudeDelta : 0.05
	 }

	 });
	 */

	win.addEventListener('focus', function() {
		win.focusedflag = 1;
		Ti.API.info("focus event received");
		if (!locationAdded && locationCallback) {
			Ti.API.info("adding location callback on resume");
			Titanium.Geolocation.addEventListener('location', locationCallback);
			locationAdded = true;
		}
	});

	win.addEventListener('blur', function() {
		Ti.API.info("pause event received");
		if (locationAdded) {
			Ti.API.info("removing location callback on pause");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});

	win.add(mapview);
	return win;
};

module.exports = MapWindow;
