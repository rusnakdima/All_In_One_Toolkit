const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

class ExtractDOC {
  file = null;
  fileInput = document.querySelector('#file');
  extractBut = document.querySelector('#extract');
  
  outputRes = document.querySelector('#outputRes');
  
  saveBut = document.querySelector("#saveData");
  
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

  extractMethod() {
    if (this.file) {
      this.outputRes.setAttribute('style', 'display: block;');
      this.saveBut.setAttribute('style', 'display: block;');
      this.outputRes.value = '';
      const zip = new JSZip();

      let tempText = '';

      zip.loadAsync(this.file).then(function (zip) {
        const content = zip.file("word/document.xml").async("string");

        content.then(function (text) {
          const xml = new DOMParser().parseFromString(text, "text/xml");
          const wt = [...xml.getElementsByTagName("w:t")];
          tempText = wt.map(obj => obj.textContent.toString()).join("\n");
        });
      }).catch(function (error) {
        console.log(error);
      });

      setTimeout(() => {
        this.outputRes.value = tempText;
      }, 1000)
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }

  saveFile(){
    if(this.file != null){
      let parsePath = path.parse(this.file.path);
      let pathFile = parsePath.dir + '\\' + parsePath.name + '.txt';
      fs.writeFile(pathFile, this.outputRes.value, (err) => {
        if (err) {
          this.alertNotify("bg-red-700", `The data was not saved to a file!`);
          throw err;
        }
        this.alertNotify("bg-green-700", `The data has been successfully saved to a file along the path ${pathFile}!`);
      });
    } else {
      this.alertNotify("bg-red-700", "You have not selected a file!");
    }
  }
}

const extractdoc = new ExtractDOC();

extractdoc.fileInput.addEventListener('change', () => {
  extractdoc.file = extractdoc.fileInput.files[0];
});

extractdoc.extractBut.addEventListener('click', () => {
  extractdoc.extractMethod();
});

extractdoc.saveBut.addEventListener('click', () => {
  extractdoc.saveFile();
});