USE sales_builder_cart;

CREATE TABLE IF NOT EXISTS carts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    session_id VARCHAR(160) NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    subtotal_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    discount_code VARCHAR(120) NULL,
    expires_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    KEY idx_carts_customer_status (tenant_id, customer_id, status),
    KEY idx_carts_session_status (tenant_id, session_id, status),
    KEY idx_carts_updated (tenant_id, updated_at),
    KEY idx_carts_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT chk_carts_amounts
        CHECK (subtotal_amount >= 0 AND discount_amount >= 0 AND total_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    cart_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(120) NOT NULL,
    title VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255) NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL,
    line_subtotal DECIMAL(15, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_cart_items_variant (cart_id, product_variant_id),
    KEY idx_cart_items_variant (tenant_id, product_variant_id),
    KEY idx_cart_items_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts (id),
    CONSTRAINT chk_cart_items_amounts
        CHECK (unit_price >= 0 AND quantity > 0 AND line_subtotal >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
