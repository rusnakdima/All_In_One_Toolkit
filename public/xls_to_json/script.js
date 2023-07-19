const XLSX = require("xlsx");
const fs = require('fs');
const path = require('path');

class XLStoJSONClass {
  windNotify = document.querySelector("#windNotify");
  notText = document.querySelector("#notText");
  closeNotify = document.querySelector("#closeNotify");
  
  data = [];

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

  convertDataFun(data){
    this.data = [];
    let strokeF = data[0];
    data.splice(0, 1);
    data.forEach((element) => {
      let tempObj = {};
      element.forEach((elem, index) => tempObj[strokeF[index]] = elem);
      this.data.push(tempObj);
    });

    if(this.filePath == '') {
      this.folderInput.click();
    }
    if (this.data.length > 0 && this.filePath != '') {
      this.alertNotify("bg-green-700", "The data has been successfully converted!");
    } else {
      this.alertNotify("bg-red-700", "No data was received from the file!");
    }
  }

  convertDataFileFun(){
    if(this.file != null){
      const workbook = XLSX.readFile(this.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const dataXLSX = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      this.convertDataFun(dataXLSX);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  convertDataFieldFun(){
    if(this.dataField != ''){
      let data = this.dataField.value.split("\n").map((elem) => elem.split("\t"));
      this.convertDataFun(data);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  saveDataFileFun(){
    if(this.filePath == ''){
      this.alertNotify("bg-red-700", "You have not selected a file!");
    } else if (this.data.length == 0){
      this.alertNotify("bg-red-700", "No data was received from the file!");
    } else if(this.filePath != '' && this.data.length != 0){
      fs.writeFile(this.filePath, JSON.stringify(this.data), (err) => {
        if (err) {
          this.alertNotify("bg-red-700", `The data was not saved to a file!`);
          throw err;
        }
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file along the path ${this.filePath}!`);
        this.filePath = '';
      });
    }
  }
}

const xlsToJsonObj = new XLStoJSONClass();

xlsToJsonObj.fileInput.addEventListener('change', () => {
  xlsToJsonObj.file = xlsToJsonObj.fileInput.files[0];
  let parsePath = path.parse(xlsToJsonObj.file.path);
  xlsToJsonObj.filePath = parsePath.dir+'\\'+parsePath.name+'.json';
});

xlsToJsonObj.folderInput.addEventListener("change", () => {
  let nameFile = xlsToJsonObj.generateName();
  xlsToJsonObj.filePath = path.parse(xlsToJsonObj.folderInput.files[0].path).dir+'\\'+nameFile+'.json';
});

xlsToJsonObj.convertDataFile.addEventListener('click', () => {
  xlsToJsonObj.convertDataFileFun();
});

xlsToJsonObj.convertDataField.addEventListener('click', () => {
  xlsToJsonObj.convertDataFieldFun();
});

xlsToJsonObj.saveDataFile.addEventListener('click', () => {
  xlsToJsonObj.saveDataFileFun();
});

xlsToJsonObj.closeNotify.addEventListener("click", () => {
  xlsToJsonObj.windNotify.setAttribute("style", "display: none");
});