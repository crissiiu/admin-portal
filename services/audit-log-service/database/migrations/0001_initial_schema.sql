USE sales_builder_audit;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NULL,
    actor_id BIGINT UNSIGNED NULL,
    actor_type VARCHAR(64) NOT NULL,
    actor_role VARCHAR(64) NULL,
    action VARCHAR(160) NOT NULL,
    resource_type VARCHAR(120) NOT NULL,
    resource_id VARCHAR(120) NULL,
    request_id VARCHAR(120) NULL,
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(512) NULL,
    metadata JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_audit_logs_tenant_created (tenant_id, created_at),
    KEY idx_audit_logs_actor_created (actor_id, created_at),
    KEY idx_audit_logs_resource (resource_type, resource_id),
    KEY idx_audit_logs_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
