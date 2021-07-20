const _LEVELSADDON_STREAMVIEW_MODULENAME = "levels-addon-stream-view";
let _LEVELSADDON_STREAMVIEW_ListOfPlayers = { ['unknownPlayerId']: '' };

Hooks.once('ready', () => {
	// Get Users For Settings
	game.users.forEach((user) => {
		_LEVELSADDON_STREAMVIEW_ListOfPlayers[user.id] = user.name;
	});
});

Hooks.on("init", () => {
	game.settings.register(_LEVELSADDON_STREAMVIEW_MODULENAME, 'streamUserId', {
		name: game.i18n.localize(`${_LEVELSADDON_STREAMVIEW_MODULENAME}.settings.stream-user-id.name`),
		hint: game.i18n.localize(`${_LEVELSADDON_STREAMVIEW_MODULENAME}.settings.stream-user-id.hint`),
		scope: 'world',
		config: true,
		restricted: true,
		choices: _LEVELSADDON_STREAMVIEW_ListOfPlayers,
		default: 'unknownPlayerID',
		type: String,
	});
});

Hooks.on('levelsReady', () => {
	_levels.UI.refreshLevels = () => {
		_levels.UI.range = _levels.UI.definedLevels[_levels.UI.currentLevel];

		if (game.settings.get(_LEVELSADDON_STREAMVIEW_MODULENAME, "streamUserId") != 'unknownPlayerId') {
      		setStreamTokenElevation(_levels.UI.range);
    	}

		_levels.UI.renderHud(_levels.UI.rangeEnabled);
    	_levels.UI.computeLevelsVisibility(_levels.UI.range);
	}
	
	setStreamTokenElevation = (range) => {
		let streamUserToken = canvas.tokens.placeables.filter(token => {
			return token.actor.data.permission[game.settings.get(_LEVELSADDON_STREAMVIEW_MODULENAME, "streamUserId")] == 3;
		});
		
		// Check if token was found
		if (streamUserToken.length > 0) {
			streamUserToken[0].update({
				elevation: range[0]
			});
		}
	}
});