class VirusTotal {
  urlInput = document.querySelector("#url");
  resultDiv = document.querySelector("#result");
  submitButton = document.querySelector("#submit");


  reqMethod() {
    this.resultDiv.setAttribute("style", "display: block");

    const url = btoa(this.urlInput.value).replace(/=/g, "");
    const apiKey = "7a8e8b508ecbba8020e949da7d4edb85d64c55429d04593884c2cececad685d1";
    const apiUrl = `https://www.virustotal.com/api/v3/urls/${encodeURIComponent(url)}`;

    const params = new URLSearchParams();
    params.set('url', url);

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "accept": 'application/json',
        "x-apikey": apiKey
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Ошибка запроса к API VirusTotal");
      })
      .then(json => {
        console.log(json);

        const positives = json.data.attributes.last_analysis_stats.malicious || 0;
        const total = Object.keys(json.data.attributes.last_analysis_results).length;
        const resultDiv = document.querySelector('#result');

        const lastScanDate = new Date(json.data.attributes.last_analysis_date);
        const lastScanDateString = lastScanDate.toLocaleString();
        const lastScanText = `Последняя проверка: ${lastScanDateString}`;

        const enginesDetected = Object.entries(json.data.attributes.last_analysis_results).filter(([, result]) => result.result !== undefined);
        const enginesDetectedCount = enginesDetected.length;
        const enginesDetectedText = `Количество обнаруженных угроз: ${positives} из ${total} (${enginesDetectedCount} антивирусов обнаружили угрозы)`;

        const permalinkText = `Результаты проверки на сайте VirusTotal:`;

        const resultList = document.createElement('ul');
        const lastScanLi = document.createElement('li');
        const enginesDetectedLi = document.createElement('li');
        // const threatsLi = document.createElement('li');
        const permalinkLi = document.createElement('li');

        lastScanLi.textContent = lastScanText;
        enginesDetectedLi.textContent = enginesDetectedText;
        // threatsLi.textContent = threatsText;
        permalinkLi.textContent = permalinkText;

        resultList.appendChild(lastScanLi);
        resultList.appendChild(enginesDetectedLi);
        // resultList.appendChild(threatsLi);
        resultList.appendChild(permalinkLi);

        resultDiv.innerHTML = '';
        resultDiv.appendChild(resultList);

        const resultList1 = document.createElement('div');
        resultList1.classList = "flex flex-row justify-center";

        // Пройдемся по каждому антивирусу и добавим результат в список

        var sites_analysis = Object.keys(json.data.attributes.last_analysis_results).sort();
        console.log(sites_analysis, json.data.attributes.last_analysis_results)
        var sorted_sites_analysis = {};
        sites_analysis.forEach(key => {
          sorted_sites_analysis[key] = json.data.attributes.last_analysis_results[key];
        })
        console.log(sorted_sites_analysis);

        Object.entries(sorted_sites_analysis).forEach(([, analysis]) => {
          const resultItem = document.createElement('div');
          resultItem.classList = "flex flex-row gap-x-3 w-full justify-center styleBorderSolid border";

          // Имя антивируса и его результат
          const engineName = analysis.engine_name;
          const result = analysis.result;

          // Сформируем строку вида "Антивирус: Результат"
          const resultText = `<span class="w-1/2 text-right">${engineName}</span> <span class="w-1/2 text-left">${result}</span>`;

          // Добавим строку в элемент списка
          resultItem.innerHTML = resultText;

          // Добавим элемент списка в список результатов
          resultList.appendChild(resultItem);
        });

        // Добавим список результатов проверки
        resultDiv.appendChild(resultList1);
        // this.resultDiv.textContent = resultText;
      })
      .catch(error => {
        console.error(error);
        this.resultDiv.textContent = `Произошла ошибка: ${error.message}`;
      });

  }
}

const virusObj = new VirusTotal();

virusObj.submitButton.addEventListener("click", () => {
  virusObj.reqMethod();
});