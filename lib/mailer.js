import nodemailer from 'nodemailer';

export const sendTicketEmail = async ({ email, name, qrImageBuffer, event }) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: `"Event Organizer" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your Ticket for ${event.name}`,
        html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for registering for <strong>${event.name}</strong>.</p>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <p>Please arrive 15-30 minutes early to avoid last-minute queues.</p>
      <p>Scan this QR Code at the entry gate:</p>
      <img src="cid:qrcode" alt="QR Code" />
      <p>See you there!</p>
    `,
        attachments: [
            {
                filename: 'ticket-qrcode.png',
                content: qrImageBuffer,
                cid: 'qrcode' // Match the `cid` used in img src
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};
