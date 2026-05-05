'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Car, Hotel, IdCard, FileText, Plus, Upload, Check, Clock, X } from 'lucide-react';

interface Assignment {
  id: string;
  assignment_status: string;
  [key: string]: any;
}

export function OperationsAssignmentPanel({ bookingId }: { bookingId: string }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guides' | 'transport' | 'hotels' | 'passports' | 'permits'>('guides');

  const [guides, setGuides] = useState<Assignment[]>([]);
  const [transport, setTransport] = useState<Assignment[]>([]);
  const [hotels, setHotels] = useState<Assignment[]>([]);
  const [passports, setPassports] = useState<Assignment[]>([]);
  const [permits, setPermits] = useState<Assignment[]>([]);

  useEffect(() => {
    fetchAllAssignments();
  }, [bookingId]);

  const fetchAllAssignments = async () => {
    setLoading(true);
    try {
      const [guidesRes, transportRes, hotelsRes, passportsRes, permitsRes] = await Promise.all([
        fetch(`/api/operations/guides/${bookingId}`),
        fetch(`/api/operations/transport/${bookingId}`),
        fetch(`/api/operations/hotels/${bookingId}`),
        fetch(`/api/operations/passports/${bookingId}`),
        fetch(`/api/operations/permits/${bookingId}`),
      ]);

      const [guidesData, transportData, hotelsData, passportsData, permitsData] = await Promise.all([
        guidesRes.json(),
        transportRes.json(),
        hotelsRes.json(),
        passportsRes.json(),
        permitsRes.json(),
      ]);

      setGuides(guidesData.data || []);
      setTransport(transportData.data || []);
      setHotels(hotelsData.data || []);
      setPassports(passportsData.data || []);
      setPermits(permitsData.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'booked':
      case 'verified':
      case 'approved':
      case 'issued':
        return 'text-green-600 bg-green-100 dark:bg-green-950/20 dark:text-green-400';
      case 'pending':
      case 'not_received':
      case 'not_applied':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400';
      case 'assigned':
      case 'applied':
      case 'received':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400';
      case 'rejected':
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-950/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('confirmed') || status.includes('booked') || status.includes('verified') || status.includes('approved') || status.includes('issued')) {
      return <Check className="w-4 h-4" />;
    }
    if (status.includes('pending') || status.includes('not_')) {
      return <Clock className="w-4 h-4" />;
    }
    return <X className="w-4 h-4" />;
  };

  const tabs = [
    { id: 'guides' as const, label: 'Guides', icon: User, count: guides.length },
    { id: 'transport' as const, label: 'Transport', icon: Car, count: transport.length },
    { id: 'hotels' as const, label: 'Hotels', icon: Hotel, count: hotels.length },
    { id: 'passports' as const, label: 'Passports', icon: IdCard, count: passports.length },
    { id: 'permits' as const, label: 'Permits', icon: FileText, count: permits.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-semibold">{tab.label}</span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'guides' && (
          <GuidesTab guides={guides} bookingId={bookingId} onUpdate={fetchAllAssignments} />
        )}
        {activeTab === 'transport' && (
          <TransportTab transport={transport} bookingId={bookingId} onUpdate={fetchAllAssignments} />
        )}
        {activeTab === 'hotels' && (
          <HotelsTab hotels={hotels} bookingId={bookingId} onUpdate={fetchAllAssignments} />
        )}
        {activeTab === 'passports' && (
          <PassportsTab passports={passports} bookingId={bookingId} onUpdate={fetchAllAssignments} />
        )}
        {activeTab === 'permits' && (
          <PermitsTab permits={permits} bookingId={bookingId} onUpdate={fetchAllAssignments} />
        )}
      </div>
    </div>
  );
}

// Tab Components
function GuidesTab({ guides, bookingId, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Guide Assignments</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Assign Guide
        </button>
      </div>

      {guides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No guides assigned yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Click "Assign Guide" to add one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guides.map((guide: any) => (
            <div key={guide.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{guide.guide_name}</h4>
                  {guide.guide_phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📱 {guide.guide_phone}</p>
                  )}
                  {guide.guide_license && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">🪪 {guide.guide_license}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(guide.assignment_status)}`}>
                  {getStatusIcon(guide.assignment_status)}
                  {guide.assignment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TransportTab({ transport, bookingId, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transport Assignments</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Assign Transport
        </button>
      </div>

      {transport.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No transport assigned yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Click "Assign Transport" to add one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transport.map((item: any) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.driver_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">🚗 {item.vehicle_type} ({item.vehicle_number})</p>
                  {item.driver_phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📱 {item.driver_phone}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(item.assignment_status)}`}>
                  {getStatusIcon(item.assignment_status)}
                  {item.assignment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HotelsTab({ hotels, bookingId, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hotel Assignments</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <Hotel className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No hotels booked yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Click "Add Hotel" to book accommodation</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hotels.map((hotel: any) => (
            <div key={hotel.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{hotel.hotel_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📍 {hotel.location}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    📅 {new Date(hotel.check_in_date).toLocaleDateString()} - {new Date(hotel.check_out_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    🛏️ {hotel.number_of_rooms}x {hotel.room_type}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(hotel.status)}`}>
                  {getStatusIcon(hotel.status)}
                  {hotel.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PassportsTab({ passports, bookingId, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Guest Passports</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Add Guest
        </button>
      </div>

      {passports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <IdCard className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No passports added yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Click "Add Guest" to add passport details</p>
        </div>
      ) : (
        <div className="space-y-3">
          {passports.map((passport: any) => (
            <div key={passport.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{passport.guest_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">🛂 {passport.passport_number}</p>
                  {passport.passport_expiry && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      📅 Expires: {new Date(passport.passport_expiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(passport.status)}`}>
                  {getStatusIcon(passport.status)}
                  {passport.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PermitsTab({ permits, bookingId, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Permit Applications</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Apply for Permit
        </button>
      </div>

      {permits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No permits applied yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Click "Apply for Permit" to start application</p>
        </div>
      ) : (
        <div className="space-y-3">
          {permits.map((permit: any) => (
            <div key={permit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{permit.permit_type.replace(/_/g, ' ')}</h4>
                  {permit.guest_name && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">👤 {permit.guest_name}</p>
                  )}
                  {permit.application_date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      📅 Applied: {new Date(permit.application_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(permit.status)}`}>
                  {getStatusIcon(permit.status)}
                  {permit.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
    case 'booked':
    case 'verified':
    case 'approved':
    case 'issued':
      return 'text-green-600 bg-green-100 dark:bg-green-950/20 dark:text-green-400';
    case 'pending':
    case 'not_received':
    case 'not_applied':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400';
    case 'assigned':
    case 'applied':
    case 'received':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400';
    case 'rejected':
    case 'cancelled':
      return 'text-red-600 bg-red-100 dark:bg-red-950/20 dark:text-red-400';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
  }
}

function getStatusIcon(status: string) {
  if (status.includes('confirmed') || status.includes('booked') || status.includes('verified') || status.includes('approved') || status.includes('issued')) {
    return <Check className="w-4 h-4" />;
  }
  if (status.includes('pending') || status.includes('not_')) {
    return <Clock className="w-4 h-4" />;
  }
  return <X className="w-4 h-4" />;
}
