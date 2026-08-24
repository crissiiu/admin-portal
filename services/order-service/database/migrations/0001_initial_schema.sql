USE sales_builder_order;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    order_number VARCHAR(64) NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    cart_id BIGINT UNSIGNED NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    fulfillment_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    subtotal_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    discount_code VARCHAR(120) NULL,
    customer_email VARCHAR(255) NULL,
    customer_phone VARCHAR(32) NULL,
    shipping_address_snapshot JSON NOT NULL,
    placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_orders_tenant_number (tenant_id, order_number),
    KEY idx_orders_customer_created (tenant_id, customer_id, created_at),
    KEY idx_orders_status_created (tenant_id, status, created_at),
    KEY idx_orders_deleted (tenant_id, deleted_at),
    CONSTRAINT chk_orders_amounts
        CHECK (
            subtotal_amount >= 0
            AND discount_amount >= 0
            AND shipping_amount >= 0
            AND tax_amount >= 0
            AND total_amount >= 0
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NULL,
    product_variant_id BIGINT UNSIGNED NULL,
    sku VARCHAR(120) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255) NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL,
    line_subtotal DECIMAL(15, 2) NOT NULL,
    line_discount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_order_items_order (order_id),
    KEY idx_order_items_variant (tenant_id, product_variant_id),
    KEY idx_order_items_sku (tenant_id, sku),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT chk_order_items_amounts
        CHECK (
            unit_price >= 0
            AND quantity > 0
            AND line_subtotal >= 0
            AND line_discount >= 0
            AND line_total >= 0
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
