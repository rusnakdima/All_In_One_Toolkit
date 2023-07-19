const fs = require('fs');
const https = require('https');
const path = require('path');

class FileDownloaderClass {
  links = [];
  folderName = '';
  linksField = document.querySelector("#links");
  pathInput = document.querySelector("#path");
  downloadBut = document.querySelector("#downloadBut");
  outLog = document.querySelector("#outLog");

  linksChange() {
    this.links = this.linksField.value.split('\n');
  }

  downloadFiles() {
    for (const url of this.links) {
      let tempName = path.basename(url);
      const filePath = path.join(this.folderName, tempName);
      const file = fs.createWriteStream(filePath);
      https.get(url, (res) => {
        res.pipe(file);

        file.on('finish', () => {
          file.close();
          this.outLog.innerHTML += `<span class="text-green-500">The file on the "${url}" link was successfully downloaded</span>`;
        });
      }).on('error', (err) => {
        fs.unlink(filePath, () => { });
        console.error(`Error: ${err.message}`);
        this.outLog.innerHTML += `<span class="text-red-500">The file on the "${url}" link was not downloaded successfully</span>`;
      });
    }
  }
}

const fileDownObj = new FileDownloaderClass();

fileDownObj.linksField.addEventListener('change', () => {
  fileDownObj.linksChange();
});

fileDownObj.pathInput.addEventListener("change", () => {
  fileDownObj.folderName = path.parse(fileDownObj.pathInput.files[0].path).dir;
});

fileDownObj.downloadBut.addEventListener('click', () => {
  fileDownObj.downloadFiles();
});