const JSZip = require("jszip");
const fs = require("fs");

class TextSpeechClass {
  text = '';
  file = null;
  fileDOC = document.querySelector('#fileDOC');
  fileTXT = document.querySelector('#fileTXT');
  textField = document.querySelector('#textField');
  speechBut = document.querySelector('#speech');

  synth = window.speechSynthesis;

  getDataDoc(){
    this.file = this.fileDOC.files[0];

    if(this.file){
      this.text = '';
      const zip = new JSZip();

      let tempText = '';

      zip.loadAsync(this.file)
        .then(function (zip) {
          // Получение содержимого документа
          const content = zip.file("word/document.xml").async("string");

          // Отображение содержимого в консоли
          content.then(function (text) {
            const xml = new DOMParser().parseFromString(text, "text/xml");
            const wt = xml.getElementsByTagName("w:t");
            tempText = wt.map(obj => obj.textContent.toString()).join("\n");
          });
        })
        .catch(function (error) {
          console.log(error);
        });

      setTimeout(() => {
        this.text = tempText;
      }, 1000);
    }
  }

  getDataTXT(){
    this.file = this.fileTXT.files[0];

    if(this.file){
      this.text = '';
      fs.readFile(this.file.path, 'utf8', (err, data) => {
        if(err) console.error(err);
        this.text = data;
      });
    }
  }

  speechText(){
    const utterance = new SpeechSynthesisUtterance(this.text);
    this.synth.speak(utterance);
  }
}

const textSpeechObj = new TextSpeechClass();

textSpeechObj.fileDOC.addEventListener('change', () => {
  textSpeechObj.getDataDoc();
});

textSpeechObj.fileTXT.addEventListener('change', () => {
  textSpeechObj.getDataTXT();
});

textSpeechObj.textField.addEventListener('change', () => {
  textSpeechObj.text = textSpeechObj.textField.value;
});

textSpeechObj.speechBut.addEventListener("click", () => {
  textSpeechObj.speechText();
});
