USE sales_builder_catalog;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    description TEXT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_tenant_slug (tenant_id, slug),
    KEY idx_categories_parent (tenant_id, parent_id),
    KEY idx_categories_status_sort (tenant_id, status, sort_order),
    KEY idx_categories_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_id) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS collections (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    description TEXT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_collections_tenant_slug (tenant_id, slug),
    KEY idx_collections_status_sort (tenant_id, status, sort_order),
    KEY idx_collections_deleted_after (tenant_id, deleted_at, delete_after)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS collection_products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    collection_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    removed_at DATETIME NULL,
    removed_by_user_id BIGINT UNSIGNED NULL,
    remove_reason VARCHAR(255) NULL,
    active_placement_key TINYINT
        GENERATED ALWAYS AS (CASE WHEN removed_at IS NULL THEN 1 ELSE NULL END) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_collection_products_active (collection_id, product_id, active_placement_key),
    KEY idx_collection_products_product (tenant_id, product_id),
    KEY idx_collection_products_sort (collection_id, sort_order),
    KEY idx_collection_products_removed (tenant_id, removed_at),
    CONSTRAINT fk_collection_products_collection
        FOREIGN KEY (collection_id) REFERENCES collections (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
