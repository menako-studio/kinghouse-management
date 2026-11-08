interface ChannelBadgeProps {
  channel: "airbnb" | "booking" | "agoda" | "direct"
  status: "connected" | "syncing" | "available" | "coming_soon" | "error"
  syncTime?: string
}

export function ChannelBadge({ channel, status, syncTime }: ChannelBadgeProps) {
  const channelNames: Record<string, string> = {
    airbnb: "Airbnb",
    booking: "Booking.com",
    agoda: "Agoda",
    direct: "Direct Booking",
  }

  const channelColors: Record<string, { bg: string; text: string; dot: string }> = {
    airbnb: { bg: "bg-rose-50/60 border-rose-200/70", text: "text-rose-800", dot: "bg-[#FF5A5F]" },
    booking: { bg: "bg-blue-50/60 border-blue-200/70", text: "text-blue-800", dot: "bg-blue-600" },
    agoda: { bg: "bg-emerald-50/60 border-emerald-200/70", text: "text-emerald-800", dot: "bg-emerald-600" },
    direct: { bg: "bg-amber-50/60 border-amber-200/70", text: "text-amber-800", dot: "bg-amber-600" },
  }

  const statusConfig: Record<string, { label: string; badgeClass: string }> = {
    connected: { label: "Live Sync", badgeClass: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
    syncing: { label: "Syncing...", badgeClass: "bg-blue-100 text-blue-800 animate-pulse border border-blue-200" },
    available: { label: "Engine v2.0", badgeClass: "bg-purple-50 text-purple-700 border border-purple-200" },
    error: { label: "Gagal Sync", badgeClass: "bg-red-100 text-red-800 border border-red-200" },
    coming_soon: { label: "Coming Soon", badgeClass: "bg-gray-100 text-gray-600 border border-gray-200" },
  }

  const currentChannel = channelColors[channel] || channelColors.airbnb
  const currentStatus = statusConfig[status] || statusConfig.coming_soon

  return (
    <div
      className={`inline-flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl border ${currentChannel.bg} transition-all duration-200 hover:shadow-xs`}
    >
      <div className="flex items-center space-x-2.5">
        <span className={`h-2 w-2 rounded-full ${currentChannel.dot} ${status === "connected" ? "animate-pulse" : ""}`} />
        <span className={`text-xs font-semibold ${currentChannel.text}`}>
          {channelNames[channel]}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {syncTime && <span className="text-[10px] text-[#717171] font-mono">{syncTime}</span>}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentStatus.badgeClass}`}>
          {currentStatus.label}
        </span>
      </div>
    </div>
  )
}

