class Data_Enc_Dec {
  data = document.querySelector("#data");

  submit_enc = document.querySelector("#submit_enc");
  submit_dec = document.querySelector("#submit_dec");

  result = document.querySelector("#result");

  encode(){
    this.result.setAttribute("style", "display: block;");
    const encodeData = btoa(this.data.value);
    this.result.value = encodeData;
  }

  decode(){
    this.result.setAttribute("style", "display: block;");
    const decodeData = atob(this.data.value);
    this.result.value = decodeData;
  }
}

const data_enc_dec = new Data_Enc_Dec();

data_enc_dec.submit_enc.addEventListener("click", () => {
  data_enc_dec.encode();
});

data_enc_dec.submit_dec.addEventListener("click", () => {
  data_enc_dec.decode();
});