const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendMail(toEmail, link) {
    await this.transporter.sendMail({
      from: `"RepairService" <${config.get("smtp_user")}>`,
      to: toEmail,
      subject: "Hisobingizni faollashtiring - RepairService",
      text: "",
      html: `
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hisobni faollashtirish</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 620px; margin: auto; background: #ffffff; padding: 35px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
          <h1 style="color: #2c3e50;">RepairService tizimi</h1>
          <h2 style="color: #16a085;">Hisobingizni faollashtiring</h2>
          <p style="font-size: 16px; color: #555;">Hurmatli foydalanuvchi, biz bilan tizimga muvaffaqiyatli ro‘yxatdan o‘tdingiz. Quyidagi tugma orqali hisobingizni faollashtiring:</p>
          <a href="${link}" style="display: inline-block; margin-top: 25px; background-color: #16a085; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; transition: background-color 0.3s ease;">
            Hisobni faollashtirish
          </a>
          <p style="margin-top: 40px; font-size: 13px; color: #999;">Agar siz bu ro‘yxatdan o‘tishni amalga oshirmagan bo‘lsangiz, bu xabarni e'tiborsiz qoldiring.</p>
          <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #ccc;">© ${new Date().getFullYear()} RepairService. Barcha huquqlar himoyalangan.</p>
        </div>
      </body>
      </html>
      `,
    });
  }
}

let clientMailService = new MailService();
let ownerMailService = new MailService();

module.exports = {
  clientMailService,
  ownerMailService,
};
