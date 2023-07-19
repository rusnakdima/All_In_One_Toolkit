const fs = require('fs');
const path = require('path');

class XMLtoJSON {
  windNotify = document.querySelector("#windNotify");
  notText = document.querySelector("#notText");
  closeNotify = document.querySelector("#closeNotify");

  dataJson = {};
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
    
    let timeNotify = document.querySelector("#timeNotify");
    if (timeNotify != null) {
      if(timeNotify.style.width != '') if(+timeNotify.style.width.split('').slice(0, -1).join('') > 0) return;
      let width = 100;
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
    let alphabetic = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let name = '';
    for(let i = 0; i < 20; i++){
      let digit = Math.floor(Math.random() * alphabetic.length);
      name += alphabetic[digit];
    }
    return name;
  }

  parseData(array){
    let tempObj = {};
    array.forEach((elem) => {
      if([...elem.children].length > 0){
        let rez = this.parseData([...elem.children]);
        if(tempObj[elem.nodeName] != undefined) {
          tempObj[elem.nodeName].length == undefined ? tempObj[elem.nodeName] = [tempObj[elem.nodeName], rez] : tempObj[elem.nodeName].push(rez);
        } else tempObj[elem.nodeName] = rez;
      }
      else tempObj[elem.nodeName] = elem.textContent;
    });
    return tempObj;
  }

  convertDataFun(dataXML){
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(dataXML, 'text/xml');
    this.dataJson = this.parseData([...xmlDoc.children]);

    if(this.filePath == '') {
      this.folderInput.click();
    }
    if (Object.keys(this.dataJson).length > 0 && this.filePath != '') {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  convertDataFileFun(){
    if(this.file != null){
      let dataXml = fs.readFileSync(this.file.path, 'utf8');
      if(dataXml != null && dataXml != ''){
        this.convertDataFun(dataXml);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  convertDataFieldFun(){
    if(this.dataField.value != ''){
      let dataXml = this.dataField.value
      this.convertDataFun(dataXml);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  saveDataFileFun(){
    if(this.filePath == ''){
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (Object.keys(this.dataJson).length == 0){
      this.alertNotify("bg-red-700", "No data was received from the file!");
    } else if(this.filePath != '' && Object.keys(this.dataJson).length != 0){
      fs.writeFile(this.filePath, JSON.stringify(this.dataJson), (err) => {
        if (err) {
          this.alertNotify("bg-red-700", `The data was not saved to a file!`);
          throw err;
        }
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file along the path ${this.filePath}!`);
      });
    }
  }
}

const xmlToJsonObj = new XMLtoJSON();

xmlToJsonObj.fileInput.addEventListener('change', () => {
  xmlToJsonObj.file = xmlToJsonObj.fileInput.files[0];
  let parsePath = path.parse(xmlToJsonObj.file.path);
  xmlToJsonObj.filePath = parsePath.dir+'\\'+parsePath.name+'.json';
});

xmlToJsonObj.folderInput.addEventListener("change", () => {
  let nameFile = xmlToJsonObj.generateName();
  xmlToJsonObj.filePath = path.parse(xmlToJsonObj.folderInput.files[0].path).dir+'\\'+nameFile+'.json';
});

xmlToJsonObj.convertDataFile.addEventListener("click", () => {
  xmlToJsonObj.convertDataFileFun();
});

xmlToJsonObj.convertDataField.addEventListener("click", () => {
  xmlToJsonObj.convertDataFieldFun();
});

xmlToJsonObj.saveDataFile.addEventListener("click", () => {
  xmlToJsonObj.saveDataFileFun();
});

xmlToJsonObj.closeNotify.addEventListener("click", () => {
  xmlToJsonObj.windNotify.setAttribute("style", "display: none");
});