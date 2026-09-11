import { NextRequest, NextResponse } from "next/server"
import { ExpenseSchema } from "@/lib/validations"
import { ExpenseRecord } from "@/lib/erp/types"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  getExpensesStore,
  addExpenseToStore,
  deleteExpenseFromStore,
} from "@/lib/erp/store"

// Map snake_case database row to TypeScript domain model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToExpense(row: any): ExpenseRecord {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertySlug: row.property_slug,
    propertyName: row.property_name,
    category: row.category,
    description: row.description,
    amountIdr: Number(row.amount_idr),
    date: typeof row.date === "string" ? row.date.split("T")[0] : row.date,
    recordedBy: row.recorded_by,
    vendorName: row.vendor_name || undefined,
    receiptUrl: row.receipt_url || undefined,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get("propertyId")
  const category = searchParams.get("category")

  const supabase = getSupabaseServerClient()

  if (supabase) {
    try {
      let query = supabase.from("expenses").select("*").order("date", { ascending: false })

      if (propertyId) {
        query = query.or(`property_id.eq.${propertyId},property_slug.eq.${propertyId}`)
      }
      if (category) {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (!error && data) {
        const mapped = data.map(mapRowToExpense)
        const totalAmount = mapped.reduce((sum, e) => sum + e.amountIdr, 0)
        return NextResponse.json({
          success: true,
          source: "supabase",
          totalCount: mapped.length,
          totalAmountIdr: totalAmount,
          expenses: mapped,
        })
      }
    } catch (err) {
      console.warn("Supabase expenses query error, falling back:", err)
    }
  }

  let filtered = [...getExpensesStore()]
  if (propertyId) {
    filtered = filtered.filter((e) => e.propertyId === propertyId || e.propertySlug === propertyId)
  }
  if (category) {
    filtered = filtered.filter((e) => e.category === category)
  }

  const totalAmount = filtered.reduce((sum, e) => sum + e.amountIdr, 0)

  return NextResponse.json({
    success: true,
    source: "actual-store",
    totalCount: filtered.length,
    totalAmountIdr: totalAmount,
    expenses: filtered,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const parseResult = ExpenseSchema.safeParse(body)

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Data pengeluaran tidak valid."
      return NextResponse.json({ error: firstError, issues: parseResult.error.issues }, { status: 400 })
    }

    const data = parseResult.data

    const newExpense: ExpenseRecord = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      propertyId: data.propertyId,
      propertySlug: data.propertyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      propertyName: data.propertyName,
      category: data.category,
      description: data.description,
      amountIdr: data.amountIdr,
      date: data.date,
      recordedBy: data.recordedBy,
      vendorName: data.vendorName,
      receiptUrl: data.receiptUrl,
    }

    const supabase = getSupabaseServerClient()

    if (supabase) {
      try {
        const { error } = await supabase.from("expenses").insert({
          id: newExpense.id,
          property_id: newExpense.propertyId,
          property_slug: newExpense.propertySlug,
          property_name: newExpense.propertyName,
          category: newExpense.category,
          description: newExpense.description,
          amount_idr: newExpense.amountIdr,
          date: newExpense.date,
          recorded_by: newExpense.recordedBy,
          vendor_name: newExpense.vendorName || null,
          receipt_url: newExpense.receiptUrl || null,
        })

        if (!error) {
          addExpenseToStore(newExpense)
          return NextResponse.json({
            success: true,
            source: "supabase",
            message: "Biaya operasional properti berhasil dicatat ke Supabase.",
            expense: newExpense,
          }, { status: 201 })
        }
      } catch (err) {
        console.warn("Supabase expense insert error, falling back:", err)
      }
    }

    addExpenseToStore(newExpense)

    return NextResponse.json({
      success: true,
      source: "actual-store",
      message: "Biaya operasional properti berhasil dicatat.",
      expense: newExpense,
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan data pengeluaran." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID pengeluaran wajib diisi." }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (supabase) {
      try {
        await supabase.from("expenses").delete().eq("id", id)
      } catch (err) {
        console.warn("Supabase expense delete error:", err)
      }
    }

    deleteExpenseFromStore(id)

    return NextResponse.json({
      success: true,
      message: `Nota pengeluaran #${id} berhasil dihapus.`,
    })
  } catch {
    return NextResponse.json({ error: "Gagal menghapus pengeluaran." }, { status: 500 })
  }
}
