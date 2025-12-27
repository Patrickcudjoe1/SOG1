import sgMail from '@sendgrid/mail'
import { Order, Address } from '../firebase/admin-db'

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'hangouthacks@gmail.com'
const ADMIN_EMAIL = process.env.ADMIN_ORDER_EMAIL || 'hangouthacks@gmail.com'
const BRAND_NAME = 'Son of God'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return `GH₵${amount.toFixed(2)}`
}

/**
 * Format date for display
 */
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Generate customer email HTML
 */
function generateCustomerEmailHTML(order: Order, shippingAddress?: Address): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 3px;">
                    ${BRAND_NAME}
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 400;">
                    Thank You for Your Order! 🙏
                  </h2>
                  
                  <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                    Dear ${shippingAddress?.fullName || 'Valued Customer'},
                  </p>
                  
                  <p style="margin: 0 0 30px; color: #666666; font-size: 14px; line-height: 1.6;">
                    Your order has been confirmed and is now being prepared for delivery. We appreciate your trust in ${BRAND_NAME} and are honored to be part of your faith journey.
                  </p>

                  <!-- Track Order Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center" style="padding: 0;">
                        <a href="${BASE_URL}/orders/${order.id}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;">
                          Track Your Order
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Details Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; overflow: hidden; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Order Number:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #666666; font-size: 14px;">${order.orderNumber}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Order Date:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #666666; font-size: 14px;">${formatDate(order.createdAt)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Payment Method:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #666666; font-size: 14px;">${order.paymentMethod === 'paystack' ? 'Paystack' : order.paymentMethod === 'stripe' ? 'Stripe' : 'Mobile Money'}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Payment Status:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #10b981; font-size: 14px; font-weight: bold;">✓ COMPLETED</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Items -->
                  <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 400;">
                    Order Items
                  </h3>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #000000;">
                        <th align="left" style="padding: 12px 0; color: #000000; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          Item
                        </th>
                        <th align="center" style="padding: 12px 0; color: #000000; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          Qty
                        </th>
                        <th align="right" style="padding: 12px 0; color: #000000; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.items?.map(item => `
                        <tr style="border-bottom: 1px solid #e5e5e5;">
                          <td style="padding: 15px 0; color: #333333; font-size: 14px;">
                            ${item.productName}
                            ${item.size ? `<br><span style="color: #999999; font-size: 12px;">Size: ${item.size}</span>` : ''}
                            ${item.color ? `<br><span style="color: #999999; font-size: 12px;">Color: ${item.color}</span>` : ''}
                          </td>
                          <td align="center" style="padding: 15px 0; color: #666666; font-size: 14px;">
                            ${item.quantity}
                          </td>
                          <td align="right" style="padding: 15px 0; color: #000000; font-size: 14px;">
                            ${formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>

                  <!-- Order Summary -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                    <tr>
                      <td align="right" style="padding: 8px 0;">
                        <span style="color: #666666; font-size: 14px;">Subtotal:</span>
                      </td>
                      <td align="right" style="padding: 8px 0; padding-left: 20px; width: 120px;">
                        <span style="color: #000000; font-size: 14px;">${formatCurrency(order.subtotal)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td align="right" style="padding: 8px 0;">
                        <span style="color: #666666; font-size: 14px;">Shipping:</span>
                      </td>
                      <td align="right" style="padding: 8px 0; padding-left: 20px;">
                        <span style="color: #000000; font-size: 14px;">${formatCurrency(order.shippingCost)}</span>
                      </td>
                    </tr>
                    ${order.discountAmount > 0 ? `
                      <tr>
                        <td align="right" style="padding: 8px 0;">
                          <span style="color: #10b981; font-size: 14px;">Discount${order.promoCode ? ` (${order.promoCode})` : ''}:</span>
                        </td>
                        <td align="right" style="padding: 8px 0; padding-left: 20px;">
                          <span style="color: #10b981; font-size: 14px;">-${formatCurrency(order.discountAmount)}</span>
                        </td>
                      </tr>
                    ` : ''}
                    <tr style="border-top: 2px solid #000000;">
                      <td align="right" style="padding: 15px 0;">
                        <strong style="color: #000000; font-size: 16px;">Total Paid:</strong>
                      </td>
                      <td align="right" style="padding: 15px 0; padding-left: 20px;">
                        <strong style="color: #000000; font-size: 18px;">${formatCurrency(order.totalAmount)}</strong>
                      </td>
                    </tr>
                  </table>

                  ${shippingAddress ? `
                    <!-- Delivery Address -->
                    <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 400;">
                      Delivery Address
                    </h3>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                      <p style="margin: 0 0 5px; color: #000000; font-size: 14px; font-weight: 600;">
                        ${shippingAddress.fullName}
                      </p>
                      <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                        ${shippingAddress.addressLine1}
                      </p>
                      ${shippingAddress.addressLine2 ? `
                        <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                          ${shippingAddress.addressLine2}
                        </p>
                      ` : ''}
                      <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                        ${shippingAddress.city}${shippingAddress.region ? `, ${shippingAddress.region}` : ''} ${shippingAddress.postalCode}
                      </p>
                      <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                        ${shippingAddress.country}
                      </p>
                      ${shippingAddress.phone ? `
                        <p style="margin: 8px 0 0; color: #666666; font-size: 14px;">
                          Phone: ${shippingAddress.phone}
                        </p>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- Closing Message -->
                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
                    <p style="margin: 0 0 10px; color: #000000; font-size: 14px; font-weight: 600;">
                      What's Next?
                    </p>
                    <p style="margin: 0 0 8px; color: #666666; font-size: 14px; line-height: 1.6;">
                      ✓ Your order is being prepared
                    </p>
                    <p style="margin: 0 0 8px; color: #666666; font-size: 14px; line-height: 1.6;">
                      📦 You'll receive shipping confirmation soon
                    </p>
                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      📧 Track your order anytime from your account
                    </p>
                  </div>
                  
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6; text-align: center; font-style: italic;">
                    Walk in faith. Wear your purpose. 🙏
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0 0 15px; color: #666666; font-size: 13px; font-weight: 600;">
                    Need Help?
                  </p>
                  <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                    Contact our support team at <a href="mailto:${FROM_EMAIL}" style="color: #000000; text-decoration: underline;">${FROM_EMAIL}</a>
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Generate admin notification email HTML
 */
function generateAdminEmailHTML(order: Order, shippingAddress?: Address): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #dc2626; padding: 30px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                    🚨 NEW ORDER PLACED
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px; color: #000000; font-size: 16px; font-weight: 600;">
                    A new order needs your attention!
                  </p>

                  <!-- Order Details Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-left: 4px solid #dc2626; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Order Number:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #dc2626; font-size: 16px; font-weight: 600;">${order.orderNumber}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Customer:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #666666; font-size: 14px;">${shippingAddress?.fullName || 'N/A'}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Email:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #666666; font-size: 14px;">${order.email}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Total Amount:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #000000; font-size: 16px; font-weight: 600;">${formatCurrency(order.totalAmount)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #000000; font-size: 14px;">Payment Method:</strong>
                            </td>
                            <td align="right" style="padding: 8px 0;">
                              <span style="color: #666666; font-size: 14px;">${order.paymentMethod === 'paystack' ? 'Paystack' : order.paymentMethod === 'stripe' ? 'Stripe' : 'Mobile Money'}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Items -->
                  <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 600;">
                    Items to Prepare
                  </h3>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #000000; background-color: #f9f9f9;">
                        <th align="left" style="padding: 12px 10px; color: #000000; font-size: 13px; font-weight: 600;">
                          Product
                        </th>
                        <th align="center" style="padding: 12px 10px; color: #000000; font-size: 13px; font-weight: 600;">
                          Qty
                        </th>
                        <th align="right" style="padding: 12px 10px; color: #000000; font-size: 13px; font-weight: 600;">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.items?.map(item => `
                        <tr style="border-bottom: 1px solid #e5e5e5;">
                          <td style="padding: 12px 10px; color: #333333; font-size: 14px;">
                            ${item.productName}
                            ${item.size ? `<br><span style="color: #999999; font-size: 12px;">Size: ${item.size}</span>` : ''}
                            ${item.color ? `<br><span style="color: #999999; font-size: 12px;">Color: ${item.color}</span>` : ''}
                          </td>
                          <td align="center" style="padding: 12px 10px; color: #000000; font-size: 16px; font-weight: 600;">
                            ${item.quantity}
                          </td>
                          <td align="right" style="padding: 12px 10px; color: #000000; font-size: 14px;">
                            ${formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>

                  ${shippingAddress ? `
                    <!-- Delivery Address -->
                    <h3 style="margin: 20px 0 15px; color: #000000; font-size: 18px; font-weight: 600;">
                      Delivery Address
                    </h3>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #000000; margin-bottom: 30px;">
                      <p style="margin: 0 0 5px; color: #000000; font-size: 14px; font-weight: 600;">
                        ${shippingAddress.fullName}
                      </p>
                      <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                        ${shippingAddress.addressLine1}
                      </p>
                      ${shippingAddress.addressLine2 ? `
                        <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                          ${shippingAddress.addressLine2}
                        </p>
                      ` : ''}
                      <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                        ${shippingAddress.city}${shippingAddress.region ? `, ${shippingAddress.region}` : ''} ${shippingAddress.postalCode}
                      </p>
                      <p style="margin: 0 0 3px; color: #666666; font-size: 14px; line-height: 1.6;">
                        ${shippingAddress.country}
                      </p>
                      ${shippingAddress.phone ? `
                        <p style="margin: 8px 0 0; color: #666666; font-size: 14px; font-weight: 600;">
                          📞 ${shippingAddress.phone}
                        </p>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- Call to Action -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center" style="padding: 20px; background-color: #000000; border-radius: 6px;">
                        <a href="${BASE_URL}/admin/orders" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
                          ⚡ PREPARE ORDER FOR DELIVERY
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 0; color: #666666; font-size: 13px; text-align: center;">
                    Order placed at ${formatDate(order.createdAt)}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    This is an automated notification from ${BRAND_NAME} Order System
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Send order confirmation emails to customer and admin
 * This should be called ONLY after payment is confirmed via webhooks
 */
export async function sendOrderEmails(
  order: Order,
  shippingAddress?: Address
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured')
      return { success: false, error: 'Email service not configured' }
    }

    // Prepare emails
    const customerEmail = {
      to: order.email,
      from: FROM_EMAIL,
      subject: `Order Confirmation - ${order.orderNumber} | ${BRAND_NAME}`,
      html: generateCustomerEmailHTML(order, shippingAddress),
    }

    const adminEmail = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `🚨 New Order Placed - ${order.orderNumber}`,
      html: generateAdminEmailHTML(order, shippingAddress),
    }

    // Send both emails
    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(adminEmail),
    ])

    console.log(`✅ Order emails sent successfully for order ${order.orderNumber}`)
    console.log(`   - Customer email: ${order.email}`)
    console.log(`   - Admin email: ${ADMIN_EMAIL}`)

    return { success: true }
  } catch (error: any) {
    console.error('❌ Failed to send order emails:', error)
    
    // Log detailed error information
    if (error.response) {
      console.error('SendGrid Error Response:', error.response.body)
    }

    return {
      success: false,
      error: error.message || 'Failed to send emails',
    }
  }
}