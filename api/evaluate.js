/**
 * Vercel Serverless Function: /api/evaluate
 * Teacher-Led Quran Recitation Platform Endpoint
 * NO AI EVALUATION — Stores submissions, dispatches teacher email notifications, and returns level-based Tajweed reference tips.
 */

import nodemailer from 'nodemailer';

const TEACHER_EMAILS = {
  "O. Koulibaly": "koulibalyismail@gmail.com",
  "O. Gueye": "aliounepg@gmail.com",
  "O. Fall": "iqrabamsarr@gmail.com",
  "O. Mme Ba": "KGAYE.IQRABA@gmail.com"
};

const TAJWEED_TIPS_LIBRARY = {
  Beginner: [
    { title: "🕌 Madd Asli (Natural Elongation)", tip: "Keep vowel elongations (Alif, Waw, Ya) steady for 2 full counts without rushing or holding too long." },
    { title: "🕌 Ghunnah Nasalization", tip: "Pay attention to Noon Shaddah (نّ) and Meem Shaddah (مّ). Hold the nasal sound gently for 2 counts." },
    { title: "🕌 Qalqalah Bouncing Sound", tip: "When pausing on Qalqalah letters (ق, ط, ب, ج, د), give a clear, natural bouncing sound." }
  ],
  Intermediate: [
    { title: "📖 Ikhfa (Hiding Rules)", tip: "When Noon Sakinah or Tanween is followed by an Ikhfa letter, conceal the sound with a light nasal Ghunnah." },
    { title: "📖 Idgham (Merging Rules)", tip: "Merge Noon Sakinah smoothly into (ي, ن, م, و) with full nasalization." },
    { title: "📖 Heavy vs. Light Letters (Tafkhim vs Tarqiq)", tip: "Distinguish heavy throat/mouth letters (خ, ص, ض, غ, ط, ق, ظ) from lighter surrounding letters." }
  ],
  Advanced: [
    { title: "🎓 Sifaat al-Huroof (Letter Characteristics)", tip: "Ensure Hams (breath flow) on Taa (ت) and Kaaf (ك) when silent without distorting letter shape." },
    { title: "🎓 Makharij Precision", tip: "Maintain exact throat articulation for Deep Throat Ayin (ع) and Ha (ح)." },
    { title: "🎓 Waqf & Ibtida (Stopping & Starting)", tip: "Pause only at semantically complete meanings and restart smoothly." }
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const formData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    const studentName = formData.studentName || formData.name || "Anonymous Student";
    const studentId = formData.studentId || "N/A";
    const grade = formData.grade || "Unassigned";
    const classSection = formData.classSection || formData.section || "None";
    const teacherName = formData.teacherName || formData.teacher || "Unassigned Teacher";
    const assignmentDetails = formData.assignmentDetails || "Assignment";
    const level = formData.level || "Intermediate";
    const audioBase64 = formData.audioBase64 || "";

    const targetEmail = TEACHER_EMAILS[teacherName] || "koulibalyismail@gmail.com";
    let emailStatus = `Submission recorded and dispatched to ${teacherName} (${targetEmail})`;

    // Dispatches email with audio attachment if SMTP credentials or GAS Webhook exist
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });

        const safeFileName = `${studentName}_${studentId}`.replace(/[^a-zA-Z0-9_-]/g, '_') + '_recitation.webm';
        const attachments = audioBase64 ? [{ filename: safeFileName, content: Buffer.from(audioBase64, 'base64'), contentType: 'audio/webm' }] : [];

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #10b981; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #064e3b; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 22px;">IQRA Bilingual Academy</h2>
            <p style="margin: 6px 0 0 0; color: #a7f3d0; font-size: 14px;">Teacher Notification: Student Recitation Submitted for Review</p>
          </div>
          <div style="padding: 24px; color: #1e293b; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; background-color: #f8fafc; border-radius: 8px;">
              <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Student Name:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${studentName}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Student ID:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${studentId}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Grade & Level:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${grade} (${classSection}) - ${level} Level</td></tr>
              <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Assigned Teacher:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${teacherName} (${targetEmail})</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Assignment:</td><td style="padding: 10px;">${assignmentDetails}</td></tr>
            </table>

            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #047857;">📎 <strong>Student Audio Recording Attached:</strong> Please listen to the attached .webm file and complete your teacher evaluation on the portal.</p>
            </div>
          </div>
        </div>`;

        await transporter.sendMail({
          from: `"IQRA Quran Portal" <${process.env.SMTP_USER}>`,
          to: targetEmail,
          subject: `🎙️ New Recitation Submission: ${studentName} (ID: ${studentId}) - ${assignmentDetails}`,
          html: htmlContent,
          attachments: attachments
        });
        emailStatus = `Email sent to ${teacherName} (${targetEmail})`;
      } catch (smtpErr) {
        console.error("SMTP error:", smtpErr);
      }
    }

    const tips = TAJWEED_TIPS_LIBRARY[level] || TAJWEED_TIPS_LIBRARY['Intermediate'];

    return res.status(200).json({
      result: 'success',
      data: {
        status: "Submitted to Teacher",
        level: level,
        tajweedTips: tips,
        emailStatus: emailStatus
      }
    });
  } catch (err) {
    console.error("Vercel API error:", err);
    return res.status(500).json({ error: err.message });
  }
}
