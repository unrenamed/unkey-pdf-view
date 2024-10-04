import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import path from "path";
import { validateApiKey } from "@/lib/unkey";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const page = searchParams.get("page");

  if (!key || !page) {
    return NextResponse.json(
      { message: "API key and page number required" },
      { status: 400 }
    );
  }

  // Validate the API key
  const validationResult = await validateApiKey(key);
  switch (validationResult.status) {
    case "invalid_key":
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });

    case "expired_key":
      return NextResponse.json(
        { message: "The API key has expired. Please request a new key" },
        { status: 403 }
      );

    case "rate_limit_exceeded":
      return NextResponse.json(
        { message: "Too many requests. Please try again later" },
        { status: 429 }
      );

    case "api_error":
      console.error("Key validation API error:", validationResult.error);
      return NextResponse.json(
        { message: "Internal server error. Please try again later" },
        { status: 500 }
      );

    case "unknown_error":
      console.error("Key validation unknown error:", validationResult.error);
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 }
      );
  }

  // Load the full PDF file
  const pdfPath = path.join(process.cwd(), "public/ebook.pdf");
  const fileBuffer = fs.readFileSync(pdfPath);

  // Load PDF document and extract the requested page
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const totalPages = pdfDoc.getPageCount();
  const pageNum = parseInt(page, 10);

  if (pageNum < 1 || pageNum > totalPages) {
    return NextResponse.json(
      {
        message: `Invalid page number. This document has ${totalPages} pages.`,
      },
      { status: 400 }
    );
  }

  // Create a new PDF with just the requested page
  const singlePagePdf = await PDFDocument.create();
  const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [pageNum - 1]);
  singlePagePdf.addPage(copiedPage);

  // Save the single page as bytes
  const pdfBytes = await singlePagePdf.save();

  // Return the PDF data directly in the response, ensuring it's handled as binary
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
