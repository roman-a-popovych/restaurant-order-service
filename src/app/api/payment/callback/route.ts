import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function createMerchantResponseSignature(
  orderReference: string,
  status: string,
  time: number,
  secretKey: string
) {
  return crypto
    .createHmac("md5", secretKey)
    .update(`${orderReference};${status};${time}`)
    .digest("hex");
}

function createCallbackSignature(data: any, secretKey: string) {
  const signatureString = [
    data.merchantAccount,
    data.orderReference,
    data.amount,
    data.currency,
    data.authCode,
    data.cardPan,
    data.transactionStatus,
    data.reasonCode,
  ].join(";");

  return crypto
    .createHmac("md5", secretKey)
    .update(signatureString)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const secretKey = process.env.WAYFORPAY_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "WAYFORPAY_SECRET_KEY is not configured" },
        { status: 500 }
      );
    }

    const orderReference = String(data.orderReference || "");
    const receivedSignature = String(data.merchantSignature || "");
    const expectedSignature = createCallbackSignature(data, secretKey);

    if (!orderReference) {
      return NextResponse.json(
        { error: "Missing orderReference" },
        { status: 400 }
      );
    }

    if (receivedSignature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid WayForPay signature" },
        { status: 400 }
      );
    }

    const orderId = Number(orderReference);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { error: "Invalid orderReference" },
        { status: 400 }
      );
    }

    const isApproved =
      data.transactionStatus === "Approved" && Number(data.reasonCode) === 1100;

    const paymentStatus = isApproved ? "paid" : "failed";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
      })
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const time = Math.floor(Date.now() / 1000);
    const status = "accept";
    const signature = createMerchantResponseSignature(
      orderReference,
      status,
      time,
      secretKey
    );

    return NextResponse.json({
      orderReference,
      status,
      time,
      signature,
    });
  } catch (error) {
    console.error("WayForPay callback error:", error);

    return NextResponse.json(
      { error: "Callback processing error" },
      { status: 500 }
    );
  }
}