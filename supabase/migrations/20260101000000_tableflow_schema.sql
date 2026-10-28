-- TABLEFLOW OS PRODUCTION DATABASE SCHEMA MIGRATION
-- Compatible with PostgreSQL 15+ & Supabase
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Restaurants & Outlets (Multi-Tenant & Outlet Scoping)
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tagline TEXT,
    currency VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(10) DEFAULT '₹',
    gst_number VARCHAR(50),
    fssai_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE outlets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    opening_hours TEXT,
    cgst_percent NUMERIC(5,2) DEFAULT 2.50,
    sgst_percent NUMERIC(5,2) DEFAULT 2.50,
    packaging_charge NUMERIC(10,2) DEFAULT 30.00,
    delivery_fee NUMERIC(10,2) DEFAULT 50.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles & Role-Based Access Control
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'waiter', 'kitchen', 'customer');

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE, -- References auth.users if Supabase Auth is enabled
    outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'customer',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    pin VARCHAR(10),
    shift_details TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tables & Dining Sections
CREATE TYPE table_status AS ENUM ('available', 'reserved', 'seated', 'bill_requested', 'cleaning');
CREATE TYPE dining_section AS ENUM ('courtyard', 'indoor', 'terrace');

CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    section dining_section NOT NULL DEFAULT 'indoor',
    capacity INT NOT NULL DEFAULT 4,
    status table_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (outlet_id, table_number)
);

-- 4. Menu Categories, Items, Variants & Add-ons
CREATE TYPE kitchen_station AS ENUM ('all', 'tandoor', 'curry', 'breads', 'desserts', 'bar');

CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100),
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (outlet_id, slug)
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    is_jain_available BOOLEAN DEFAULT FALSE,
    spice_level INT DEFAULT 1,
    is_special BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    allergens TEXT[] DEFAULT '{}',
    preparation_time_minutes INT DEFAULT 15,
    station kitchen_station NOT NULL DEFAULT 'curry',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE item_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_delta NUMERIC(10,2) DEFAULT 0.00
);

CREATE TABLE add_ons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

-- 5. Suppliers, Inventory Items, Recipes & Stock Movements
CREATE TYPE inventory_category AS ENUM ('dairy', 'meat', 'spices', 'vegetables', 'grains', 'dry_goods', 'beverages');

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    categories inventory_category[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category inventory_category NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'L', 'g', 'pcs'
    current_stock NUMERIC(12,3) NOT NULL DEFAULT 0.000,
    min_threshold NUMERIC(12,3) NOT NULL DEFAULT 0.000,
    unit_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    last_restocked TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    quantity NUMERIC(12,3) NOT NULL, -- Quantity per serving in ingredient's base unit
    unit VARCHAR(20) NOT NULL,
    UNIQUE (menu_item_id, ingredient_id)
);

CREATE TYPE stock_movement_type AS ENUM ('order_consumption', 'purchase_receipt', 'wastage', 'manual_adjustment');

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    type stock_movement_type NOT NULL,
    quantity NUMERIC(12,3) NOT NULL, -- Negative for consumption/wastage, Positive for purchases
    unit VARCHAR(20) NOT NULL,
    order_id UUID,
    reason TEXT NOT NULL,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reservations
CREATE TYPE reservation_status AS ENUM ('confirmed', 'seated', 'completed', 'cancelled');

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    reservation_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    guest_count INT NOT NULL DEFAULT 2,
    section dining_section NOT NULL DEFAULT 'courtyard',
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    occasion VARCHAR(100),
    special_requests TEXT,
    status reservation_status NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders & Order Items
CREATE TYPE order_type AS ENUM ('dine_in', 'takeaway', 'delivery');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'preparing', 'ready', 'served', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'pending', 'paid', 'partially_refunded', 'refunded', 'failed');
CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'card', 'simulated_card');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type order_type NOT NULL,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    table_number VARCHAR(20),
    guest_count INT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address TEXT,
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    payment_method payment_method,
    payment_reference VARCHAR(100),
    subtotal NUMERIC(10,2) NOT NULL,
    cgst NUMERIC(10,2) NOT NULL,
    sgst NUMERIC(10,2) NOT NULL,
    packaging_charge NUMERIC(10,2) DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    total NUMERIC(10,2) NOT NULL,
    special_notes TEXT,
    estimated_ready_minutes INT DEFAULT 20,
    served_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items with Historical Price Snapshots
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    price_snapshot NUMERIC(10,2) NOT NULL, -- Preserves historical price regardless of future menu edits
    quantity INT NOT NULL DEFAULT 1,
    selected_variant_name VARCHAR(100),
    selected_addons_json JSONB DEFAULT '[]',
    special_instructions TEXT,
    station kitchen_station NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    note TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Expenses, Staff Shifts, Notifications & Audit Logs
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'paid',
    receipt_number VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE staff_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    shift_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE app_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_role VARCHAR(50) DEFAULT 'all',
    read BOOLEAN DEFAULT FALSE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    actor_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_orders_outlet_status ON orders(outlet_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_reservations_date ON reservations(reservation_date, time_slot);
CREATE INDEX idx_inventory_current_stock ON inventory_items(current_stock, min_threshold);
CREATE INDEX idx_stock_movements_ingredient ON stock_movements(ingredient_id);
