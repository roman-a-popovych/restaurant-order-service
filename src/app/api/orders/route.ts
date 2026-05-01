import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CartItemFromClient = {
  id: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      deliveryType,
      address,
      comment,
      cart,
    } = body;

    if (!customerName || !customerPhone || !deliveryType) {
      return NextResponse.json(
        { error: "Не заповнені обов’язкові поля" },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Кошик порожній" },
        { status: 400 }
      );
    }

    const cartItems: CartItemFromClient[] = cart.map((item: any) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
    }));

    const invalidItem = cartItems.find(
      (item) =>
        !Number.isInteger(item.id) ||
        item.id <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    );

    if (invalidItem) {
      return NextResponse.json(
        { error: "Некоректні дані кошика" },
        { status: 400 }
      );
    }

    if (deliveryType === "delivery" && !String(address || "").trim()) {
      return NextResponse.json(
        { error: "Для доставки потрібно вказати адресу" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const dishIds = cartItems.map((item) => item.id);

    const { data: dishes, error: dishesError } = await supabase
      .from("dishes")
      .select("id, price, is_available")
      .in("id", dishIds);

    if (dishesError) {
      return NextResponse.json(
        { error: dishesError.message },
        { status: 500 }
      );
    }

    if (!dishes || dishes.length !== dishIds.length) {
      return NextResponse.json(
        { error: "Одна або кілька страв не знайдені" },
        { status: 400 }
      );
    }

    const unavailableDish = dishes.find((dish) => !dish.is_available);

    if (unavailableDish) {
      return NextResponse.json(
        { error: "Одна або кілька страв зараз недоступні" },
        { status: 400 }
      );
    }

    const items = cartItems.map((cartItem) => {
      const dish = dishes.find((dish) => dish.id === cartItem.id);

      if (!dish) {
        throw new Error("Страву не знайдено");
      }

      const price = Number(dish.price);
      const subtotal = price * cartItem.quantity;

      return {
        dish_id: cartItem.id,
        quantity: cartItem.quantity,
        price,
        subtotal,
      };
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_type: deliveryType,
        address: deliveryType === "delivery" ? address : null,
        comment,
        total_amount: total,
        payment_status: "pending",
        order_status: "new",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      );
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      dish_id: item.dish_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      totalAmount: total,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Помилка створення замовлення" },
      { status: 500 }
    );
  }
}