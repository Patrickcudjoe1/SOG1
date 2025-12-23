import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // In production, use a proper email service like SendGrid, Resend, or AWS SES
    // For now, we'll just log the email content
    const emailContent = {
      to: order.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Order Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
              Order Confirmation
            </h1>
            
            <p>Thank you for your purchase! Your order has been received and is being processed.</p>
            
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Order Details</h2>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Total:</strong> ₵${order.totalAmount.toFixed(2)}</p>
            </div>
            
            <h2>Items Ordered</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="border-bottom: 2px solid #000;">
                  <th style="text-align: left; padding: 10px;">Item</th>
                  <th style="text-align: center; padding: 10px;">Quantity</th>
                  <th style="text-align: right; padding: 10px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">${item.productName}</td>
                    <td style="text-align: center; padding: 10px;">${item.quantity}</td>
                    <td style="text-align: right; padding: 10px;">₵${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            
            ${order.shippingAddress ? `
              <h2>Shipping Address</h2>
              <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
                <p>${order.shippingAddress.fullName}</p>
                <p>${order.shippingAddress.addressLine1}</p>
                ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ""}
                <p>${order.shippingAddress.city}, ${order.shippingAddress.region || ""} ${order.shippingAddress.postalCode}</p>
                <p>${order.shippingAddress.country}</p>
                ${order.shippingAddress.phone ? `<p>Phone: ${order.shippingAddress.phone}</p>` : ""}
              </div>
            ` : ""}
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              You will receive shipping updates via email. If you have any questions, please contact our customer service.
            </p>
            
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Son of God - Christian Clothing Brand
            </p>
          </body>
        </html>
      `,
    };

    // TODO: Integrate with actual email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'orders@sonofgod.com',
    //   to: emailContent.to,
    //   subject: emailContent.subject,
    //   html: emailContent.html,
    // });

    console.log("Order confirmation email:", emailContent);

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

