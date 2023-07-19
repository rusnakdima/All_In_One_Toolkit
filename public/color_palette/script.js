class ColorPaletteClass {
  typeCol = '';
  dataCol = '';

  fieldInput = document.querySelector("#field");

  colOut = document.querySelector("#colOut");
  resRGB = document.querySelector("#resRGB");
  resHEX = document.querySelector("#resHEX");
  resHSV = document.querySelector("#resHSV");

  hexToRGB(){
    const hex = this.dataCol.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    this.colOut.value = this.dataCol;
    this.resHEX.innerHTML = this.dataCol;
    this.resRGB.innerHTML = `rgb(${r}, ${g}, ${b})`;
    this.hexToHSV(this.dataCol);
  }

  rgbToHEX(){
    let [, r, g, b] = this.dataCol.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    const hexValue = `#${hexR}${hexG}${hexB}`;
    this.colOut.value = hexValue;
    this.resHEX.innerHTML = hexValue;
    this.resRGB.innerHTML = this.dataCol;
    this.hexToHSV(hexValue);
  }

  hexToHSV(data){
    const hex = data.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;
    const delta = max - min;
    if (max !== 0) {
      s = delta / max;
    } else {
      s = 0;
      h = -1;
      this.resHSV.innerHTML = `hsv(${h}°, ${s}%, ${v}%)`;
      return;
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h *= 60;
    if (h < 0) h += 360;
    h = Math.floor(h);
    s *= 100;
    v *= 100;
    s = Math.floor(s);
    v = Math.floor(v);
    this.resHSV.innerHTML = `hsv(${h}°, ${s}%, ${v}%)`;
    return;
  }

  changeColor() {
    if (this.typeCol != '') {
      if (this.typeCol == 'rgb') {
        this.rgbToHEX();
      } else if (this.typeCol == 'hex') {
        this.hexToRGB();
      } /* else if (this.typeCol == 'hsv') {
        
      } */ else {
        alert("Invalid data");
        return;
      }

    }
  }

  changeColorOut(data){
    this.dataCol = data;
    this.hexToRGB();
  }

}

const colPalObj = new ColorPaletteClass();

document.querySelectorAll('[name=typecol]').forEach(item => {
  item.addEventListener('change', (event) => {
    colPalObj.typeCol = event.target.id;
  });
});

colPalObj.fieldInput.addEventListener('change', (event) => {
  colPalObj.dataCol = event.target.value;
  colPalObj.changeColor();
});

colPalObj.colOut.addEventListener('change', (event) => {
  colPalObj.changeColorOut(event.target.value);
});