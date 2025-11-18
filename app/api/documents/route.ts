import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/documents - Lista wszystkich dokumentów
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Utworzenie nowego dokumentu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { warehouseWorker, date, notes, items } = body;

    // Walidacja
    if (!warehouseWorker) {
      return NextResponse.json(
        { error: "Warehouse worker name is required" },
        { status: 400 }
      );
    }

    // Utworzenie dokumentu z pozycjami
    const document = await prisma.document.create({
      data: {
        warehouseWorker,
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
        items: items
          ? {
              create: items.map((item: { productId: string; quantity: number }) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            }
          : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
