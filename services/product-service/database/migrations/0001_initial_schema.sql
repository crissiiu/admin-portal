USE sales_builder_product;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    description TEXT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    image_url VARCHAR(2048) NULL,
    metadata JSON NULL,
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_products_tenant_slug (tenant_id, slug),
    KEY idx_products_title (title),
    KEY idx_products_category (tenant_id, category_id),
    KEY idx_products_status_created (tenant_id, status, created_at),
    KEY idx_products_deleted_after (tenant_id, deleted_at, delete_after)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_variants (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(120) NOT NULL,
    title VARCHAR(255) NULL,
    price DECIMAL(15, 2) NOT NULL,
    compare_at_price DECIMAL(15, 2) NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    options JSON NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_product_variants_tenant_sku (tenant_id, sku),
    KEY idx_product_variants_product (tenant_id, product_id),
    KEY idx_product_variants_status (tenant_id, status),
    KEY idx_product_variants_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT fk_product_variants_product
        FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
