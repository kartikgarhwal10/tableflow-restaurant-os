-- TABLEFLOW OS PRODUCTION SEED SCRIPT
-- Seeds The Copper Table (Jaipur), dining tables, staff profiles, menu, and initial inventory

-- 1. Restaurant & Outlet
INSERT INTO restaurants (id, name, slug, tagline, currency, currency_symbol, gst_number, fssai_number)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'The Copper Table',
    'the-copper-table',
    'Contemporary Indian Dining & Royal Rajasthani Gastronomy',
    'INR',
    '₹',
    '08AAACT9821R1Z3',
    '12224026000189'
);

INSERT INTO outlets (id, restaurant_id, name, address, city, state, pincode, phone, email, opening_hours)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'The Copper Table - C-Scheme Flagship',
    '14, Royal Haveli Lane, C-Scheme',
    'Jaipur',
    'Rajasthan',
    '302001',
    '+91 141 238 9900',
    'concierge@thecoppertable.in',
    '12:00 PM – 11:30 PM (Daily)'
);

-- 2. Staff Profiles
INSERT INTO profiles (id, outlet_id, role, full_name, email, phone, pin, shift_details)
VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'owner', 'Aditi Singhal', 'aditi@thecoppertable.in', '+91 98290 11223', '1001', 'General Oversight'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'manager', 'Rajesh Sharma', 'rajesh@thecoppertable.in', '+91 98290 22334', '2001', 'Afternoon/Evening Manager'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'kitchen', 'Chef Vikram Singh Rathore', 'chef.vikram@thecoppertable.in', '+91 98290 33445', '3001', 'Executive Head Chef'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'kitchen', 'Sunita Meena', 'sunita@thecoppertable.in', '+91 98290 44556', '3002', 'Sous Chef Evening'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'waiter', 'Ravi Kumar', 'ravi@thecoppertable.in', '+91 98290 55667', '4001', 'Courtyard & Indoor Tables'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'waiter', 'Pooja Verma', 'pooja@thecoppertable.in', '+91 98290 66778', '4002', 'Terrace Tables'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'waiter', 'Amit Joshi', 'amit@thecoppertable.in', '+91 98290 77889', '4003', 'Floor Runner'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'waiter', 'Meera Chouhan', 'meera@thecoppertable.in', '+91 98290 88990', '5001', 'Front Desk & Billing Hostess');

-- 3. Tables (12 Dining Tables)
INSERT INTO tables (outlet_id, table_number, name, section, capacity, status)
VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-01', 'Courtyard Fountain 1', 'courtyard', 4, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-02', 'Courtyard Fountain 2', 'courtyard', 2, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-03', 'Courtyard Archway 3', 'courtyard', 4, 'seated'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-04', 'Courtyard Canopy 4', 'courtyard', 6, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-05', 'Jharokha Alcove 5', 'indoor', 4, 'bill_requested'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-06', 'Jharokha Central 6', 'indoor', 2, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-07', 'Royal PDR Hall 7', 'indoor', 8, 'reserved'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-08', 'Jharokha Corner 8', 'indoor', 4, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-09', 'Terrace Pavilion 9', 'terrace', 2, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-10', 'Terrace Garden 10', 'terrace', 4, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-11', 'Terrace Royal 11', 'terrace', 6, 'available'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'T-12', 'Terrace Star 12', 'terrace', 4, 'cleaning');
