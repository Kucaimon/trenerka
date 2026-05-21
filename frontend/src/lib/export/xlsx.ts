/** Lightweight XLSX export via dynamic import (SheetJS). */
export async function downloadXlsx(
  filename: string,
  rows: (string | number | null | undefined)[][],
  sheetName = 'Sheet1',
): Promise<void> {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.aoa_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}
