# Qur'an Student Recitation Portal with AI Teacher

An interactive web application and Google Apps Script portal for Quran students to record recitations, stream standard reference audio from EveryAyah.com, view Uthmani text, and receive automated Tajweed & Hifz evaluation from Google Gemini AI.

---

## 📁 Included Files

1. **`Code.gs`**
   - Google Apps Script backend file.
   - Implements `doGet()` to serve the web interface.
   - Implements `processFormWithAITeacher()` for client-server `google.script.run` execution.
   - Implements `doPost()` to process standalone HTTP POST requests.
   - Evaluates audio recitations with Gemini Multimodal API (`gemini-1.5-flash`).
   - Automatically sends an **HTML email with the student's `.webm` audio recording attached** to the selected teacher via `MailApp.sendEmail()`.
   - Automatically logs submissions into Google Sheets (including Student ID & Teacher Name columns).

2. **`Index.html`**
   - Main interface served by Google Apps Script web app (`doGet()`).
   - Section 1 includes **Student ID Number** in the top row alongside Full Name, Grade, and Section.
   - Section 1 includes **Assigned Quran Teacher** dropdown (`O. Koulibaly`, `O. Gueye`, `O. Fall`, `O. Mme Ba`).
   - Features dynamic Uthmani Quran script preview for selected Page (1-604) or Ayah range.
   - Audio reciter selector with sequential playlist player (EveryAyah.com).
   - Audio recorder with a **5-Minute (05:00) hard cap**, countdown timer, and visual progress bar.
   - Detailed AI Teacher Report display (Score %, Memorization Status, Tajweed/Makharij analysis, Arabic transcription).

3. **`quran_portal_updated.html`**
   - Standalone HTML application that connects to a deployed Google Apps Script Web App execution URL via `fetch()`.

---

## 📧 Teacher Email Registry Configuration

In [`Code.gs`](file:///C:/Users/DELL\.gemini\antigravity\scratch\quran_recitation_portal\Code.gs), teacher emails are configured in the `TEACHER_EMAILS` object:

```javascript
var TEACHER_EMAILS = {
  "O. Koulibaly": "okoulibaly@iqrabilingual.org",
  "O. Gueye": "ogueye@iqrabilingual.org",
  "O. Fall": "ofall@iqrabilingual.org",
  "O. Mme Ba": "mmeba@iqrabilingual.org"
};
```
*(Update these email addresses to your actual school teacher email addresses).*

---

## 🚀 Deployment Instructions (Google Apps Script)

### Step 1: Create a Google Apps Script Project
1. Go to [script.google.com](https://script.google.com) and click **New Project** (or open a Google Sheet -> **Extensions** -> **Apps Script** to log submissions automatically into Google Sheets).
2. Replace the contents of `Code.gs` with the provided [`Code.gs`](file:///C:/Users/DELL/.gemini/antigravity/scratch/quran_recitation_portal/Code.gs).
3. Click the **+** icon next to Files, select **HTML**, name it `Index`, and paste the contents of [`Index.html`](file:///C:/Users/DELL/.gemini/antigravity/scratch/quran_recitation_portal/Index.html).

### Step 2: Configure Gemini API Key
- Go to **Project Settings** (⚙️ gear icon) -> **Script Properties** -> Add property `GEMINI_API_KEY` with your API key (`AIzaSy...`).

### Step 3: Deploy as Web App
1. Click **Deploy** -> **New Deployment**.
2. Select type: **Web App**.
3. Set **Execute as**: `Me`.
4. Set **Who has access**: `Anyone`.
5. Click **Deploy**, authorize permissions, and copy the **Web App URL**.
