const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpLr4Rs15qypAphuca5R7MXeqsKV6wgFssFgza1qXr8IHClVNWqphnVucqEmM_vzsjfA/exec"; // デプロイしたURLに置き換え
let headers = [];

function fetchData() {
  const url = document.getElementById("spreadsheetUrl").value;
  const sheetName = document.getElementById("sheetName").value;
  const spreadsheetId = url.match(/\/d\/(.+?)\//)[1];

  fetch(`${SCRIPT_URL}?spreadsheetId=${spreadsheetId}&sheetName=${sheetName}`)
    .then(response => response.json())
    .then(result => {
      headers = result.headers;
      document.getElementById("headers").innerText = "ヘッダー: " + headers.join(", ");

      // プルダウンメニューの生成
      const select = document.getElementById("keyValue");
      select.innerHTML = "";
      result.bValues.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.text = value;
        select.appendChild(option);
      });

      // 入力欄の生成
      let inputs = "";
      headers.forEach(header => {
        inputs += `<label>${header}: <input type="text" id="input-${header}"></label><br>`;
      });
      document.getElementById("inputFields").innerHTML = inputs;
    })
    .catch(error => console.error("エラー:", error));
}

function submitData() {
  const url = document.getElementById("spreadsheetUrl").value;
  const sheetName = document.getElementById("sheetName").value;
  const spreadsheetId = url.match(/\/d\/(.+?)\//)[1];
  const keyValue = document.getElementById("keyValue").value;

  const data = {};
  headers.forEach(header => {
    const value = document.getElementById(`input-${header}`).value;
    if (value) data[header] = value;
  });

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      spreadsheetId: spreadsheetId,
      sheetName: sheetName,
      key: keyValue,
      data: data
    })
  })
  .then(response => response.text())
  .then(result => alert(result))
  .catch(error => console.error("エラー:", error));
}
