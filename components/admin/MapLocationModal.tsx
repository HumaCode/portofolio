"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { MapPin, Search, Check, Loader2, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (address: string) => void;
}

// Leaflet Dynamic Component to support Next.js SSR
let L: typeof import("leaflet");

export const MapLocationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [position, setPosition] = useState<[number, number]>([-6.8886, 109.6753]); // Default Pekalongan, Indonesia
  const [address, setAddress] = useState(currentAddress || "Pekalongan, Central Java, Indonesia");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Leaflet & Geocode initial address when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    async function initMap() {
      if (typeof window !== "undefined") {
        L = await import("leaflet");

        // Fix default marker icon paths in Leaflet
        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        if (mounted) setMapLoaded(true);
      }
    }

    initMap();

    // Geocode currentAddress to initial coordinates if available
    if (currentAddress) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(currentAddress)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (mounted && data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setPosition([lat, lon]);
            setAddress(data[0].display_name || currentAddress);
          }
        })
        .catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, [isOpen, currentAddress]);

  // Reverse geocoding when marker is dragged or map clicked
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setLoadingAddress(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
        setAddress(data[0].display_name);
      } else {
        alert("Lokasi tidak ditemukan. Coba kata kunci yang lebih spesifik.");
      }
    } catch (err) {
      console.error("Geocoding search failed:", err);
      alert("Gagal mencari lokasi.");
    } finally {
      setSearching(false);
    }
  };

  const handleSaveLocation = () => {
    onSelectAddress(address);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Lokasi Presisi via Peta Google Map / Hybrid"
      subtitle="Geser titik penanda (marker) pada peta untuk memperbarui alamat secara otomatis"
      icon={<MapPin className="w-5 h-5 text-rose-500" />}
      size="5xl"
    >
      <div className="space-y-4 text-xs">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi, kota, atau nama tempat... (Contoh: Pekalongan, Central Java)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 transition-all text-xs"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 transition-all shrink-0"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            <span>Cari</span>
          </button>
        </form>

        {/* Selected Address Display Card */}
        <div className="p-3.5 rounded-xl bg-[#13131b] border border-rose-500/30 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
                Alamat Terdeteksi ({position[0].toFixed(5)}, {position[1].toFixed(5)})
              </span>
              {loadingAddress ? (
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono mt-0.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                  <span>Mendeteksi alamat titik lokasi...</span>
                </div>
              ) : (
                <p className="text-xs text-white font-medium truncate mt-0.5">{address}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleSaveLocation}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Gunakan Alamat Ini</span>
          </button>
        </div>

        {/* Leaflet Google Maps Tile Container */}
        <div className="w-full h-[450px] rounded-2xl border border-white/[0.1] overflow-hidden relative shadow-2xl bg-[#0d0d15]">
          {mapLoaded ? (
            <LeafletMapContainer
              position={position}
              onMarkerDragEnd={(lat, lng) => {
                setPosition([lat, lng]);
                reverseGeocode(lat, lng);
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              <span>Memuat Peta Google Maps...</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

// Subcomponent using react-leaflet dynamic imports for SSR compatibility
const LeafletMapContainer: React.FC<{
  position: [number, number];
  onMarkerDragEnd: (lat: number, lng: number) => void;
}> = ({ position, onMarkerDragEnd }) => {
  const { MapContainer, TileLayer, Marker, useMap, useMapEvents } = require("react-leaflet");

  // Center update helper when position state changes
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  }

  // Click handler to move marker on map click
  function MapClickHandler() {
    useMapEvents({
      click(e: { latlng: { lat: number; lng: number } }) {
        onMarkerDragEnd(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
    >
      <ChangeView center={position} />
      <MapClickHandler />
      {/* Google Maps Layer (Roadmap style) */}
      <TileLayer
        attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
      />
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e: { target: { getLatLng: () => { lat: number; lng: number } } }) => {
            const latLng = e.target.getLatLng();
            onMarkerDragEnd(latLng.lat, latLng.lng);
          },
        }}
      />
    </MapContainer>
  );
};
