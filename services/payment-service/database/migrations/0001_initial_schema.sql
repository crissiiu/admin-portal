USE sales_builder_payment;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    provider VARCHAR(64) NOT NULL,
    method VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    amount DECIMAL(15, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    provider_transaction_id VARCHAR(255) NULL,
    paid_at DATETIME NULL,
    failed_at DATETIME NULL,
    metadata JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_payments_order (tenant_id, order_id),
    KEY idx_payments_status_created (tenant_id, status, created_at),
    KEY idx_payments_provider_transaction (provider_transaction_id),
    CONSTRAINT chk_payments_amount
        CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
