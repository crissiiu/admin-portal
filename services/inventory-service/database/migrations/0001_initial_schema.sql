USE sales_builder_inventory;

CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    product_variant_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(120) NOT NULL,
    quantity_on_hand DECIMAL(15, 2) NOT NULL DEFAULT 0,
    quantity_reserved DECIMAL(15, 2) NOT NULL DEFAULT 0,
    low_stock_threshold DECIMAL(15, 2) NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_inventory_items_variant (tenant_id, product_variant_id),
    KEY idx_inventory_items_sku (tenant_id, sku),
    KEY idx_inventory_items_status (tenant_id, status),
    KEY idx_inventory_items_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT chk_inventory_items_quantities
        CHECK (quantity_on_hand >= 0 AND quantity_reserved >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
