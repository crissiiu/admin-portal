USE sales_builder_content;

CREATE TABLE IF NOT EXISTS cms_pages (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    slug VARCHAR(180) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    seo_title VARCHAR(255) NULL,
    seo_description VARCHAR(500) NULL,
    published_at DATETIME NULL,
    created_by_user_id BIGINT UNSIGNED NULL,
    updated_by_user_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_cms_pages_tenant_slug (tenant_id, slug),
    KEY idx_cms_pages_status_published (tenant_id, status, published_at),
    KEY idx_cms_pages_deleted_after (tenant_id, deleted_at, delete_after),
    KEY idx_cms_pages_created_by (created_by_user_id),
    KEY idx_cms_pages_updated_by (updated_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
