import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // const { name, email, message } = await req.json();
    const {
      name,
      // ["from-email"]: fromEmail, // no use because smtp use email with which smtp is registered
      ["to-email"]: toEmail,
      message,
    } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail", // you can use any provider or SMTP
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      // from: email,
      // to: process.env.RECEIVER_EMAIL, // where emails will be sent
      // from: fromEmail, // no use because smtp use email with which smtp is registered
      to: toEmail, // where emails will be sent
      subject: `New message from ${name}`,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
