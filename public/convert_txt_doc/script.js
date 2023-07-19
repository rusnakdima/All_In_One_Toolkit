const fs = require("fs");
const path = require("path");
const DOCX = require("docx");

class WriteDataToDOC {
  file = null;
  fileInput = document.querySelector('#file');
  writeDataBut = document.querySelector('#writeData');

  outLog = document.querySelector("#outLog");

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

  writeDataFun(){
    if(this.file){
      let dataFile = fs.readFileSync(this.file.path, 'utf-8');
      let paragraphArray = dataFile.split("\n");
      const doc = new DOCX.Document({
        sections: [
          {
            properties: {},
            children:
              paragraphArray.map((data) => {
                return new DOCX.Paragraph({
                  children: [
                    new DOCX.TextRun(data)
                  ]
                });
              }),
          }
        ]
      });
      DOCX.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(path.parse(this.file.path).dir+'\\'+path.parse(this.file.path).name+".docx", buffer);
      }).catch((err) => {
        console.log(err);
        this.alertNotify("bg-red-700", "Something went wrong!");
      });
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }
}

const writeDataToDOCObj = new WriteDataToDOC();

writeDataToDOCObj.fileInput.addEventListener('change', (e) => {
  writeDataToDOCObj.file = e.target.files[0];
});

writeDataToDOCObj.writeDataBut.addEventListener('click', () => {
  writeDataToDOCObj.writeDataFun();
});