const fs = require('fs');

class CountWordsClass {
  calcBut = document.querySelector('#calc');
  outputRes = document.querySelector("#outputRes");
  fileInput = document.querySelector('#file');
  file = null;
  fieldEl = document.querySelector('#field');

  changeFile(event){
    this.file = event.target.files[0];
    if(this.file) {
      fs.readFile(this.file.path, 'utf8', (err, data) => {
        if(err) console.error(err);
        this.fieldEl.value = data;
      });
    }
  }

  butClick(){
    let text = this.fieldEl.value;
    let result = '';
    let num_chars = text.split('').length;
    let num_words = text.split(' ').length;

    result = `Results:<br>${num_chars} characters, ${num_words} words`;
    this.outputRes.setAttribute("style", "display: block")
    this.outputRes.innerHTML = result;
  }
}

const countObj = new CountWordsClass();

countObj.fileInput.addEventListener('change', (event) => {
  countObj.changeFile(event);
});

countObj.calcBut.addEventListener('click', () => {
  countObj.butClick();
});