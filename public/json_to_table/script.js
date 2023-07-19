const fs = require('fs');

class JSONtoTableClass{
  windNotify = document.querySelector("#windNotify");
  notText = document.querySelector("#notText");
  closeNotify = document.querySelector("#closeNotify");

  file = null;
  fileInput = document.querySelector("#file");
  dataField = document.querySelector("#dataField");
  createTableFile = document.querySelector("#createTableFile");
  createTableField = document.querySelector("#createTableField");

  blockTable = document.querySelector("#blockTable");

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
  
  createTableFun(data) {
    this.blockTable.setAttribute("style", "display: flex;");
    this.blockTable.innerHTML = "";
    let table = document.createElement("table");

    let tr = document.createElement("tr");
    Object.keys(data[0]).forEach((elem) => {
      let th = document.createElement("th");
      th.innerHTML = elem;
      th.classList.add("styleTD");
      tr.appendChild(th);
    });
    table.appendChild(tr);

    data.splice(0, 1);
    data.forEach((elem) => {
      let tr = document.createElement("tr");
      Object.values(elem).forEach((val) => {
        let td = document.createElement("td");
        td.innerHTML = val;
        td.classList.add("styleTD");
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    this.blockTable.appendChild(table);
  }

  parseDataFileFun(){
    if(this.file != null){
      let dataJson = fs.readFileSync(this.file.path, 'utf-8');
      if(dataJson != null && dataJson != ''){
        dataJson = JSON.parse(dataJson);
        this.createTableFun(dataJson);
      }
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  parseDataFieldFun(){
    if(this.dataField.value != ''){
      let dataJson = JSON.parse(this.dataField.value);
      this.createTableFun(dataJson);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }
}

const jsonTableObj = new JSONtoTableClass();

jsonTableObj.fileInput.addEventListener('change', () => {
  jsonTableObj.file = jsonTableObj.fileInput.files[0];
});

jsonTableObj.createTableFile.addEventListener('click', () => {
  jsonTableObj.parseDataFileFun();
});

jsonTableObj.createTableField.addEventListener('click', () => {
  jsonTableObj.parseDataFieldFun();
});

jsonTableObj.closeNotify.addEventListener("click", () => {
  jsonTableObj.windNotify.setAttribute("style", "display: none");
});