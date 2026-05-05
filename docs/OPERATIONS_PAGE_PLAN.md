# Operations Page - Complete Analysis & Implementation Plan

## 📊 CURRENT STATE ANALYSIS

### Existing Structure
- **Location**: `/admin/bookings` (labeled as "Operations")
- **Database Table**: `bookings`
- **Current Fields**:
  - `guide_details` (TEXT) - Basic guide info
  - `car_details` (TEXT) - Driver/car info
  - `hotel_details` (TEXT) - Hotel bookings
  - `hotel_confirmations` (JSONB) - Confirmation status
  - `visa_pdf_url`, `money_receipt_url` - Document URLs

### Problems Identified
1. **No structured assignments** - All in text fields
2. **Missing passport tracking** - No per-guest passport data
3. **Missing permit tracking** - No e-permit application status
4. **No assignment workflow** - Can't track assignment stages
5. **Limited document management** - Only visa and receipt URLs

## 🎯 USER REQUIREMENTS

### Core Workflow
```
Invoice Confirmed → Operations Page → Assign Resources → Track Status → Complete
```

### Required Assignments
1. **Guides** - Contact, license, experience, availability
2. **Drivers** - Vehicle type, driver details, routes
3. **Hotels** - Booking confirmations, room types, check-in/out
4. **Passports** - Guest passport details, scans, expiry tracking
5. **E-Permits** - Application status, permit types, deadlines

## 🏗️ PROPOSED SOLUTION

### Phase 1: Database Schema Enhancement

```sql
-- New tables for structured operations data

-- Guide assignments
CREATE TABLE operation_guide_assignments (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  guide_name TEXT NOT NULL,
  guide_phone TEXT,
  guide_email TEXT,
  guide_license TEXT,
  assignment_status TEXT DEFAULT 'pending', -- pending, assigned, confirmed
  assigned_date TIMESTAMPTZ,
  notes TEXT
);

-- Driver/Car assignments
CREATE TABLE operation_transport_assignments (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  driver_name TEXT NOT NULL,
  driver_phone TEXT,
  vehicle_type TEXT,
  vehicle_number TEXT,
  assignment_status TEXT DEFAULT 'pending',
  assigned_date TIMESTAMPTZ,
  route_details TEXT,
  notes TEXT
);

-- Hotel assignments
CREATE TABLE operation_hotel_assignments (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  hotel_name TEXT NOT NULL,
  location TEXT,
  check_in_date DATE,
  check_out_date DATE,
  room_type TEXT,
  number_of_rooms INTEGER,
  confirmation_number TEXT,
  status TEXT DEFAULT 'pending', -- pending, booked, confirmed
  booking_proof_url TEXT,
  assigned_date TIMESTAMPTZ
);

-- Guest passport tracking
CREATE TABLE operation_guest_passports (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  guest_name TEXT NOT NULL,
  passport_number TEXT,
  passport_expiry DATE,
  passport_scan_url TEXT,
  nationality TEXT,
  date_of_birth DATE,
  status TEXT DEFAULT 'not_received', -- not_received, received, verified, submitted
  received_date TIMESTAMPTZ
);

-- Permit tracking
CREATE TABLE operation_permits (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  permit_type TEXT NOT NULL, -- entry_permit, trekking_permit, special_area_permit
  guest_name TEXT,
  application_date DATE,
  status TEXT DEFAULT 'not_applied', -- not_applied, applied, approved, rejected, issued
  permit_number TEXT,
  permit_url TEXT,
  issue_date DATE,
  expiry_date DATE,
  notes TEXT
);
```

### Phase 2: UI Components Structure

#### 1. Operations Dashboard (`/admin/operations`)
- Overview cards (pending assignments, upcoming departures)
- Filterable list of confirmed bookings
- Quick action buttons
- Status indicators

