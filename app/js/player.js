var Player = new function() {
	'use strict';

	var self = this;
	
	var player;
	
	var url;
	var retryCount = 0;
	var maxRetries = 3;

	var isBuffering = false;

	/**
	 * Initializes the player component using, the element with given ID.
	 * Switches Player to fullscren mode and binds most events.
	 *
	 * @param id the id of the player component
	 */
	this.init = function(id) {
		player = document.getElementById(id);
		// 960x540 means maximum resolution of the display
		player.SetDisplayArea(0, 0, 960, 540);

		player.OnConnectionFailed = function() {
			if (++retryCount < maxRetries) {
				Log.warn('Player.retry(' + retryCount + ', ' + maxRetries + ')');
				self.play(url);
			}
			else {
				Log.error('Player.onError(connection)');

				signalBufferingEnd();

				self.stop();
				self.onError('connection');
			};
		};

		player.OnNetworkDisconnected = function() {
			Log.error('Player.onError(network)');

			signalBufferingEnd();

			self.stop();
			self.onError('network');
		};

		player.OnRenderError = function() {
			Log.error('Player.onError(renderer)');

			signalBufferingEnd();

			self.stop();
			self.onError('renderer');
		};

		player.OnAuthenticationFailed = function() {
			Log.error('Player.onError(authentication)');

			signalBufferingEnd();

			self.stop();
			self.onError('authentication');
		};

		player.OnStreamNotFound = function() {
			Log.error('Player.onError(notfound)');

			signalBufferingEnd();

			self.stop();
			self.onError('notfound');
		};

		player.OnRenderingComplete = function() {
			Log.debug('Player.onCompleted()');

			self.stop();
			self.onCompleted();
		};

		player.OnBufferingStart = function() {
			Log.debug('Player.onBufferingStarted()');

			isBuffering = true;
			self.onBufferingStarted();
		};

		player.OnBufferingComplete = function() {
			Log.debug('Player.onBufferingEnded()');

			signalBufferingEnd();
		};

		function signalBufferingEnd() {
			if (isBuffering) {
				isBuffering = false;
				self.onBufferingEnded();
			}
		}
		
		player.OnBufferingProgress = function (progress) { 
			retryCount = 0; 
			isBuffering = true;

			Log.debug('Player.onBufferingProgress('+ progress +')');
			self.onBufferingProgress(progress);
		};
	};

	/**
	 * Begins playing the specified source url at fullscreen. 
	 * If there is some other playback in progress it is automatically stopped.
	 */
	this.play = function(source) {
		self.stop();

		url = source;
		Log.debug('Player.play('+ source +')');
		player.Play(url);
		player.SetDisplayArea(0, 0, 960, 540);
	}

	/**
	 * Stops current playback if there is any
	 */
	this.stop = function() {
		Log.debug('Player.stop()');

		retryCount = 0; 
		player.Stop();
	}
	
	this.onError = function() {};
	this.onCompleted = function() {};
	this.onStarted = function() {};

	this.onBufferingProgress = function(progress) {};
	this.onBufferingStarted = function() {};
	this.onBufferingEnded = function() {};
};
