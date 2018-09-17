/*
 * L.Control.Info is used for displaying information of the actual map.
 */

L.Control.Info = L.Control.extend({
	options: {
		position: 'bottomright'
	},

	onAdd: function (map) {
		this._map = map;
		this._controlHint = hint;
		this._hints = json.hints;
		this._transformer = {
			geoCoordsToDofusCoords
		};

		var className = 'leaflet-control-info',
			container = this._container = L.DomUtil.create('div', className)

		//label containers
		this._listContainer = L.DomUtil.create('ul', 'list-group uiElement uiHidden bg-dark', container);

		//connect to mouseevents
		map.on("mousemove", this._update, this);
		// map.on("move", this._pause, this);
		// map.on("moveend", this._unpause, this);

		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off("move", this._pause, this);
		map.off("moveend", this._unpause, this);
	},

	/**
	 *	Mousemove callback function updating labels and input elements
	 */
	_update: function (evt) {
		let geoCoords = evt.latlng;
		if (geoCoords) {
			const [x, y] = this._transformer.geoCoordsToDofusCoords(geoCoords);
			let mapInfo = this._getMapInfo(x, y)
			if (!mapInfo) {
				L.DomUtil.addClass(this._listContainer, "uiHidden");
				this._listContainer.innerHTML = "";
				return;
			}
			L.DomUtil.removeClass(this._listContainer, "uiHidden");
			this._listContainer.innerHTML = "";
			for (const key in mapInfo) {
				L.DomUtil.create('li', 'list-group-item bg-dark', this._listContainer)
					.innerHTML = `<img src="./data/assets/hint/${mapInfo[key].gfx}.png" class="mr-2">${mapInfo[key].nameId}`
			}

			// if (this._subAreas[x][y].length > 1) {
			//     thus._list.innerHTML += " & " + this._t("subArea." + this._subAreas[x][y][1].id);
			// }
		}
	},

	_getMapInfo: function (x, y) {
		let activatedHints = [],
			elementOnMap = [];
		for (const key in this._controlHint) {
			switch (key) {
				case "class":
					if (hint[key]._map) {
						if (hint[key]._map._loaded) {
							activatedHints.push(1)
						}
					}
					break;
				case "misc":
					if (hint[key]._map) {
						if (hint[key]._map._loaded) {
							activatedHints.push(4)
						}
					}
					break;
				case "workshop":
					if (hint[key]._map) {
						if (hint[key]._map._loaded) {
							activatedHints.push(3)
						}
					}
					break;
				case "market":
					if (hint[key]._map) {
						if (hint[key]._map._loaded) {
							activatedHints.push(2)
						}
					}
					break;
				case "dungeon":
					if (hint[key]._map) {
						if (hint[key]._map._loaded) {
							activatedHints.push(6)
						}
					}
					break;
				case "lair":
					if (hint[key]._map) {
						if (hint[key]._map._loaded) {
							activatedHints.push(9)
						}
					}
					break;
				default:
					break;
			}
		}
		for (const iterator of activatedHints) {
			for (const key in this._hints) {
				if (this._hints[key].worldMapId === 1 && this._hints[key].x === x && this._hints[key].y === y && this._hints[key].categoryId === iterator) {
					elementOnMap.push(this._hints[key])
				}
			}
		}
		if (elementOnMap.length > 0) {
			return elementOnMap;
		} else {
			return false
		}
	},

	_pause: function (evt) {
		this._map.off("mousemove", this._update, this);
		L.DomUtil.addClass(this._listContainer, "uiHidden");
	},

	_unpause: function (evt) {
		this._map.on("mousemove", this._update, this);
	}
});

//constructor registration
L.control.info = function (options) {
	return new L.Control.Info(options);
};

//map init hook
L.Map.mergeOptions({
	infoControl: false
});

L.Map.addInitHook(function () {
	if (this.options.infoControl) {
		this.infoControl = new L.Control.Info();
		this.addControl(this.infoControl);
	}
});