#### 2. Operations Detail Page (`/admin/operations/[id]`)
```
┌─────────────────────────────────────────────────┐
│ Guest: Sharma Family | Status: Confirmed        │
│ Travel: 15 Jun 2025 | 6 pax | $12,000          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📋 ASSIGNMENTS                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ 👨‍💼 GUIDE ASSIGNMENT                          │
│ [Select Guide Dropdown]                        │
│ Kinley Dorji (License: BH-12345)              │
│ Status: ✅ Confirmed                           │
│ Notes: Experienced in cultural tours           │
│ [View Details] [Update]                        │
│                                                 │
│ 🚗 TRANSPORT ASSIGNMENT                        │
│ [Select Driver Dropdown]                       │
│ Driver: Tshering Wangchuk                      │
│ Vehicle: Toyota Prado (BP-1-1234)             │
│ Status: ⏳ Pending Confirmation               │
│ Route: Paro → Thimphu → Punakha                │
│ [View Details] [Update]                        │
│                                                 │
│ 🏨 HOTEL ASSIGNMENTS                          │
│ + Add Hotel                                    │
│ ┌──────────────────────────────────┐          │
│ │ Hotel A (Thimphu)                │          │
│ │ 15-17 Jun | 3 Rooms Deluxe      │          │
│ │ Status: ✅ Confirmed            │          │
│ │ [Upload Confirmation] [Edit]    │          │
│ └──────────────────────────────────┘          │
│                                                 │
│ 🛂 PASSPORT TRACKING                          │
│ + Add Guest                                    │
│ ┌──────────────────────────────────┐          │
│ │ Guest 1: Raj Sharma              │          │
│ │ Passport: XXXXXXXX | Exp: 2027   │          │
│ │ Status: ✅ Verified             │          │
│ │ [View Scan] [Edit]              │          │
│ └──────────────────────────────────┘          │
│                                                 │
│ 📜 PERMIT TRACKING                            │
│ + Add Permit                                   │
│ ┌──────────────────────────────────┐          │
│ │ Entry Permit - All Guests        │          │
│ │ Applied: 1 Jun 2025              │          │
│ │ Status: ⏳ Under Review         │          │
│ │ [Update Status] [View Document]  │          │
│ └──────────────────────────────────┘          │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3. Status Flow

**Guide Assignment**
```
Not Started → Guide Assigned → Guide Confirmed → Trip Started → Completed
```

**Transport Assignment**
```
Not Started → Driver Assigned → Vehicle Confirmed → Trip Started → Completed
```

**Hotel Assignment**
```
Not Started → Booking Initiated → Booking Confirmed → Checked In → Checked Out
```

**Passport Tracking**
```
Not Received → Document Received → Verified → Submitted for Permit → Returned
```

**Permit Application**
```
Not Applied → Applied → Under Review → Approved → Issued → Expired
```

### Phase 3: Key Features

#### 1. Assignment Modal Components
- **Guide Selector** - Dropdown with availability check
- **Driver Selector** - Dropdown with vehicle details
- **Hotel Booking Form** - Date picker, room types, confirmation upload
- **Guest Passport Form** - Scanner integration, expiry alerts
- **Permit Application Form** - Permit type, document uploads, deadline tracking

#### 2. Status Tracking
- Color-coded status indicators
- Automatic deadline reminders
- Progress percentage per booking
- Activity timeline

#### 3. Document Management
- Upload interface for:
  - Passport scans
  - Permit documents
  - Hotel confirmations
  - Guide licenses
  - Vehicle permits
- Version tracking
- Expiry alerts

#### 4. Communication & Tasks
- Task checklist per booking
- Vendor contact directory
- Email templates for confirmations
- Reminder scheduling

### Phase 4: Reporting

#### Operations Dashboard Metrics
- **Upcoming Departures** (next 7 days)
- **Pending Assignments** (count by type)
- **Expiring Documents** (passports, permits)
- **Utilization** (guide, driver, vehicle usage)
- **Completion Rate**

## 🚀 IMPLEMENTATION PLAN

### Step 1: Database Schema (Already started)
- [x] Create operation assignment tables
- [ ] Add RLS policies
- [ ] Create indexes
- [ ] Migrate existing data

### Step 2: Basic CRUD Operations
- [ ] API routes for assignments
- [ ] Forms for data entry
- [ ] Validation logic
- [ ] Error handling

### Step 3: UI Components
- [ ] Operations dashboard
- [ ] Assignment modals
- [ ] Status indicators
- [ ] Document upload

### Step 4: Advanced Features
- [ ] Automated reminders
- [ ] Reporting dashboard
- [ ] Vendor directory
- [ ] Communication tools

## 📋 ACCEPTANCE CRITERIA

1. **User can** view all confirmed bookings in operations dashboard
2. **User can** assign guides with full details
3. **User can** assign drivers with vehicle details
4. **User can** manage hotel bookings with confirmations
5. **User can** track passport details for each guest
6. **User can** track permit applications with status
7. **User can** upload and manage documents
8. **User can** see overall assignment status at a glance
9. **User gets** alerts for expiring documents
10. **User can** generate operations reports

## 🎨 UI/UX CONSIDERATIONS

- **Color Coding**: Green (complete), Yellow (pending), Red (overdue)
- **Progress Indicators**: Visual completion percentage
- **Quick Actions**: One-click assignment for common scenarios
- **Mobile Friendly**: Responsive design for field use
- **Fast Loading**: Optimized queries and pagination
- **Clear Hierarchy**: Important info prominently displayed

## 🔐 SECURITY & PERMISSIONS

- **Admin Access**: Full operations management
- **Operations Manager**: Assign resources, update status
- **View Only**: Read access to assignments
- **Vendor Portal**: External access for guides/drivers (future)
