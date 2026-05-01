import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = Number(body.orderId);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { error: "Некоректний номер замовлення" },
        { status: 400 }
      );
    }

    const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT;
    const secretKey = process.env.WAYFORPAY_SECRET_KEY;
    const merchantDomain = process.env.WAYFORPAY_DOMAIN;

    if (!merchantAccount || !secretKey || !merchantDomain) {
      return NextResponse.json(
        { error: "Не налаштовані змінні WayForPay у .env.local" },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_amount, payment_status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Замовлення не знайдено" },
        { status: 404 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Замовлення вже оплачено" },
        { status: 400 }
      );
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("quantity, price, subtotal, dishes(name)")
      .eq("order_id", orderId);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: "У замовленні немає товарів" },
        { status: 400 }
      );
    }

    const orderReference = `order-${order.id}-${Date.now()}`;
    const orderDate = Math.floor(Date.now() / 1000);
    const amount = Number(order.total_amount);
    const currency = "UAH";

    const productName = orderItems.map((item: any) => {
      return item.dishes?.name || "Страва";
    });

    const productCount = orderItems.map((item: any) => Number(item.quantity));
    const productPrice = orderItems.map((item: any) => Number(item.price));

    const signatureString = [
      merchantAccount,
      merchantDomain,
      orderReference,
      orderDate,
      amount,
      currency,
      ...productName,
      ...productCount,
      ...productPrice,
    ].join(";");

    const merchantSignature = crypto
      .createHmac("md5", secretKey)
      .update(signatureString)
      .digest("hex");

    return NextResponse.json({
      merchantAccount,
      merchantAuthType: "SimpleSignature",
      merchantDomainName: merchantDomain,
      merchantTransactionType: "AUTO",
      merchantTransactionSecureType: "AUTO",
      merchantSignature,
      apiVersion: 1,
      language: "UA",
      serviceUrl: `${merchantDomain}/api/payment/callback`,
      returnUrl: `${merchantDomain}/api/payment/return?orderId=${orderId}`,
      orderReference,
      orderDate,
      amount,
      currency,
      productName,
      productCount,
      productPrice,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Помилка підготовки платежу" },
      { status: 500 }
    );
  }
}