import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVICE_USER,
    pass: process.env.EMAIL_SERVICE_PASSWORD,
  },
});

/**
 * Send email to client
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
export const sendEmail = async ({ to, customerName, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `CareSync <${process.env.EMAIL_SERVICE_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    console.log(info);
  } catch (err) {
    console.error("Failed to send email:", err);
    throw new Error(err?.message || "Failed to send email");
  }
};

/**
 * Send contact form email to admin
 * @param {Object} contactData
 * @param {string} contactData.firstName
 * @param {string} contactData.lastName
 * @param {string} contactData.email
 * @param {string} contactData.phoneNumber
 * @param {string} contactData.organisation
 * @param {string} contactData.position
 * @param {string} contactData.serviceType
 * @param {string} contactData.interestedIn
 * @param {string} contactData.message
 */
export const sendContactFormEmail = async (contactData) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    organisation,
    position,
    serviceType,
    interestedIn,
    message,
    tenderId,
  } = contactData;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Enquiry</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                background-color: #f5f5f5;
                padding: 40px 20px;
            }
            .email-wrapper {
                max-width: 680px;
                margin: 0 auto;
                background: #ffffff;
                box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            }
            .header {
                background: linear-gradient(135deg, #16a085 0%, #1abc9c 100%);
                padding: 48px 40px 40px 40px;
                text-align: left;
            }
            .header h1 {
                color: #ffffff;
                font-size: 28px;
                font-weight: 600;
                letter-spacing: -0.5px;
                margin-bottom: 8px;
            }
            .header p {
                color: rgba(255, 255, 255, 0.9);
                font-size: 15px;
                font-weight: 400;
                margin-bottom: 20px;
            }
            .summary-chips {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            .chip {
                display: inline-block;
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(10px);
                color: #ffffff;
                font-size: 12px;
                font-weight: 500;
                padding: 6px 12px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .content {
                padding: 40px;
            }
            .timestamp {
                background: #f8f9fa;
                border-left: 3px solid #16a085;
                padding: 16px 20px;
                margin-bottom: 40px;
                font-size: 13px;
                color: #495057;
            }
            .section {
                margin-bottom: 48px;
            }
            .section-header {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                color: #6c757d;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 1px solid #e9ecef;
            }
            .data-grid {
                display: table;
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
            }
            .data-row {
                display: table-row;
            }
            .data-label {
                display: table-cell;
                padding: 16px 24px 16px 0;
                font-size: 13px;
                font-weight: 500;
                color: #6c757d;
                width: 140px;
                vertical-align: top;
                border-bottom: 1px solid #f1f3f5;
            }
            .data-value {
                display: table-cell;
                padding: 16px 0;
                font-size: 15px;
                color: #212529;
                font-weight: 400;
                border-bottom: 1px solid #f1f3f5;
                vertical-align: top;
            }
            .data-value a {
                color: #16a085;
                text-decoration: none;
                transition: color 0.2s ease;
            }
            .data-value a:hover {
                color: #1abc9c;
            }
            .message-container {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 28px;
                margin-top: 20px;
            }
            .message-content {
                font-size: 15px;
                line-height: 1.8;
                color: #212529;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .priority-notice {
                background: #fff3cd;
                border: 1px solid #ffecb5;
                border-radius: 6px;
                padding: 16px 20px;
                margin-top: 32px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .priority-badge {
                display: inline-block;
                background: #f59e0b;
                color: #ffffff;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .priority-text {
                font-size: 13px;
                color: #856404;
                font-weight: 500;
            }
            .footer {
                background: #f8f9fa;
                padding: 32px 40px;
                border-top: 1px solid #e9ecef;
            }
            .footer-text {
                font-size: 13px;
                color: #6c757d;
                line-height: 1.6;
                margin-bottom: 8px;
            }
            .footer-brand {
                font-weight: 600;
                color: #16a085;
                font-size: 13px;
            }
            .quick-actions {
                text-align: center;
                padding: 20px;
                font-size: 13px;
                color: #6c757d;
            }
            .quick-actions a {
                color: #16a085;
                text-decoration: none;
                font-weight: 500;
                margin: 0 8px;
            }
            .quick-actions a:hover {
                color: #1abc9c;
            }
            @media only screen and (max-width: 600px) {
                body {
                    padding: 0;
                }
                .header {
                    padding: 32px 24px 28px 24px;
                }
                .header h1 {
                    font-size: 24px;
                }
                .content {
                    padding: 24px;
                }
                .data-grid {
                    display: block;
                }
                .data-row {
                    display: block;
                    margin-bottom: 20px;
                }
                .data-label {
                    display: block;
                    width: 100%;
                    padding: 0 0 6px 0;
                    border-bottom: none;
                }
                .data-value {
                    display: block;
                    padding: 0 0 20px 0;
                }
                .footer {
                    padding: 24px;
                }
                .priority-notice {
                    flex-direction: column;
                    align-items: flex-start;
                }
            }
        </style>
    </head>
    <body>
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
            New enquiry from ${firstName} ${lastName} at ${organisation}. ${serviceType} - ${interestedIn}.
        </div>

        <div class="email-wrapper">
            <div class="header">
                <h1>New Contact Enquiry</h1>
                <p>A potential client has submitted a contact form</p>
                <div class="summary-chips">
                    <span class="chip">${serviceType}</span>
                    <span class="chip">${interestedIn}</span>
                </div>
            </div>

            <div class="content">
                <div class="timestamp">
                    Received on ${new Date().toLocaleString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                </div>

                <div class="section">
                    <div class="section-header">Contact Details</div>
                    <div class="data-grid">
                        <div class="data-row">
                            <div class="data-label">Name</div>
                            <div class="data-value">${firstName} ${lastName}</div>
                        </div>
                        <div class="data-row">
                            <div class="data-label">Email</div>
                            <div class="data-value"><a href="mailto:${email}">${email}</a></div>
                        </div>
                        <div class="data-row">
                            <div class="data-label">Phone</div>
                            <div class="data-value"><a href="tel:${phoneNumber}">${phoneNumber}</a></div>
                        </div>
                        <div class="data-row">
                            <div class="data-label">Organisation</div>
                            <div class="data-value">${organisation}</div>
                        </div>
                        <div class="data-row">
                            <div class="data-label">Position</div>
                            <div class="data-value">${position}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">Service Requirements</div>
                    <div class="data-grid">
                        <div class="data-row">
                            <div class="data-label">Service Type</div>
                            <div class="data-value">${serviceType}</div>
                        </div>
                        <div class="data-row">
                            <div class="data-label">Interest Area</div>
                            <div class="data-value">${interestedIn}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">Enquiry Message</div>
                    <div class="message-container">
                        <div class="message-content">${message}</div>
                    </div>
                     ${
                       tenderId
                         ? `<a href="https://caresyncexperts.co.uk/tenders/details/?id=${tenderId}">View Tender</a> • `
                         : ""
                     }
                    <div class="priority-notice">
                        <span class="priority-badge">Priority</span>
                        <span class="priority-text">Response expected within 24 hours</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p class="footer-text">
                    Please acknowledge this enquiry as soon as possible. If this enquiry is not intended for you, kindly forward it to the appropriate team member.
                </p>
                <p class="footer-brand">CareSync Experts Contact System</p>
            </div>
        </div>

        <div class="quick-actions">
            Quick Actions: 
           
            <a href="mailto:${email}">Reply by Email</a> • 
            <a href="tel:${phoneNumber}">Call Now</a>
        </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_SERVICE_USER,
      subject: `New Contact Enquiry: ${firstName} ${lastName}`,
      html: htmlTemplate,
    });

    console.log(
      `Contact form email sent successfully for ${firstName} ${lastName}`
    );
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    throw error;
  }
};
