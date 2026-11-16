/**
 * Cole este arquivo em Extensões → Apps Script da planilha de leads.
 * Implante como aplicativo da web: executar como você, acesso "Qualquer pessoa".
 * A URL gerada entra na variável LEADS_WEBHOOK_URL da Vercel.
 */
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Enviado em",
      "Nome",
      "E-mail",
      "Telefone",
      "Segmento",
      "Colaboradores",
      "Principal dificuldade",
      "ERP atual"
    ]);
  }

  sheet.appendRow([
    data.sentAt || new Date().toISOString(),
    data.nome || "",
    data.email || "",
    data.telefone || "",
    data.segmento || "",
    data.colaboradores || "",
    data.dificuldade || "",
    data.erpAtual || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
