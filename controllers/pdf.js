import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// FIX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const pdfGenebrtor = async (req, res) => {
  try {
    const data = req.body;

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 50
    });

    const fileName = `certificate_${Date.now()}.pdf`;

    // Ensure folder exists
    const dirPath = path.join(__dirname, "pdf");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const filePath = path.join(dirPath, fileName);
    doc.pipe(fs.createWriteStream(filePath));

    const width = doc.page.width;
    const height = doc.page.height;

    // ===== LOAD FONTS =====
    const titleFont = path.join(__dirname, "fonts/Fondamento-Regular.ttf");
    const nameFont = path.join(__dirname, "fonts/Cinzel Bold 700.ttf");
    const bodyFont = path.join(__dirname, "fonts/LibreBaskerville-Regular.ttf");

    // ===== OUTER BORDER =====


    const borderGap = 20; // gap from page edge
    const cornerRadius = 7;

    doc.lineWidth(20)
    .strokeColor("#0d9bd3")
    .roundedRect(
        borderGap,                // x gap
        borderGap,                // y gap
        width - 2 * borderGap,    // width reduced for gap
        height - 2 * borderGap,   // height reduced for gap
        cornerRadius
    )
    .stroke();

    // ===== HEADER LEFT =====
    doc
      .font(bodyFont)
      .fontSize(12)
      .fillColor("black")
      .text(`Register-Id: ${data.registerId}`, 50, 60)
      .text(`E-Mail: ${data.email}`, 50, 80)
      .text(`Phone No.: ${data.phone}`, 50, 100);

    // ===== HEADER RIGHT =====
    doc
      .font(bodyFont)
      .text(data.address, width - 300, 60, {
        width: 250,
        align: "right",
      });

    // ===== LOGO =====
    doc.image(path.join(__dirname, "/logo/logo1.png"), width / 2 - 90, 50, {
        width: 170,
        height: 100,
    });

    // ===== TITLE =====
    doc
      .font(titleFont)
      .fontSize(36)
      .fillColor("#0a7ea4")
      .text("Certificate of Half Marathon", 40, 160, {
        align: "center",
      });

    // ===== SUB TEXT =====
    doc
      .font(titleFont)
      .fontSize(18)
      .fillColor("black")
      .text("This Certificate Presented to", 40, 230, {
        align: "center",
      });

    // ===== NAME =====
    doc
      .font(nameFont)
      .fontSize(20)
      .fillColor("#a9904a")
      .text(data.name, 50, 250, {
        align: "center",
      });

    // ===== DESCRIPTION =====
    doc
      .font(bodyFont)
      .fontSize(12)
      .fillColor("black")
      .text(
        data.description ||
          "The certificate of achievement is awarded to individuals who have demonstrated outstanding performance in their field.",
        100,
        290,
        {
          width: width - 200,
          align: "center",
          lineGap: 3,
        }
      );

    // ===== DETAILS ROW =====
    doc
      .font(bodyFont)
      .fontSize(12)
      .text(`Date of Birth: ${data.dob}`, 80, 360)
      .text(`Gender: ${data.gender}`, width / 2 - 40, 360)
      .text(`Blood Group: ${data.blood}`, width - 200, 360);

    // ===== DATE =====
    doc
      .font(bodyFont)
      .fontSize(12)
      .text(data.dateTime, 80, 450);

    doc.moveTo(230, 480).lineTo(60, 480).lineWidth(0.7).strokeColor("#222323").stroke();
    doc.text("DATE-TIME", 105, 490);

    // ===== SEAL =====
    doc.image(path.join(__dirname, "/logo/logo2.png"), width / 2 - 100, 420, {
        width: 230,
        height: 135,
    });

    // ===== SIGNATURE =====
    doc.moveTo(width - 230, 480).lineTo(width - 80, 480).stroke();
    doc.text("SIGNATURE", width - 200, 490);

    doc.end();

    res.json({
      message: "PDF generated successfully",
      file: fileName,
      path: filePath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating PDF" });
  }
};