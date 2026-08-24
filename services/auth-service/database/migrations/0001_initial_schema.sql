USE sales_builder_auth;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    email_verified_at DATETIME NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NULL,
    phone VARCHAR(32) NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_status (status),
    KEY idx_users_deleted_after (deleted_at, delete_after),
    KEY idx_users_deleted_by (deleted_by_user_id),
    CONSTRAINT fk_users_deleted_by
        FOREIGN KEY (deleted_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS platform_user_roles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    role VARCHAR(64) NOT NULL,
    assigned_by_user_id BIGINT UNSIGNED NULL,
    revoked_at DATETIME NULL,
    revoked_by_user_id BIGINT UNSIGNED NULL,
    active_role_key TINYINT
        GENERATED ALWAYS AS (CASE WHEN revoked_at IS NULL THEN 1 ELSE NULL END) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_platform_user_roles_active (user_id, role, active_role_key),
    KEY idx_platform_user_roles_role (role),
    KEY idx_platform_user_roles_assigned_by (assigned_by_user_id),
    KEY idx_platform_user_roles_revoked_by (revoked_by_user_id),
    CONSTRAINT fk_platform_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_platform_user_roles_assigned_by
        FOREIGN KEY (assigned_by_user_id) REFERENCES users (id),
    CONSTRAINT fk_platform_user_roles_revoked_by
        FOREIGN KEY (revoked_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tenants (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(160) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    owner_user_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tenants_slug (slug),
    KEY idx_tenants_status (status),
    KEY idx_tenants_owner (owner_user_id),
    KEY idx_tenants_deleted_after (deleted_at, delete_after),
    CONSTRAINT fk_tenants_owner
        FOREIGN KEY (owner_user_id) REFERENCES users (id),
    CONSTRAINT fk_tenants_deleted_by
        FOREIGN KEY (deleted_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tenant_memberships (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    invited_by_user_id BIGINT UNSIGNED NULL,
    joined_at DATETIME NULL,
    removed_at DATETIME NULL,
    removed_by_user_id BIGINT UNSIGNED NULL,
    remove_reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tenant_memberships_tenant_user (tenant_id, user_id),
    KEY idx_tenant_memberships_tenant_status (tenant_id, status),
    KEY idx_tenant_memberships_user (user_id),
    KEY idx_tenant_memberships_removed (tenant_id, removed_at),
    CONSTRAINT fk_tenant_memberships_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_tenant_memberships_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_tenant_memberships_invited_by
        FOREIGN KEY (invited_by_user_id) REFERENCES users (id),
    CONSTRAINT fk_tenant_memberships_removed_by
        FOREIGN KEY (removed_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tenant_member_roles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    membership_id BIGINT UNSIGNED NOT NULL,
    role VARCHAR(64) NOT NULL,
    assigned_by_user_id BIGINT UNSIGNED NULL,
    revoked_at DATETIME NULL,
    revoked_by_user_id BIGINT UNSIGNED NULL,
    active_role_key TINYINT
        GENERATED ALWAYS AS (CASE WHEN revoked_at IS NULL THEN 1 ELSE NULL END) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tenant_member_roles_active (membership_id, role, active_role_key),
    KEY idx_tenant_member_roles_tenant_role (tenant_id, role),
    KEY idx_tenant_member_roles_assigned_by (assigned_by_user_id),
    KEY idx_tenant_member_roles_revoked_by (revoked_by_user_id),
    CONSTRAINT fk_tenant_member_roles_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_tenant_member_roles_membership
        FOREIGN KEY (membership_id) REFERENCES tenant_memberships (id),
    CONSTRAINT fk_tenant_member_roles_assigned_by
        FOREIGN KEY (assigned_by_user_id) REFERENCES users (id),
    CONSTRAINT fk_tenant_member_roles_revoked_by
        FOREIGN KEY (revoked_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tenant_domains (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    domain VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tenant_domains_domain (domain),
    KEY idx_tenant_domains_primary (tenant_id, is_primary),
    KEY idx_tenant_domains_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT fk_tenant_domains_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_tenant_domains_deleted_by
        FOREIGN KEY (deleted_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tenant_themes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(160) NOT NULL,
    template_key VARCHAR(120) NOT NULL,
    logo_url VARCHAR(2048) NULL,
    settings JSON NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    delete_requested_at DATETIME NULL,
    delete_after DATETIME NULL,
    deleted_by_user_id BIGINT UNSIGNED NULL,
    delete_reason VARCHAR(255) NULL,
    PRIMARY KEY (id),
    KEY idx_tenant_themes_active (tenant_id, is_active),
    KEY idx_tenant_themes_deleted_after (tenant_id, deleted_at, delete_after),
    CONSTRAINT fk_tenant_themes_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_tenant_themes_deleted_by
        FOREIGN KEY (deleted_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tenant_service_entitlements (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tenant_id BIGINT UNSIGNED NOT NULL,
    service_key VARCHAR(120) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    starts_at DATETIME NULL,
    ends_at DATETIME NULL,
    granted_by_user_id BIGINT UNSIGNED NULL,
    revoked_at DATETIME NULL,
    revoked_by_user_id BIGINT UNSIGNED NULL,
    revoke_reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tenant_service_entitlements_service (tenant_id, service_key),
    KEY idx_tenant_service_entitlements_status (tenant_id, status),
    KEY idx_tenant_service_entitlements_granted_by (granted_by_user_id),
    KEY idx_tenant_service_entitlements_revoked_by (revoked_by_user_id),
    CONSTRAINT fk_tenant_service_entitlements_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_tenant_service_entitlements_granted_by
        FOREIGN KEY (granted_by_user_id) REFERENCES users (id),
    CONSTRAINT fk_tenant_service_entitlements_revoked_by
        FOREIGN KEY (revoked_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
