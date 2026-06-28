/**
 * Google Apps Script — receives RSVP form posts and appends them to the Sheet.
 *
 * SETUP (one time, ~3 minutes):
 * 1. Create a new Google Sheet (e.g. "Wedding RSVP").
 * 2. In that Sheet: Extensions → Apps Script.
 * 3. Delete the sample code, paste THIS whole file, and Save.
 * 4. Click Deploy → New deployment → type: "Web app".
 *      - Description: RSVP
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Click Deploy, authorize when asked.
 * 5. Copy the "Web app URL" (ends with /exec).
 * 6. Put that URL in Cloudflare as the env variable  RSVP_URL.
 *
 * The Sheet auto-creates a header row on the first submission.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Add a header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Attending', 'Guests', 'Suggestions', 'Notes']);
    }

    var d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }

    sheet.appendRow([
      new Date(),
      d.name || '',
      d.phone || '',
      d.attending || '',
      d.guests || '',
      d.suggestion || '',
      d.notes || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput('RSVP endpoint is live.');
}
