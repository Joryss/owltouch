class getScale {
  constructor(size, zoom) {
    switch (zoom) {
      case 4:
        zoom = 1;
        break;
      case 3:
        zoom = 0.5;
        break;
      case 2:
        zoom = 0.25;
        break;
      case 1:
        zoom = 0.125;
        break;
      case 0:
        zoom = 0.0625;
        break;
      default:
        break;
    }
    this.width = size.width * zoom;
    this.height = size.height * zoom;
    this.marginLeft = size.marginLeft * zoom;
    this.topMargin = size.topMargin * zoom;
  }
}

module.exports = getScale;
