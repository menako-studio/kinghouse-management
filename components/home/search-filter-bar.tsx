"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Users } from "lucide-react"

export function SearchFilterBar() {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set("area", destination)
    if (guests) params.set("guests", guests)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)

    router.push(`/villas?${params.toString()}`)
  }

  return (
    <div className="relative mt-4 sm:-mt-10 lg:-mt-12 z-40 mx-auto max-w-5xl px-4 sm:px-6">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-[#EBEBEB] rounded-2xl md:rounded-full bg-white p-2.5 shadow-[0_12px_45px_rgba(0,0,0,0.08)] border border-[#EBEBEB]"
      >
        {/* Destination Input */}
        <div className="flex flex-1 items-center px-4 py-2 hover:bg-[#FAFAFA] rounded-xl md:rounded-l-full transition-colors cursor-pointer group">
          <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] text-[#222222] group-hover:bg-white border border-[#EBEBEB]">
            <MapPin className="h-4 w-4 text-[#222222]" />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#222222]">
              Destination
            </span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-normal text-[#717171] focus:outline-none focus:text-[#222222] cursor-pointer"
            >
              <option value="">All Greater Jakarta Enclaves</option>
              <option value="jagakarsa">Jagakarsa (South Jakarta)</option>
              <option value="tangerang">Tangerang (Banten)</option>
              <option value="palmerah">Palmerah (West Jakarta)</option>
              <option value="cikarang">Cikarang (East Jakarta Corridor)</option>
            </select>
          </div>
        </div>

        {/* Check-In / Check-Out */}
        <div className="flex flex-1 items-center px-4 py-2 hover:bg-[#FAFAFA] transition-colors cursor-pointer group">
          <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] text-[#222222] group-hover:bg-white border border-[#EBEBEB]">
            <Calendar className="h-4 w-4 text-[#222222]" />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#222222]">
              Dates
            </span>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#717171]">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-xs text-[#717171] focus:outline-none focus:text-[#222222] cursor-pointer"
                aria-label="Check-in Date"
              />
              <span className="text-[#A69C8E]">&rarr;</span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-xs text-[#717171] focus:outline-none focus:text-[#222222] cursor-pointer"
                aria-label="Check-out Date"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="flex flex-1 items-center px-4 py-2 hover:bg-[#FAFAFA] transition-colors cursor-pointer group">
          <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] text-[#222222] group-hover:bg-white border border-[#EBEBEB]">
            <Users className="h-4 w-4 text-[#222222]" />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#222222]">
              Guests
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-normal text-[#717171] focus:outline-none focus:text-[#222222] cursor-pointer"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="4">4 Guests</option>
              <option value="6">6 Guests</option>
              <option value="8">8+ Guests</option>
            </select>
          </div>
        </div>

        {/* Search CTA Button */}
        <div className="p-1.5 flex justify-end">
          <button
            type="submit"
            className="flex h-12 w-full md:w-12 items-center justify-center rounded-xl md:rounded-full bg-[#222222] text-white hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-md"
            aria-label="Search available villas"
          >
            <Search className="h-4 w-4" />
            <span className="ml-2 text-xs font-semibold uppercase tracking-wider md:hidden">
              Search Availability
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
