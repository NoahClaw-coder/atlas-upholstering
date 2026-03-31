import { Resend } from "resend";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({
    maxFileSize: 5 * 1024 * 1024, // 5MB per file
    maxFiles: 3,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Form parse error" });
    }

    try {
      const f = (name) =>
        Array.isArray(fields[name]) ? fields[name][0] : fields[name] || "";

      const body = `
New Quote Request — Atlas Upholstering
=======================================
Name: ${f("first_name")} ${f("last_name")}
Phone: ${f("phone")}
Email: ${f("email")}
Service Type: ${f("service_type")}
Item Description: ${f("item_description")}
Preferred Timeline: ${f("timeline")}
---------------------------------------
Submitted from: atlasupholstering.com
      `.trim();

      const attachments = [];
      const fileList = files.photos
        ? Array.isArray(files.photos)
          ? files.photos
          : [files.photos]
        : [];

      for (const file of fileList) {
        if (file.size > 0) {
          const content = fs.readFileSync(file.filepath);
          attachments.push({
            filename: file.originalFilename || "photo.jpg",
            content: content,
          });
        }
      }

      await resend.emails.send({
        from: "Atlas Upholstering Website <quotes@atlasupholstering.com>",
        to: ["atlasupholstering@outlook.com"],
        replyTo: f("email"),
        subject: `New Quote Request from ${f("first_name")} ${f("last_name")}`,
        text: body,
        attachments: attachments,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Email send error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
  });
}
