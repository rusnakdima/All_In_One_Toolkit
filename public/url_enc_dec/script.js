class URL_Enc_Dec {
  url = document.querySelector("#url");

  submit_enc = document.querySelector("#submit_enc");
  submit_dec = document.querySelector("#submit_dec");

  result = document.querySelector("#result");

  encode(){
    this.result.setAttribute("style", "display: block;");
    const encodeUrl = encodeURIComponent(this.url.value);
    this.result.value = encodeUrl;
  }

  decode(){
    this.result.setAttribute("style", "display: block;");
    const decodeUrl = decodeURIComponent(this.url.value);
    this.result.value = decodeUrl;
  }
}

const url_enc_dec = new URL_Enc_Dec();

url_enc_dec.submit_enc.addEventListener("click", () => {
  url_enc_dec.encode();
});

url_enc_dec.submit_dec.addEventListener("click", () => {
  url_enc_dec.decode();
});