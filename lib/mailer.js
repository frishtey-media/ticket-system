import nodemailer from 'nodemailer';

export const sendTicketEmail = async ({ email, name, qrBuffers, event }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const qrImagesHtml = qrBuffers.map((_, index) => `
        <div class="qr-container">
            <img src="cid:qrcode${index}" alt="QR Code ${index + 1}" />
            <p style="text-align:center;">Ticket ${index + 1}</p>
        </div>
    `).join('');

    const mailOptions = {
        from: `"Event Organizer" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your Tickets for ${event.name}`,
        html: `
      <style>
        .qr-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
        }
        .qr-container {
            flex: 1 1 200px;
            max-width: 220px;
            text-align: center;
        }
        @media (max-width: 600px) {
            .qr-wrapper {
                flex-direction: column;
                align-items: center;
            }
            .qr-container {
                width: 100%;
            }
        }
      </style>
      <h2>Hello ${name},</h2>
      <p>Thank you for registering for <strong>${event.name}</strong>.</p>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <p>Please arrive 15-30 minutes early to avoid last-minute queues.</p>
      <p>Scan the QR Code(s) at the entry gate:</p>
      <div class="qr-wrapper">
        ${qrImagesHtml}
      </div>
      <p>See you there!</p>
        `,
        attachments: qrBuffers.map((buffer, index) => ({
            filename: `ticket-${index + 1}.png`,
            content: buffer,
            cid: `qrcode${index}`
        }))
    };

    await transporter.sendMail(mailOptions);
};
