CREATE DATABASE SHMOT_SHOP;

--123123
CREATE ROLE shop_user WITH LOGIN PASSWORD 'M95vt[~*{_HyAEw,$(7V!G';

\connect shmot_shop;

-- Каталоги
CREATE TABLE catalogs (
    id UUID PRIMARY KEY,                -- Уникальный идентификатор каталога
    catalog_name VARCHAR(255) NOT NULL,  -- Название каталога,
    add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE catalogs ADD column add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Продукты
CREATE TABLE products (
    id UUID PRIMARY KEY,                -- Уникальный идентификатор продукта
    catalog_id UUID REFERENCES catalogs(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,         -- Название продукта
    description TEXT,                   -- Описание продукта
    price DECIMAL(10, 2) NOT NULL,       -- Цена продукта
    add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
);
ALTER TABLE products ADD column add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Статусы заказов
CREATE TABLE statuses (
    id UUID PRIMARY KEY,                -- Уникальный идентификатор статуса
    status_name VARCHAR(50) NOT NULL    -- Название статуса, например, "Pending", "Shipped"
);

-- Заказы
CREATE TABLE orders (
    id UUID NOT NULL UNIQUE,                -- Уникальный идентификатор заказа
    order_number UUID PRIMARY KEY, 
    user_fio VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,      -- Общая цена заказа
    status_id UUID REFERENCES statuses(id) ON DELETE SET NULL,  -- Ссылка на статус заказа
    add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE orders ADD column add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Таблица размеров продуктов
CREATE TABLE sizes (
    id UUID PRIMARY KEY,                 -- Уникальный идентификатор размера
    product_id UUID REFERENCES products(id) ON DELETE CASCADE, -- Продукт, к которому относится размер
    size_symb VARCHAR(10) NOT NULL,      -- Обозначение размера, например, "S", "M", "L"
    is_active BOOLEAN DEFAULT FALSE      -- Флаг активности размера
);

-- Элементы заказа
CREATE TABLE order_items (
    order_number UUID REFERENCES orders(order_number) ON DELETE CASCADE,     -- Ссылка на заказ
    product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Ссылка на продукт
    size_id UUID REFERENCES sizes(id) ON DELETE SET NULL,      -- Ссылка на размер
    count INT NOT NULL DEFAULT 1,
    PRIMARY KEY (order_number, product_id, size_id)                -- Уникальная комбинация заказа, продукта и размера
);

CREATE TABLE images (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    path VARCHAR(255)
);

-- Админы
CREATE TABLE admins (
    id UUID PRIMARY KEY,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);


GRANT USAGE ON SCHEMA public TO shop_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO shop_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO shop_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO shop_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO shop_user;