const fs = require('fs');
const csv = require('csv-parser');

class CSVtoTableClass{
  windNotify = document.querySelector("#windNotify");
  notText = document.querySelector("#notText");
  closeNotify = document.querySelector("#closeNotify");

  file = null;
  fileInput = document.querySelector("#file");
  createTable = document.querySelector("#createTable");

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

  createTableFun(){
    if(file != null){
      let results = [];
      fs.createReadStream(this.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          this.blockTable.setAttribute("style", "display: flex;");
    
          let table = document.createElement("table");
          
          let tr = document.createElement("tr");
          for(let elem of Object.keys(results[0])) {
            let th = document.createElement("th");
            th.innerHTML = elem;
            th.classList.add("styleTD");
            tr.appendChild(th);
          }
          table.appendChild(tr);
          
          results.splice(0, 1);
          for(let elem of results){
            let tr = document.createElement("tr");
            for(let elem1 of Object.values(elem)){
              let td = document.createElement("td");
              td.innerHTML = elem1;
              td.classList.add("styleTD");
              tr.appendChild(td);
            }
            table.appendChild(tr);
          }
          this.blockTable.appendChild(table);
        });
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }
}

const csvTableObj = new CSVtoTableClass();

csvTableObj.fileInput.addEventListener('change', () => {
  csvTableObj.file = csvTableObj.fileInput.files[0];
});

csvTableObj.createTable.addEventListener('click', () => {
  csvTableObj.createTableFun();
});

csvTableObj.closeNotify.addEventListener("click", () => {
  csvTableObj.windNotify.setAttribute("style", "display: none");
});