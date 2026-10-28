# TABLEFLOW OS &bull; THE COPPER TABLE (JAIPUR)
### Complete Restaurant Website, Online Ordering & Restaurant Management Platform (ERP)

TableFlow OS is a full-stack, multi-role restaurant management and hospitality technology platform built for **The Copper Table** in C-Scheme, Jaipur, Rajasthan.

The platform unifies **five connected experiences** into a single real-time digital system:
1. **Public Restaurant Website**: Editorial hospitality, royal Rajasthani heritage, culinary philosophy, ambiance showcases, and demo guest impressions.
2. **Customer Online Ordering & Reservation Portal**: Multi-channel fulfillment (Dine-in, Takeaway, Delivery), table conflict prevention within 90-minute intervals, server-validated GST (CGST 2.5% + SGST 2.5%), coupons (`JAIPUR15`, `ROYAL200`, `COPPERFEST`), and live 5-step order tracking with tax invoice generation.
3. **Waiter & Floor Staff Portal**: Mobile-first floor map, real-time table occupancy, quick table ordering POS modal, ready-to-serve alert queue, and billing desk.
4. **Kitchen Display System (KDS)**: Touch-optimized high-contrast pass with live preparation timers, overdue ticket indicators, item-level readiness checklist, and recipe-based stock deduction.
5. **Restaurant Owner Admin Dashboard (ERP)**: Real-time financial cockpit (Gross/Net sales, Paid revenue, Unpaid balances, AOV, Sales trends), live POS terminal, recipe inventory control, wastage logging, shift scheduling, guest CRM, and audited P&L reporting with CSV export.

---

## 1. Design Direction & Color Palette

- **Warm Ivory**: `#F6F2EA` (Public and guest background)
- **Charcoal**: `#242822` (Editorial typography, headers, and footer)
- **Deep Oxblood**: `#6F292B` (Brand primary accent, actions, buttons)
- **Muted Brass**: `#B89B72` (Accents, badges, sub-labels)
- **Stone**: `#E5E0D7` (Subtle borders, dividers)
- **Typography**: Display serif (*Cormorant Garamond* / *DM Serif Display*) paired with high-legibility sans-serif (*Inter*).

---

## 2. Sample Business Profile

- **Restaurant Name**: The Copper Table
- **Location**: 14, Royal Haveli Lane, C-Scheme, Jaipur, Rajasthan 302001
- **Cuisine**: Contemporary Indian Dining & Progressive Rajputana Gastronomy
- **Currency**: INR (₹)
- **GSTIN**: `08AAACT9821R1Z3` (5% Restaurant GST: 2.5% CGST + 2.5% SGST)
- **FSSAI License**: `12224026000189`
- **Hours**: 12:00 PM – 11:30 PM (Daily)
- **Phone**: +91 141 238 9900
- **Email**: `concierge@thecoppertable.in`

---

## 3. Five Connected Experiences & Role Switcher

A global **Role Switcher** banner is pinned at the top of every screen to let reviewers and evaluators seamlessly transition between roles:

| Role | Primary Route | Description |
|---|---|---|
| **Visitor / Customer** | `/` | Explore menu, book tables, order food, track status |
| **Floor Waiter (Ravi Kumar)** | `/staff/floor` | Interactive table map, quick order punch, ready-to-serve queue |
| **Kitchen KDS (Chef Vikram)** | `/kitchen/orders` | Touch bump bar, station routing, prep timers, stock deduction |
| **Owner / Admin (Aditi Singhal)** | `/admin` | Executive dashboard, POS, recipe inventory, P&L, audit logs |

---

## 4. Application Routes

### Public Website & Customer Portal
- `/` &bull; Restaurant home, story, signature dishes, ambiance spaces
- `/menu` &bull; Complete menu with search, course categories, veg/non-veg/Jain filters
- `/menu/[category]` &bull; Category-filtered view
- `/item/[id]` &bull; Deep-dive dish page with recipe ingredient consumption breakdown & allergens
- `/cart` &bull; Order basket, fulfillment selector (Dine-in, Takeaway, Delivery), coupon validation
- `/checkout` &bull; Guest details, simulated payment (UPI, Card, Cash at table), order submission
- `/order/[id]` &bull; Live 5-step order tracking stepper, itemized bill, printable tax invoice
- `/reservations` &bull; Table booking with capacity check & 90-min conflict prevention, reservation lookup
- `/account`, `/account/orders`, `/account/reservations` &bull; Guest profile and history
- `/about`, `/gallery`, `/contact`, `/policies` &bull; Heritage, photography, location, and FSSAI policies

