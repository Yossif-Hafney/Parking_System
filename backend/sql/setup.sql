-- =============================================
-- Parking Car System - PostgreSQL Setup Script
-- =============================================

-- 1. Create the database (run this first as postgres superuser)
-- CREATE DATABASE parking_db;

-- 2. Connect to parking_db and run the following:

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(50),
    type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create parking slots table
CREATE TABLE IF NOT EXISTS parking_slots (
    id SERIAL PRIMARY KEY,
    slot_number INT UNIQUE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
    start_time TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create parking history table
CREATE TABLE IF NOT EXISTS parking_history (
    id SERIAL PRIMARY KEY,
    slot_number INT NOT NULL,
    plate_number VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(10) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    fee DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initialize 20 parking slots
INSERT INTO parking_slots (slot_number, is_available)
SELECT generate_series(1, 20), TRUE
ON CONFLICT (slot_number) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_slots_available ON parking_slots(is_available);
CREATE INDEX IF NOT EXISTS idx_history_plate ON parking_history(plate_number);
CREATE INDEX IF NOT EXISTS idx_history_date ON parking_history(created_at);

-- Verify setup
SELECT 'Vehicles table' as table_name, COUNT(*) as count FROM vehicles
UNION ALL
SELECT 'Parking slots', COUNT(*) FROM parking_slots
UNION ALL
SELECT 'History records', COUNT(*) FROM parking_history;
