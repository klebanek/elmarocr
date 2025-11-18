import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - Lista wszystkich produktów
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const barcode = searchParams.get("barcode");

    // Wyszukiwanie po kodzie kreskowym
    if (barcode) {
      const product = await prisma.product.findUnique({
        where: { barcode },
      });
      return NextResponse.json(product);
    }

    // Wyszukiwanie po nazwie
    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { barcode: { contains: search } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Dodanie nowego produktu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barcode, name, isManual = false } = body;

    // Walidacja
    if (!barcode || !name) {
      return NextResponse.json(
        { error: "Barcode and name are required" },
        { status: 400 }
      );
    }

    // Sprawdź czy produkt już istnieje
    const existingProduct = await prisma.product.findUnique({
      where: { barcode },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this barcode already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        barcode,
        name,
        isManual,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
