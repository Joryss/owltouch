/*
 * L.Control.Miscellaneous is used for displaying toggling miscellaneous resource buttons.
 */

L.Control.Miscellaneous = L.Control.extend({
  options: {
    position: "topleft"
  },

  onAdd: function(map) {
    this._menuToggle = false;
    this._visible = [];
    this.prof = "misc";
    this.resources = [
      "Misc",
      "Class",
      "Dungeon",
      "Lair",
      "Market",
      "Workshop",
      "Water"
    ];
    var className = "leaflet-control-miscellaneous container-resources";
    var container = (this._container = L.DomUtil.create("div", className));
    container.style.marginTop = "0px";
    L.DomEvent.addListener(container, "dblclick", L.DomEvent.stop);
    L.DomEvent.addListener(container, "click", L.DomEvent.stop);
    L.DomEvent.addListener(container, "mousemove", L.DomEvent.stop);
    var options = this.options;

    this._aButton = L.DomUtil.create("a", "misc-control", container);
    this._aButton.setAttribute("href", "#");
    this._aButton.setAttribute("title", "Divers");
    this._aButton.style.borderTop = "2px solid #212529";
    this._imgButton = L.DomUtil.create("img", "no-class", this._aButton);
    this._imgButton.setAttribute("src", "./data/assets/misc/Hint.png");

    L.DomEvent.addListener(this._aButton, "click", this._click, this);

    map.on("move", this._close, this);
    map.on("click", this._close, this);

    this._magicContainer = L.DomUtil.create(
      "div",
      "container-resources-magic",
      container
    );

    this._buttons = [];
    var resourcesLength = this.resources.length;
    for (var i = 0; i < resourcesLength; i++) {
      var aMagicButton = L.DomUtil.create(
        "a",
        "scale-border-in-out " + this.resources[i],
        this._magicContainer
      );
      aMagicButton.setAttribute("href", "#");
      // aMagicButton.setAttribute('title', i18next.t(this.prof + "." + this.resources[i]));
      var imgMagicButton = L.DomUtil.create("img", "no-class", aMagicButton);
      imgMagicButton.setAttribute(
        "src",
        "./data/assets/misc/" + this.resources[i] + ".png"
      );
      L.DomEvent.addListener(aMagicButton, "click", this._toggle, this);
    }

    for (var j = 0; j < resourcesLength; j++) {
      json[this.resources[j]] = require(`../../data/json/miscellaneous/${
        this.resources[j]
      }.json`);
      hint[this.resources[j]] = L.layerGroup();
      for (const key in json[this.resources[j]]) {
        L.marker(
          dofusCoordsToGeoCoords([
            json[this.resources[j]][key].posX,
            json[this.resources[j]][key].posY
          ]),
          {
            icon: L.icon({
              iconUrl: `./data/assets/hint/${
                json[this.resources[j]][key].gfx
              }.png`,
              iconAnchor: [
                sizeOf(
                  `./data/assets/hint/${json[this.resources[j]][key].gfx}.png`
                ).width / 2,
                sizeOf(
                  `./data/assets/hint/${json[this.resources[j]][key].gfx}.png`
                ).height / 2
              ]
            }),
            interactive: false
          }
        ).addTo(hint[this.resources[j]]);
      }
      mcgLayerSupportGroup.checkIn([hint[this.resources[j]]]);
    }

    return container;
  },

  _click: function(evt) {
    if (evt.ctrlKey) {
      for (var i = 0; i < this.resources.length; i++) {
        if (this._visible[i]) {
          continue;
        }
        $(this._magicContainer.children[i])[0].click();
      }
      return;
    }
    if (evt.altKey) {
      for (var j = 0; j < this.resources.length; j++) {
        if (this._visible[j]) {
          $(this._magicContainer.children[j])[0].click();
        } else {
          continue;
        }
      }
      return;
    }
    if (this._menuToggle === false) {
      L.DomUtil.addClass(this._aButton, "container-resources-open");
      L.DomUtil.addClass(this._magicContainer, "in");
      this._menuToggle = true;
    } else {
      this._close();
    }
  },
  _close: function() {
    L.DomUtil.removeClass(this._magicContainer, "in");
    L.DomUtil.removeClass(this._aButton, "container-resources-open");
    this._menuToggle = false;
  },
  _toggle: function(a) {
    for (var i = 0; i < this.resources.length; i++) {
      if (L.DomUtil.hasClass(a.currentTarget, this.resources[i])) {
        if (this._visible[i]) {
          hint[this.resources[i]].removeFrom(map);
          L.DomUtil.removeClass(a.currentTarget, "selected");
          this._visible[i] = false;
        } else {
          hint[this.resources[i]].addTo(map);
          L.DomUtil.addClass(a.currentTarget, "selected");
          this._visible[i] = true;
        }
        break;
      }
    }
    return;
  },

  onRemove: function(map) {
    map.off("move", this._close, this);
    map.off("click", this._close, this);
    //todo remove toggle listeners?
  }
});

//constructor registration
L.control.miscellaneous = function(options) {
  return new L.Control.Miscellaneous(options);
};

//map init hook
L.Map.mergeOptions({
  miscellaneousControl: false
});

L.Map.addInitHook(function() {
  if (this.options.miscellaneousControl) {
    this.miscellaneousControl = new L.Control.Miscellaneous();
    this.addControl(this.miscellaneousControl);
  }
});