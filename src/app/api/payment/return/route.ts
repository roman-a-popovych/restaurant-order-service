import { NextResponse } from "next/server";

function getRedirectUrl(request: Request, orderId: string, isSuccess: boolean) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  if (isSuccess) {
    return `${baseUrl}/payment/success?orderId=${orderId}`;
  }

  return `${baseUrl}/payment/failed?orderId=${orderId}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || "";

  return NextResponse.redirect(getRedirectUrl(request, orderId, true));
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const orderIdFromQuery = url.searchParams.get("orderId") || "";

  let orderId = orderIdFromQuery;
  let isSuccess = true;

  try {
    const data = await request.formData();

    const orderReference = String(data.get("orderReference") || "");
    const transactionStatus = String(data.get("transactionStatus") || "");
    const reasonCode = String(data.get("reasonCode") || "");

    if (orderReference) {
      orderId = orderReference;
    }

    isSuccess =
      transactionStatus === "Approved" && Number(reasonCode) === 1100;
  } catch {
    isSuccess = false;
  }

  return NextResponse.redirect(getRedirectUrl(request, orderId, isSuccess), {
    status: 303,
  });
}