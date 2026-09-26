-- Winhome Aluminum & Glass Architectural Engineering
-- PostgreSQL Production Database Schema
-- Compatible with PostgreSQL 14, 15, 16, 17+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. CATEGORIES TABLE (Divisions: Windows, Doors, Glass, etc.)
-- =========================================================
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  key VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  kurdish_title VARCHAR(255),
  arabic_title VARCHAR(255),
  featured_image TEXT,
  featured_title VARCHAR(255),
  featured_subtitle TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_key ON categories(key);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- =========================================================
-- 2. SUB-CATEGORIES TABLE (e.g., Thermal Break, Sliding, etc.)
-- =========================================================
CREATE TABLE IF NOT EXISTS sub_categories (
  id VARCHAR(64) PRIMARY KEY,
  category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  kurdish_title VARCHAR(255),
  arabic_title VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sub_categories_cat ON sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_sort ON sub_categories(sort_order);

-- =========================================================
-- 3. MODELS TABLE (e.g., S67, S700, M11000, SMARTIA Series)
-- =========================================================
CREATE TABLE IF NOT EXISTS models (
  id VARCHAR(64) PRIMARY KEY,
  sub_category_id VARCHAR(64) NOT NULL REFERENCES sub_categories(id) ON DELETE CASCADE,
  category_key VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  kurdish_name VARCHAR(255),
  arabic_name VARCHAR(255),
  model_code VARCHAR(100),
  description TEXT,
  image TEXT,
  badge VARCHAR(100),
  specs JSONB DEFAULT '{}'::jsonb,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_models_subcat ON models(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_models_catkey ON models(category_key);
CREATE INDEX IF NOT EXISTS idx_models_code ON models(model_code);

-- =========================================================
-- 4. PRODUCTS TABLE (Catalog Products with specs & pricing)
-- =========================================================
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  kurdish_name VARCHAR(255),
  arabic_name VARCHAR(255),
  category VARCHAR(64) NOT NULL,
  division VARCHAR(64) NOT NULL,
  sub_category VARCHAR(255),
  model_name VARCHAR(255),
  image TEXT,
  description TEXT,
  kurdish_description TEXT,
  arabic_description TEXT,
  base_price NUMERIC(12, 2) DEFAULT 0,
  selling_price NUMERIC(12, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  unit VARCHAR(50) DEFAULT 'm²',
  badge VARCHAR(100),
  rating NUMERIC(3, 2) DEFAULT 4.9,
  specs JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_division ON products(division);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_specs ON products USING gin(specs);

-- =========================================================
-- 5. USERS & ADMINS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  phone VARCHAR(100) DEFAULT '',
  company VARCHAR(255) DEFAULT '',
  city VARCHAR(100) DEFAULT 'Erbil (Hawler)',
  status VARCHAR(50) DEFAULT 'active',
  requests_count INT DEFAULT 0,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =========================================================
-- 6. QUOTATION REQUESTS (RFQs)
-- =========================================================
CREATE TABLE IF NOT EXISTS quotation_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  quoted_amount NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_requests_status ON quotation_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_user ON quotation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_customer ON quotation_requests USING gin(customer);

-- =========================================================
-- 7. FINANCES & TRANSACTIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS finances (
  id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) REFERENCES quotation_requests(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  project_title VARCHAR(255),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pending_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finances_status ON finances(status);
CREATE INDEX IF NOT EXISTS idx_finances_date ON finances(date);

-- =========================================================
-- 8. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_categories_updated_at') THEN
    CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sub_categories_updated_at') THEN
    CREATE TRIGGER trg_sub_categories_updated_at BEFORE UPDATE ON sub_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_models_updated_at') THEN
    CREATE TRIGGER trg_models_updated_at BEFORE UPDATE ON models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_products_updated_at') THEN
    CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated_at') THEN
    CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_quotation_requests_updated_at') THEN
    CREATE TRIGGER trg_quotation_requests_updated_at BEFORE UPDATE ON quotation_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_finances_updated_at') THEN
    CREATE TRIGGER trg_finances_updated_at BEFORE UPDATE ON finances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
