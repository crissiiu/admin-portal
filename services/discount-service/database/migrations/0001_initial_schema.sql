USE sales_builder_discount;

CREATE TABLE IF NOT EXISTS discount_codes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(120) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    discount_type VARCHAR(32) NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    minimum_order_amount DECIMAL(15, 2) NULL,
    usage_limit INT UNSIGNED NULL,
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    starts_at DATETIME NULL,
    ends_at DATETIME NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_discount_codes_tenant_code (tenant_id, code),
    KEY idx_discount_codes_active_window (tenant_id, status, starts_at, ends_at),
    KEY idx_discount_codes_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT chk_discount_codes_values
        CHECK (
            discount_value >= 0
            AND (minimum_order_amount IS NULL OR minimum_order_amount >= 0)
            AND used_count >= 0
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
