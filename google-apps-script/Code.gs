const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAME = "Leads";
const EXPECTED_HEADERS = ["Timestamp", "Name", "Email"];

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "Invalid request" });
    }

    const data = JSON.parse(e.postData.contents);
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length > 100 || !email || email.length > 254 || !emailPattern.test(email)) {
      return jsonResponse({ success: false, error: "Invalid submission" });
    }

    if (!SPREADSHEET_ID || SPREADSHEET_ID === "YOUR_SPREADSHEET_ID") {
      throw new Error("Spreadsheet ID is not configured");
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Leads sheet was not found");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(EXPECTED_HEADERS);
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([new Date(), name, email]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Contact submission failed", error && error.message ? error.message : "Unknown error");
    return jsonResponse({ success: false, error: "Unable to process submission" });
  }
}

