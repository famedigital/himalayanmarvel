'use client';

import { useState, useEffect } from 'react';
import { Briefcase, User, Car, Building, MapPin, Calendar, Save, AlertCircle, Check, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { handleAuthError } from '@/lib/supabase/auth-utils';

interface OperationsTabProps {
  itineraryId: string;
  itinerary: any;
  booking?: any;
}

export function OperationsTab({ itineraryId, itinerary, booking }: OperationsTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Operations form state
  const [operationsForm, setOperationsForm] = useState({
    status: 'pending',
    guide_name: '',
    guide_phone: '',
    guide_email: '',
    guide_notes: '',

    car_type: '',
    car_number: '',
    driver_name: '',
    driver_phone: '',

    hotels: [] as Array<{
      id: string;
      location_day: string;
      hotel_name: string;
      hotel_phone: string;
      hotel_address: string;
      checkin_date: string;
      checkout_date: string;
      notes: string;
    }>,

    notes: '',
  });

  useEffect(() => {
    if (booking) {
      setActiveBooking(booking);
      loadOperationsData(booking);
    } else {
      fetchBooking();
    }
  }, [itineraryId, booking]);

  const fetchBooking = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching booking:', error);
        // Don't throw - just log and continue
        // Booking might not exist yet, which is fine
      }

      if (data) {
        setActiveBooking(data);
        loadOperationsData(data);
      }
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      if (handleAuthError(error)) {
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const loadOperationsData = (bookingData: any) => {
    // Load from guide_details JSONB
    if (bookingData.guide_details) {
      setOperationsForm(prev => ({
        ...prev,
        guide_name: bookingData.guide_details.guide_name || '',
        guide_phone: bookingData.guide_details.guide_phone || '',
        guide_email: bookingData.guide_details.guide_email || '',
        guide_notes: bookingData.guide_details.guide_notes || '',
      }));
    }

    // Load from car_details JSONB
    if (bookingData.car_details) {
      setOperationsForm(prev => ({
        ...prev,
        car_type: bookingData.car_details.car_type || '',
        car_number: bookingData.car_details.car_number || '',
        driver_name: bookingData.car_details.driver_name || '',
        driver_phone: bookingData.car_details.driver_phone || '',
      }));
    }

    // Load from hotel_details JSONB (support multiple hotels)
    if (bookingData.hotel_details) {
      if (Array.isArray(bookingData.hotel_details)) {
        // Multiple hotels
        setOperationsForm(prev => ({
          ...prev,
          hotels: bookingData.hotel_details.map((h: any, index: number) => ({
            id: h.id || `hotel-${index}`,
            location_day: h.location_day || h.location || '',
            hotel_name: h.hotel_name || '',
            hotel_phone: h.hotel_phone || '',
            hotel_address: h.hotel_address || '',
            checkin_date: h.checkin_date || h.hotel_checkin || '',
            checkout_date: h.checkout_date || h.hotel_checkout || '',
            notes: h.notes || '',
          })),
        }));
      } else {
        // Single hotel (backward compatibility)
        setOperationsForm(prev => ({
          ...prev,
          hotels: [{
            id: 'hotel-0',
            location_day: bookingData.hotel_details.location_day || bookingData.hotel_details.location || 'Main Hotel',
            hotel_name: bookingData.hotel_details.hotel_name || '',
            hotel_phone: bookingData.hotel_details.hotel_phone || '',
            hotel_address: bookingData.hotel_details.hotel_address || '',
            checkin_date: bookingData.hotel_details.checkin_date || bookingData.hotel_details.hotel_checkin || '',
            checkout_date: bookingData.hotel_details.checkout_date || bookingData.hotel_details.hotel_checkout || '',
            notes: bookingData.hotel_details.notes || '',
          }],
        }));
      }
    }

    // Load status and notes
    if (bookingData.status) {
      setOperationsForm(prev => ({ ...prev, status: bookingData.status }));
    }
    if (bookingData.notes) {
      setOperationsForm(prev => ({ ...prev, notes: bookingData.notes }));
    }
  };

  const handleSaveOperations = async () => {
    setSaving(true);
    try {
      const supabase = createClient();

      // Prepare data - store everything in existing JSONB fields
      const guide_details = {
        guide_name: operationsForm.guide_name,
        guide_phone: operationsForm.guide_phone,
        guide_email: operationsForm.guide_email,
        guide_notes: operationsForm.guide_notes,
      };

      const car_details = {
        car_type: operationsForm.car_type,
        car_number: operationsForm.car_number,
        driver_name: operationsForm.driver_name,
        driver_phone: operationsForm.driver_phone,
      };

      // Store multiple hotels in hotel_details JSONB
      const hotel_details = operationsForm.hotels.map(h => ({
        id: h.id,
        location_day: h.location_day,
        hotel_name: h.hotel_name,
        hotel_phone: h.hotel_phone,
        hotel_address: h.hotel_address,
        checkin_date: h.checkin_date,
        checkout_date: h.checkout_date,
        notes: h.notes,
      }));

      let updateData: any = {
        guide_details,
        car_details,
        hotel_details,
        notes: operationsForm.notes,
        status: operationsForm.status,
      };

      // Update existing booking or create new one
      let result;
      if (activeBooking) {
        result = await supabase
          .from('bookings')
          .update(updateData)
          .eq('id', activeBooking.id)
          .select();
      } else {
        // Create new booking with only valid columns
        updateData = {
          ...updateData,
          itinerary_id: itineraryId,
          guest_name: itinerary?.guest_name || '',
          travel_date: itinerary?.start_date,
          num_guests: itinerary?.num_guests || 1,
        };
        result = await supabase
          .from('bookings')
          .insert(updateData)
          .select();
      }

      if (result.error) throw result.error;

      // Update local state
      if (result.data && result.data.length > 0) {
        setActiveBooking(result.data[0]);
      }

      alert('✅ Operations saved successfully!');
    } catch (error: any) {
      console.error('Error saving operations:', error);
      if (handleAuthError(error)) {
        return;
      }
      alert(`Failed to save operations: ${error?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  // Hotel management functions
  const addHotel = () => {
    const newHotel = {
      id: `hotel-${Date.now()}`,
      location_day: '',
      hotel_name: '',
      hotel_phone: '',
      hotel_address: '',
      checkin_date: '',
      checkout_date: '',
      notes: '',
    };
    setOperationsForm(prev => ({
      ...prev,
      hotels: [...prev.hotels, newHotel],
    }));
  };

  const updateHotel = (index: number, updates: Partial<typeof operationsForm.hotels[0]>) => {
    const newHotels = [...operationsForm.hotels];
    newHotels[index] = { ...newHotels[index], ...updates };
    setOperationsForm(prev => ({ ...prev, hotels: newHotels }));
  };

  const removeHotel = (index: number) => {
    if (!confirm('Remove this hotel assignment?')) return;
    const newHotels = operationsForm.hotels.filter((_, i) => i !== index);
    setOperationsForm(prev => ({ ...prev, hotels: newHotels }));
  };

  const getStatusBadge = () => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      confirmed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[operationsForm.status as keyof typeof styles] || styles.pending}`}>
        {operationsForm.status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading operations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Operations Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Assign guides, transport, and accommodation for this itinerary
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
          </div>
        </div>
      </div>

      {/* Quick Assignment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guide Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">Guide</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {operationsForm.guide_name ? 'Assigned' : 'Not assigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Transport Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">Transport</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {operationsForm.car_type ? 'Assigned' : 'Not assigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Hotel Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">Hotels</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {operationsForm.hotels.length} {operationsForm.hotels.length === 1 ? 'Hotel' : 'Hotels'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Details - Accordion Style */}
      <div className="space-y-3">
        {/* Guide Assignment - Collapsible */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'guide' ? null : 'guide')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Guide Assignment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {operationsForm.guide_name || 'Not assigned'}
                </p>
              </div>
            </div>
            {expandedSection === 'guide' ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
          </button>

          {expandedSection === 'guide' && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Guide Name *
                  </label>
                  <input
                    type="text"
                    value={operationsForm.guide_name}
                    onChange={(e) => setOperationsForm({ ...operationsForm, guide_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="Enter guide name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={operationsForm.guide_phone}
                    onChange={(e) => setOperationsForm({ ...operationsForm, guide_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={operationsForm.guide_email}
                    onChange={(e) => setOperationsForm({ ...operationsForm, guide_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="guide@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={operationsForm.guide_notes}
                    onChange={(e) => setOperationsForm({ ...operationsForm, guide_notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="Special instructions, languages spoken, etc."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transport Assignment - Collapsible */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'transport' ? null : 'transport')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transport Assignment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {operationsForm.car_type || 'Not assigned'}
                </p>
              </div>
            </div>
            {expandedSection === 'transport' ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
          </button>

          {expandedSection === 'transport' && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Car Type *
                  </label>
                  <input
                    type="text"
                    value={operationsForm.car_type}
                    onChange={(e) => setOperationsForm({ ...operationsForm, car_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="e.g., Toyota Innova, Tempo Traveller"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    value={operationsForm.car_number}
                    onChange={(e) => setOperationsForm({ ...operationsForm, car_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="e.g., MH 01 AB 1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    value={operationsForm.driver_name}
                    onChange={(e) => setOperationsForm({ ...operationsForm, driver_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="Enter driver name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Driver Phone *
                  </label>
                  <input
                    type="tel"
                    value={operationsForm.driver_phone}
                    onChange={(e) => setOperationsForm({ ...operationsForm, driver_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hotel Assignment - Collapsible with Table View */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'hotels' ? null : 'hotels')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hotel Assignments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {operationsForm.hotels.length} {operationsForm.hotels.length === 1 ? 'hotel' : 'hotels'} assigned
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {expandedSection === 'hotels' ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
            </div>
          </button>

          {expandedSection === 'hotels' && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              {operationsForm.hotels.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <Building className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No hotels assigned yet</p>
                  <button
                    onClick={addHotel}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Hotel
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Add Hotel Button */}
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={addHotel}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                      Add Hotel
                    </button>
                  </div>

                  {/* Hotels Grid - Compact Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {operationsForm.hotels.map((hotel, index) => (
                      <div key={hotel.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 relative group hover:shadow-md transition-shadow">
                        {/* Remove Button */}
                        <button
                          onClick={() => removeHotel(index)}
                          className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove hotel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                              #{index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={hotel.location_day}
                                onChange={(e) => updateHotel(index, { location_day: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium"
                                placeholder="Location/Day"
                              />
                            </div>
                          </div>

                          <input
                            type="text"
                            value={hotel.hotel_name}
                            onChange={(e) => updateHotel(index, { hotel_name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold"
                            placeholder="Hotel Name"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="tel"
                              value={hotel.hotel_phone}
                              onChange={(e) => updateHotel(index, { hotel_phone: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs"
                              placeholder="Phone"
                            />
                            <input
                              type="text"
                              value={hotel.hotel_address}
                              onChange={(e) => updateHotel(index, { hotel_address: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs"
                              placeholder="Address"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-0.5">Check-in</label>
                              <input
                                type="date"
                                value={hotel.checkin_date}
                                onChange={(e) => updateHotel(index, { checkin_date: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-0.5">Check-out</label>
                              <input
                                type="date"
                                value={hotel.checkout_date}
                                onChange={(e) => updateHotel(index, { checkout_date: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs"
                              />
                            </div>
                          </div>

                          <textarea
                            value={hotel.notes}
                            onChange={(e) => updateHotel(index, { notes: e.target.value })}
                            rows={1}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs resize-none"
                            placeholder="Notes (room type, special requests...)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Operations Status & Notes - Collapsible */}
      <div className="space-y-3">
        {/* Status Section - Collapsible */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'status' ? null : 'status')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Operations Status & Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current: {operationsForm.status.replace('_', ' ')}
                </p>
              </div>
            </div>
            {expandedSection === 'status' ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
          </button>

          {expandedSection === 'status' && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Status
                  </label>
                  <select
                    value={operationsForm.status}
                    onChange={(e) => setOperationsForm({ ...operationsForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Internal Notes
                  </label>
                  <textarea
                    value={operationsForm.notes}
                    onChange={(e) => setOperationsForm({ ...operationsForm, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="Add any internal notes, special requirements, or reminders for this booking..."
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">Operations Workflow</p>
                    <ul className="space-y-0.5 text-blue-800 dark:text-blue-200">
                      <li>• Assign guide, transport, and hotels</li>
                      <li>• Confirm status to send details to client</li>
                      <li>• Update to "In Progress" when tour starts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveOperations}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {saving ? <AlertCircle className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save All Operations'}
        </button>
      </div>

      {/* Itinerary Summary */}
      {itinerary && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Itinerary Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Guest:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{itinerary.guest_name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Destination:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{itinerary.destination || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {itinerary.start_date ? new Date(itinerary.start_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Guests:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{itinerary.num_guests || 1}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Hotels:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {operationsForm.hotels.length} {operationsForm.hotels.length === 1 ? 'Hotel' : 'Hotels'}
              </p>
            </div>
          </div>

          {/* Show quick hotel overview */}
          {operationsForm.hotels.length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Hotel Assignments:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {operationsForm.hotels.map((hotel, index) => (
                  <div key={hotel.id} className="flex items-start gap-2 text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">#{index + 1}:</span>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {hotel.location_day || 'Unspecified'} - {hotel.hotel_name || 'No hotel name'}
                      </p>
                      {(hotel.checkin_date || hotel.checkout_date) && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {hotel.checkin_date ? new Date(hotel.checkin_date).toLocaleDateString() : '?'} - {hotel.checkout_date ? new Date(hotel.checkout_date).toLocaleDateString() : '?'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
