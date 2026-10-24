"use client"

import { useState } from "react"
import { QrCode, X, Copy, Check, Share2, Printer } from "lucide-react"

interface QrModalProps {
  propertySlug: string
  propertyName: string
}

export function QrModal({ propertySlug, propertyName }: QrModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const stayUrl = typeof window !== "undefined"
    ? `${window.location.origin}/stay/${propertySlug}`
    : `https://www.kinghousemanagement.com/stay/${propertySlug}`

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    stayUrl
  )}&bgcolor=1c1917&color=f59e0b&margin=10`

  const handleCopy = () => {
    navigator.clipboard.writeText(stayUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900/80 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-stone-800 hover:text-white transition-all active:scale-95"
      >
        <QrCode className="h-3.5 w-3.5 text-amber-400" />
        QR Code Tamu
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border border-stone-800 bg-stone-950 p-6 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-stone-900 p-1.5 text-stone-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-2">
                Digital Guest Concendium
              </div>
              <h3 className="text-base font-bold text-stone-100 font-serif">
                {propertyName}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Scan QR untuk membuka WiFi, panduan villa, & pesan layanan tambahan.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex justify-center mb-5">
              <div className="rounded-2xl border border-amber-500/30 bg-stone-900 p-4 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt={`QR Code for ${propertyName}`}
                  className="h-48 w-48 rounded-xl object-contain"
                />
              </div>
            </div>

            {/* Link Copy */}
            <div className="flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 p-2.5 mb-4">
              <input
                type="text"
                readOnly
                value={stayUrl}
                className="w-full bg-transparent text-xs text-stone-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 shrink-0 rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-stone-700"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900 py-2.5 text-xs font-semibold text-stone-200 hover:bg-stone-800 transition-colors"
              >
                <Printer className="h-3.5 w-3.5 text-stone-400" />
                Cetak Lembar Meja
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
