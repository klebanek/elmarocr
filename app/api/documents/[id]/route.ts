import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/documents/[id] - Szczegóły dokumentu
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Aktualizacja dokumentu
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { warehouseWorker, date, notes } = body;

    const document = await prisma.document.update({
      where: { id },
      data: {
        warehouseWorker,
        date: date ? new Date(date) : undefined,
        notes: notes || null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Usunięcie dokumentu
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
