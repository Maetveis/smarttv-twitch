var Log = new function() {
	var oldAlert = window.alert;
	var self = this;

	// all messages including SDK JS ALERT
	this.ALL = 0; 
	this.DEBUG = 1;
	this.WARN = 2;
	this.ERROR = 3;
	this.NONE = 4;

	this.level = self.WARN;

	this.init = function() {
		if (self.level > self.ALL) {
			oldAlert('Suppressing SDK [JS ALERT] messages.. You can enable them by using level = ALL');
			window.alert = function(ignored) { };
		}
		else if (window.alert !== oldAlert) {
			oldAlert('Enabling SDK [JS ALERT] log messages..');
			window.alert = oldAlert;
		}
	}

	this.debug = function(message) {
		if (self.level > self.DEBUG) {
			return;
		}

		self.log('DEBUG: ' + message);
	};

	this.warn = function(message) {
		if (self.level > self.WARN) {
			return;
		}

		self.log(' WARN: ' + message);
	};

	this.error = function(message) {
		self.log('ERROR: ' + message);
	};

	this.log = function(message) {
		if (self.level > self.ERROR) {
			return;
		}

		oldAlert(message);
	};
};

Log.init();