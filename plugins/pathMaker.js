const moveSet = require("./modules/moveSet");
const getScale = require("./modules/scale");

const icon = {
  move: ["up", "down", "left", "right"],
  type: ["move", "gather", "fight", "bank", "phoenix"],
  size: {
    path: {
      up: { width: 17.22, height: 25, marginLeft: 17.22 / 2, topMargin: 25 },
      down: { width: 17.22, height: 25, marginLeft: 17.22 / 2, topMargin: 0 },
      left: {
        width: 32.04,
        height: 17.22,
        marginLeft: 34.75,
        topMargin: 17.22 / 2
      },
      right: {
        width: 32.04,
        height: 17.22,
        marginLeft: 32.04 - 34.75,
        topMargin: 17.22 / 2
      },
      zindex: 9999
    },
    bank: {
      up: { width: 17.22, height: 25, marginLeft: -2.5, topMargin: 25 },
      down: { width: 17.22, height: 25, marginLeft: -2.5, topMargin: 0 },
      left: { width: 32.04, height: 17.22, marginLeft: 34.75, topMargin: -2.5 },
      right: {
        width: 32.04,
        height: 17.22,
        marginLeft: 32.04 - 34.75,
        topMargin: -2.5
      },
      zindex: 9998
    },
    phoenix: {
      up: { width: 17.22, height: 25, marginLeft: 20, topMargin: 25 },
      down: { width: 17.22, height: 25, marginLeft: 20, topMargin: 0 },
      left: { width: 32.04, height: 17.22, marginLeft: 34.75, topMargin: 20 },
      right: {
        width: 32.04,
        height: 17.22,
        marginLeft: 32.04 - 34.75,
        topMargin: 20
      },
      zindex: 9997
    }
  }
};

for (const name of icon.move) {
  icon[name] = {};
  for (const type of icon.type) {
    icon[name][type] = new moveSet(`./data/assets/path/${type}/${name}.svg`);
  }
}

const movementType = {
  path: [],
  bank: [],
  phoenix: []
};

checkIfMapAlreadyExist = (coord, array) => {
  for (const map of Object.values(array)) {
    if (map.coord[0] === coord[0] && map.coord[1] === coord[1]) {
      return map;
    }
  }
  return null;
};

resizeMarker = () => {
  for (const dataType of Object.keys(movementType)) {
    for (const object of Object.values(movementType[dataType])) {
      for (const name of icon.move) {
        if (!object.marker.hasOwnProperty(name)) continue;
        let zoom = new getScale(icon.size[dataType][name], map.getZoom());
        object.marker[name].setIcon(
          L.icon({
            iconUrl: object.marker[name]._icon.src,
            iconSize: [zoom.width, zoom.height],
            iconAnchor: [zoom.marginLeft, zoom.topMargin],
            className: name
          })
        );
      }
    }
  }
};

deleteAction = (dataType, index, name) => {
  if (!index.marker.hasOwnProperty(name)) return;
  index.marker[name].remove();
  delete index.data[name];
  delete index.marker[name];
  if ($.isEmptyObject(index.data)) dataType.splice(dataType.indexOf(index), 1);
};

onMapClick = coord => {
  console.log(coord);
  for (const name of icon.move) {
    // loop through list of possible mouvement : ['up', 'down', 'left', 'right'],
    if ($(`label.btn-dark:has(i.fa-arrow-${name})`).children()[0].checked) {
      let dataType = $("#type option:selected").data("array-type"),
        scale = new getScale(icon.size[dataType][name], map.getZoom()),
        type = $("#type option:selected").data("type"),
        index = checkIfMapAlreadyExist(coord, movementType[dataType]),
        arrowMarker = L.marker(dofusCoordsToGeoCoords([coord[0], coord[1]]), {
          icon: L.icon({
            iconUrl: icon[name][type].iconUrl,
            iconSize: [scale.width, scale.height],
            iconAnchor: [scale.marginLeft, scale.topMargin],
            className: name
          }),
          zIndexOffset: icon.size[dataType].zindex,
          interactive: false
        });
      if (index !== null) {
        if (index.data[name]) {
          deleteAction(movementType[dataType], index, name);
        } else {
          index.data[name] = {
            [type]: true
          };
          index.marker[name] = arrowMarker.addTo(map);
        }
      } else {
        movementType[dataType].push({
          coord: [coord[0], coord[1]],
          data: {
            [name]: {
              [type]: true
            }
          },
          marker: {
            [name]: arrowMarker.addTo(map)
          }
        });
      }
    } else if ($(`label.btn-dark:has(i.fa-eraser)`).children()[0].checked) {
      let index;
      for (const dataType of Object.values(movementType)) {
        index = checkIfMapAlreadyExist(coord, dataType);
        if (index !== null) deleteAction(dataType, index, name);
      }
    }
  }
  console.log(movementType);
};

$(`label.btn-dark:has(i.fa-eraser)`)[0].children[0].onchange = () => {
  if ($(`label.btn-dark:has(i.fa-eraser)`).children()[0].checked) {
    for (const name of icon.move) {
      $(`label.btn-dark:has(i.fa-arrow-${name})`).removeClass("active");
      $(`label.btn-dark:has(i.fa-arrow-${name})`).children()[0].checked = false;
      $(`label.btn-dark:has(i.fa-arrow-${name})`).parent()[0].disabled = true;
    }
  } else {
    for (const name of icon.move) {
      $(`label.btn-dark:has(i.fa-arrow-${name})`).parent()[0].disabled = false;
    }
  }
};
