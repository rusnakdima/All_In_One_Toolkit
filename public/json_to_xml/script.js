const fs = require('fs');
const path = require('path');

class JSONtoXML {
  windNotify = document.querySelector("#windNotify");
  notText = document.querySelector("#notText");
  closeNotify = document.querySelector("#closeNotify");

  dataXml = '';
  filePath = '';
  file = null;

  fileInput = document.querySelector("#file");
  dataField = document.querySelector("#dataField");
  folderInput = document.querySelector("#folderInput");

  convertDataFile = document.querySelector("#convertDataFile");
  convertDataField = document.querySelector("#convertDataField");
  saveDataFile = document.querySelector("#saveDataFile");

  alertNotify(color, title) {
    this.windNotify.setAttribute("style", "display: flex");
    this.windNotify.classList.add(color);
    this.notText.innerHTML = title;
    
    var timeNotify = document.querySelector("#timeNotify");
    if (timeNotify != null) {
      if(timeNotify.style.width != '') if(+timeNotify.style.width.split('').slice(0, -1).join('') > 0) return;
      var width = 100;
      timeNotify.style.width = `${width}%`;
  
      const interval = setInterval(() => {
        width -= 0.3;
        if (width < 0) {
          width = 0;
          clearInterval(interval);
          this.windNotify.setAttribute("style", "display: none");
        }
        if (timeNotify != null) timeNotify.style.width = `${width}%`;
      }, 10);
    }
  }

  generateName(){
    var alphabetic = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var name = '';
    for(var i = 0; i < 20; i++){
      var digit = Math.floor(Math.random() * alphabetic.length);
      name += alphabetic[digit];
    }
    return name;
  }

  parseData(object, stroke = ''){
    var tempElement = '';
    Object.entries(object).forEach(([key, value]) => {
      if(Array.isArray(value)) {
        tempElement += `${this.parseData(value, key)}`;
      } else if(typeof value != 'string'){
        key = (isNaN(+key)) ? key : stroke;
        key = key.replace(" ", "");
        tempElement += `<${key}>${this.parseData(value, key)}</${key}>`;
      } else {
        key = key.replace(" ", "");
        tempElement += `<${key}>${value}</${key}>`;
      }
    });
    return tempElement;
  }

  convertDataFun(dataJSON){
    this.dataXml = `${this.parseData(dataJSON)}`;

    if(this.filePath == '') {
      this.folderInput.click();
    }
    if (this.dataXml != '' && this.filePath != '') {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  convertDataFileFun(){
    if(this.file != null){
      var dataJson = fs.readFileSync(this.file.path, 'utf8');
      if(dataJson != null && dataJson != ''){
        dataJson = JSON.parse(dataJson);
        this.convertDataFun(dataJson);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  convertDataFieldFun(){
    if(this.dataField.value != ''){
      var dataJson = JSON.parse(this.dataField.value);
      this.convertDataFun(dataJson);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  saveDataFileFun(){
    if(this.filePath == ''){
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (this.dataXml == ''){
      this.alertNotify("bg-red-700", "No data was received from the file!");
    } else if(this.filePath != '' && this.dataXml != ''){
      fs.writeFile(this.filePath, this.dataXml, (err) => {
        if (err) {
          this.alertNotify("bg-red-700", `The data was not saved to a file!`);
          throw err;
        }
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file along the path ${this.filePath}!`);
      });
    }
  }
}

const jsonToXmlObj = new JSONtoXML();

jsonToXmlObj.fileInput.addEventListener('change', () => {
  jsonToXmlObj.file = jsonToXmlObj.fileInput.files[0];
  var parsePath = path.parse(jsonToXmlObj.file.path);
  jsonToXmlObj.filePath = parsePath.dir+'\\'+parsePath.name+'.xml';
});

jsonToXmlObj.folderInput.addEventListener("change", () => {
  var nameFile = jsonToXmlObj.generateName();
  jsonToXmlObj.filePath = path.parse(jsonToXmlObj.folderInput.files[0].path).dir+'\\'+nameFile+'.xml';
});

jsonToXmlObj.convertDataFile.addEventListener("click", () => {
  jsonToXmlObj.convertDataFileFun();
});

jsonToXmlObj.convertDataField.addEventListener("click", () => {
  jsonToXmlObj.convertDataFieldFun();
});

jsonToXmlObj.saveDataFile.addEventListener("click", () => {
  jsonToXmlObj.saveDataFileFun();
});

jsonToXmlObj.closeNotify.addEventListener("click", () => {
  jsonToXmlObj.windNotify.setAttribute("style", "display: none");
});