### Waiter & Floor Staff Portal
- `/staff/floor` &bull; Interactive visual floor plan with table statuses (Available, Reserved, Seated, Bill Requested, Cleaning)
- `/staff/orders` &bull; Active service queue with "Mark Served at Table" button
- `/staff/orders/[id]` &bull; Order line items and tax invoice preview
- `/staff/reservations` &bull; Today's reservation sheet with "Seat at Table" action
- `/staff/billing` &bull; Billing desk with Cash, UPI, and Card tender options
- `/staff/notifications` &bull; Real-time alerts for kitchen ready tickets and bill calls

### Kitchen Display System (KDS)
- `/kitchen/orders` &bull; Master KDS screen with priority queue and elapsed timers
- `/kitchen/stations/[id]` &bull; Dedicated station screens:
  - `tandoor` &bull; Tandoor & Sigri Charcoal Station
  - `curry` &bull; Royal Handis & Slow Simmer Station
  - `breads` &bull; Artisanal Breads & Dum Pulao Station
  - `desserts` &bull; Heritage Halwai & Confections Station
  - `bar` &bull; Botanical Elixirs & Chaas Bar

### Owner / Admin Dashboard (ERP)
- `/admin` &bull; Executive KPIs (Gross/Net sales, Paid revenue, Unpaid balances, AOV, Table occupancy, Low-stock alerts)
- `/admin/pos` &bull; Full POS counter terminal with category touch grid and split payment
- `/admin/orders` &bull; Master order ledger with channel/status filters and invoice printing
- `/admin/reservations` &bull; Master reservation ledger
- `/admin/tables` &bull; Floor table layout and capacity management
- `/admin/menu` &bull; Menu price editor (preserves historical bill snapshots) & recipe formulations
- `/admin/inventory` &bull; Recipe-based ingredient stock, valuation, manual adjustments, wastage logging
- `/admin/suppliers` &bull; Vendor directory with contact persons and categories
- `/admin/customers` &bull; Guest CRM with visit counts and lifetime spend
- `/admin/staff` &bull; Staff directory with role permissions and security PINs
- `/admin/shifts` &bull; Shift scheduling and roster
- `/admin/expenses` &bull; Operating expense ledger (ingredients, payroll, utilities)
- `/admin/reports` &bull; Audited P&L statement (Net Sales - COGS - Expenses) & CSV export
- `/admin/marketing` &bull; Promotional coupons and discount rules
- `/admin/settings` &bull; Restaurant configuration, GSTIN, FSSAI, hours, and taxes
- `/admin/audit-logs` &bull; Immutable operational event audit trail

---

## 5. End-to-End Operational Lifecycle

```
[Customer / Guest]
  1. Add Bhatti Paneer Tikka & Dal Makhani to Cart
  2. Select Dine-In Table T-01 & apply coupon JAIPUR15
  3. Submit Order -> Order #CT-1046 created & Table T-01 marked 'seated'
       │
       ▼ (BroadcastChannel / Realtime sync)
[Kitchen KDS (Chef Vikram)]
  4. Ticket #CT-1046 appears with timer
  5. Chef taps "Start Cooking" -> Status: 'preparing'
       │──> Automatically calculates recipe consumption:
       │    - 180g Malai Paneer deducted
       │    - 160g Black Urad deducted
       │    - Stock movement logged; low stock alert triggered if threshold crossed
  6. Chef checks off items and taps "Mark Ready (Bump Pass)" -> Status: 'ready'
       │
       ▼ (Realtime notification)
[Waiter Portal (Ravi Kumar)]
  7. Alert: "Order #CT-1046 is READY to serve!"
  8. Waiter brings dishes to Table T-01 and clicks "Mark as Served" -> Status: 'served'
  9. Guest asks for bill -> Waiter taps "Request Bill" -> Table marked 'bill_requested'
       │
       ▼
[Billing Desk / Cashier]
  10. Waiter settles ₹2,136.76 via UPI / Card / Cash
  11. Order completed, Table T-01 freed to 'cleaning'
  12. Itemized GST Tax Invoice printed
       │
       ▼
[Owner Admin Dashboard (Aditi Singhal)]
  13. Paid revenue, net sales, and AOV updated instantly in executive charts
  14. P&L report reflects updated revenue and inventory cost
  15. Audit log records complete chronological trail
```

---

## 6. Database Migrations & Supabase Setup

The repository includes complete production SQL files in `supabase/`:
- `supabase/migrations/20260101000000_tableflow_schema.sql`: Full normalized PostgreSQL schema with UUIDs, foreign keys, constraints, and indexes.
- `supabase/seed.sql`: Initial seed data for The Copper Table.

### Running with Supabase:
```bash
supabase db push
# or run the SQL script directly in Supabase SQL Editor
```

---

## 7. Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Build production bundle (39 static + 5 dynamic routes)
npm run build

# 3. Start development server
npm run dev -p 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
