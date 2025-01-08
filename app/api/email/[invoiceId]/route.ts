import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Mailtrap Test",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "ravinduachintha@gmail.com" }],
      template_uuid: "7b74ce11-bac3-43e0-833f-2fdb85449cbd",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "Grapzian",
        company_info_address: "Main Street",
        company_info_city: "Colombo",
        company_info_zip_code: "345345",
        company_info_country: "Sri Lanka",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}