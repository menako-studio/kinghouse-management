import { Reservation, ExpenseRecord, OwnerStatement } from "./types"
import { formatCurrency } from "@/lib/utils"

/**
 * Converts reservation array to downloadable CSV string.
 */
export function exportReservationsToCsv(reservations: Reservation[]): string {
  const headers = [
    "Reservation ID",
    "Property",
    "Guest Name",
    "Channel",
    "Check In",
    "Check Out",
    "Nights",
    "Guests",
    "Gross Payout (IDR)",
    "Cleaning Fee (IDR)",
    "Management Fee (IDR)",
    "Net Owner Payout (IDR)",
    "Fee Tier",
    "Status",
    "Created At",
  ]

  const rows = reservations.map((r) => [
    r.id,
    `"${r.propertyName.replace(/"/g, '""')}"`,
    `"${r.guestName.replace(/"/g, '""')}"`,
    r.channel,
    r.checkIn,
    r.checkOut,
    r.nights,
    r.guests,
    r.grossPayoutIdr,
    r.cleaningFeeIdr,
    r.managementFeeIdr,
    r.netOwnerPayoutIdr,
    r.feeTier === "premium" ? "20% Premium" : "15% Standard",
    r.status,
    r.createdAt,
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n")
}

/**
 * Converts expense records array to downloadable CSV string.
 */
export function exportExpensesToCsv(expenses: ExpenseRecord[]): string {
  const headers = [
    "Expense ID",
    "Property",
    "Category",
    "Description",
    "Amount (IDR)",
    "Date",
    "Recorded By",
    "Vendor",
  ]

  const rows = expenses.map((e) => [
    e.id,
    `"${e.propertyName.replace(/"/g, '""')}"`,
    `"${e.category}"`,
    `"${e.description.replace(/"/g, '""')}"`,
    e.amountIdr,
    e.date,
    `"${e.recordedBy}"`,
    `"${e.vendorName || "-"}"`,
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n")
}

/**
 * Triggers client-side browser file download for generated CSV.
 */
export function downloadCsvFile(csvContent: string, filename: string): void {
  if (typeof window === "undefined") return
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generates a clean, print-ready HTML page for Owner Statements.
 */
export function printOwnerStatement(statement: OwnerStatement): void {
  if (typeof window === "undefined") return

  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Bagi Hasil — ${statement.propertyName} (${statement.periodMonthYear})</title>
      <style>
        @page { size: A4 portrait; margin: 20mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #18181A;
          background: #FFF;
          margin: 0;
          padding: 24px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #18181A;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        .tagline {
          font-size: 11px;
          color: #717171;
        }
        .statement-meta {
          text-align: right;
          font-size: 12px;
        }
        .title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .badge {
          display: inline-block;
          background: #F4F3EE;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #717171;
          margin-top: 24px;
          margin-bottom: 12px;
          border-bottom: 1px solid #EBE8E2;
          padding-bottom: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 13px;
        }
        th, td {
          padding: 10px 12px;
          text-align: left;
        }
        th {
          background: #F8F7F4;
          font-weight: 600;
          color: #555;
        }
        tr:nth-child(even) {
          background: #FAFAF8;
        }
        .text-right {
          text-align: right;
        }
        .font-mono {
          font-family: monospace;
        }
        .total-box {
          background: #F8F7F4;
          border: 1px solid #EBE8E2;
          border-radius: 8px;
          padding: 16px;
          margin-top: 24px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13px;
        }
        .grand-total {
          border-top: 2px solid #18181A;
          margin-top: 8px;
          padding-top: 10px;
          font-size: 16px;
          font-weight: 800;
          color: #18181A;
        }
        .footer {
          margin-top: 48px;
          border-top: 1px solid #EBE8E2;
          padding-top: 16px;
          font-size: 10px;
          color: #717171;
          display: flex;
          justify-content: space-between;
        }
        .signatures {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        .sign-box {
          width: 200px;
          text-align: center;
          font-size: 12px;
        }
        .sign-line {
          margin-top: 60px;
          border-bottom: 1px solid #18181A;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">KINGHOUSE</div>
          <div class="tagline">Editorial Property Management & Asset Yield Suite</div>
          <div style="font-size: 11px; margin-top: 4px; color: #555;">PT Kreasi Usman Gosse &bull; WA: 0821-2393-3218</div>
        </div>
        <div class="statement-meta">
          <div class="title">OWNER PAYOUT STATEMENT</div>
          <div>No: <span class="font-mono"><strong>${statement.statementId}</strong></span></div>
          <div>Periode: <strong>${statement.periodMonthYear}</strong></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px; margin-bottom: 20px;">
        <div>
          <div style="color: #717171;">PROPERTI:</div>
          <div style="font-weight: 700; font-size: 14px;">${statement.propertyName}</div>
          <div>Lokasi: ${statement.propertyArea}</div>
        </div>
        <div style="text-align: right;">
          <div style="color: #717171;">PEMILIK PROPERTI:</div>
          <div style="font-weight: 700; font-size: 14px;">${statement.ownerName}</div>
          <div>Tier Manajemen: <span class="badge">${statement.managementFeePercent}% Full-Service</span></div>
        </div>
      </div>

      <div class="section-title">Ringkasan Kinerja Okupansi</div>
      <table>
        <thead>
          <tr>
            <th>Total Reservasi</th>
            <th>Total Malam Terisi</th>
            <th>Tingkat Okupansi</th>
            <th class="text-right">Total Pendapatan Kotor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${statement.reservationsCount} Stays</strong></td>
            <td><strong>${statement.totalNightsBooked} Malam</strong></td>
            <td><strong>${statement.occupancyRatePercent}%</strong></td>
            <td class="text-right font-mono"><strong>${formatCurrency(statement.grossRevenueIdr, "IDR")}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="total-box">
        <div class="total-row">
          <span>Gross Accommodation Revenue (Gross Payout)</span>
          <span class="font-mono">${formatCurrency(statement.grossRevenueIdr, "IDR")}</span>
        </div>
        <div class="total-row" style="color: #717171;">
          <span>(-) Cleaning Fee (Dedicated Turnover Operations)</span>
          <span class="font-mono">- ${formatCurrency(statement.totalCleaningFeeIdr, "IDR")}</span>
        </div>
        <div class="total-row" style="color: #717171;">
          <span>(-) Kinghouse Management Fee (${statement.managementFeePercent}%)</span>
          <span class="font-mono">- ${formatCurrency(statement.totalManagementFeeIdr, "IDR")}</span>
        </div>
        <div class="total-row" style="color: #717171;">
          <span>(-) Biaya Operasional / POS Properti (PLN, Laundry, Maintenance)</span>
          <span class="font-mono">- ${formatCurrency(statement.totalExpensesIdr, "IDR")}</span>
        </div>
        <div class="total-row grand-total">
          <span>NET PAYOUT TO OWNER (DITRANSFER KE REKENING)</span>
          <span class="font-mono">${formatCurrency(statement.netRemittanceToOwnerIdr, "IDR")}</span>
        </div>
      </div>

      <div class="signatures">
        <div class="sign-box">
          <div>Disiapkan Oleh,</div>
          <div><strong>Kinghouse Operations</strong></div>
          <div class="sign-line"></div>
          <div style="margin-top: 4px; font-size: 11px; color: #717171;">Finance & Asset Manager</div>
        </div>
        <div class="sign-box">
          <div>Disetujui Oleh,</div>
          <div><strong>${statement.ownerName}</strong></div>
          <div class="sign-line"></div>
          <div style="margin-top: 4px; font-size: 11px; color: #717171;">Property Owner / Investor</div>
        </div>
      </div>

      <div class="footer">
        <div>Dicetak otomatis melalui Kinghouse Hospitality CMS Platform &bull; kinghousemanagement.com</div>
        <div>Dokumen Resmi &bull; Generated: ${new Date(statement.generatedAt).toLocaleString("id-ID")}</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
