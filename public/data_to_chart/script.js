const XLSX = require("xlsx");
const fs = require('fs');
const path = require('path');

class VisualDataChartClass {
  windNotify = document.querySelector("#windNotify");
  notText = document.querySelector("#notText");
  closeNotify = document.querySelector("#closeNotify");

  file = null;
  fileInput = document.querySelector("#file");
  createTableFileBut = document.querySelector("#createTableFile");

  dataField = document.querySelector("#dataField");
  createTableFieldBut = document.querySelector("#createTableField");

  inputCol = document.querySelector("#columns");
  inputRow = document.querySelector("#rows");
  createTableManualBut = document.querySelector("#createTableManual");

  columns = 0;
  rows = 0;

  blockTable = document.querySelector("#blockTable");
  dataTable = document.querySelector("#dataTable");

  blockChart = document.querySelector("#blockChart");
  chartType = document.querySelector("#chartType");
  createChartBut = document.querySelector("#createChart");
  outChart = document.querySelector("#outChart");

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

  createTableFun(data){
    this.blockTable.setAttribute("style", "display: flex;");
    this.blockChart.setAttribute("style", "display: flex;");
    this.dataTable.innerHTML = "";

    this.rows = data.length;
    this.columns = data[0].length;
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    data[0].forEach((val) => {
      let th = document.createElement("th");
      th.innerHTML = val;
      th.setAttribute("class", "styleTD");
      th.contentEditable = true;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    this.dataTable.appendChild(thead);

    data.splice(0, 1);
    let tbody = document.createElement("tbody");
    data.forEach((elem) => {
      let tr = document.createElement("tr");
      elem.forEach((val) => {
        let td = document.createElement("td");
        td.innerHTML = val;
        td.setAttribute("class", "styleTD w-min h-[40px] p-5");
        td.contentEditable = true;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    this.dataTable.appendChild(tbody);
  }

  createTableFileData() {
    if(this.file != null){
      const workbook = XLSX.readFile(this.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  createTableFieldData() {
    if(this.dataField.value != ''){
      let data = this.dataField.value.split("\n").map((elem) => elem.split("\t"))
      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "The field is empty! Insert the data!");
    }
  }

  createTableManual() {
    if(this.inputCol.value != '' && this.inputRow.value != ''){
      this.columns = parseInt(this.inputCol.value) + 1;
      this.rows = parseInt(this.inputRow.value) + 1;

      let data = [];
      for(let i = 0; i < this.rows; i++){
        let tempArr = [];
        for(let j = 0; j < this.columns; j++){
          tempArr.push("");
        }
        data.push(tempArr);
      }

      this.createTableFun(data);
    } else {
      this.alertNotify("bg-red-700", "The fields are empty! Enter the data!");
    }
  }

  createChart() {
    this.outChart.innerHTML = "";

    const data = [];
    const labels = [];
    const colLab = [];
    for (let i = 0; i < this.rows; i++) {
      let row = this.dataTable.rows[i];
      let rowData = [];
      for (let j = 0; j < this.columns; j++) {
        let cell = row.cells[j];
        if (i === 0 && j > 0) {
          colLab.push(cell.innerHTML);
        } else if (i > 0 && j === 0) {
          labels.push(cell.innerHTML);
        } else if (i != 0 && j != 0) {
          rowData.push(cell.innerHTML);
        }
      }
      if (rowData.length > 0) data.push(rowData);
    }

    const ctx = document.createElement("canvas").getContext("2d");
    const myChart = new Chart(ctx, {
      type: this.chartType.value,
      data: {
        labels: colLab,
        datasets: data.map((rowData, index) => ({
          label: `${labels[index]}`,
          data: rowData,
          backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
          // borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
          // borderWidth: 1,
        })),
      }
    });

    this.outChart.appendChild(ctx.canvas);
  }
}

const visualObj = new VisualDataChartClass();

visualObj.fileInput.addEventListener('change', () => {
  visualObj.file = visualObj.fileInput.files[0];
});

visualObj.createTableFileBut.addEventListener('click', () => {
  visualObj.createTableFileData();
});

visualObj.createTableFieldBut.addEventListener('click', () => {
  visualObj.createTableFieldData();
});

visualObj.createTableManualBut.addEventListener('click', () => {
  visualObj.createTableManual();
})

visualObj.createChartBut.addEventListener('click', () => {
  visualObj.createChart();
})

visualObj.closeNotify.addEventListener("click", () => {
  visualObj.windNotify.setAttribute("style", "display: none");
});