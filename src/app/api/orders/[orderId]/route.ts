import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, customer_phone, total_amount, payment_status, order_status"
    )
    .eq("id", orderId)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Замовлення не знайдено" },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}