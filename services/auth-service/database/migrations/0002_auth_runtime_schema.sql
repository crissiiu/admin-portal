USE sales_builder_auth;

ALTER TABLE users
    ADD COLUMN username VARCHAR(160) NULL AFTER email,
    ADD COLUMN phone_verified_at DATETIME NULL AFTER phone,
    ADD COLUMN default_actor_type VARCHAR(32) NOT NULL DEFAULT 'customer' AFTER status,
    ADD KEY idx_users_username (username),
    ADD KEY idx_users_phone (phone),
    ADD KEY idx_users_phone_verified (phone_verified_at);

CREATE TABLE IF NOT EXISTS sessions (
    id CHAR(36) NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    actor_type VARCHAR(32) NOT NULL,
    tenant_id BIGINT UNSIGNED NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(512) NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sessions_user_status (user_id, status, expires_at),
    KEY idx_sessions_tenant_user (tenant_id, user_id, status),
    KEY idx_sessions_expires (expires_at),
    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_sessions_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id CHAR(36) NOT NULL,
    session_id CHAR(36) NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    rotated_to_token_id CHAR(36) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_refresh_tokens_hash (token_hash),
    KEY idx_refresh_tokens_session (session_id, revoked_at, expires_at),
    KEY idx_refresh_tokens_expires (expires_at),
    CONSTRAINT fk_refresh_tokens_session
        FOREIGN KEY (session_id) REFERENCES sessions (id),
    CONSTRAINT fk_refresh_tokens_rotated_to
        FOREIGN KEY (rotated_to_token_id) REFERENCES refresh_tokens (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id CHAR(36) NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    actor_type VARCHAR(32) NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_password_reset_tokens_hash (token_hash),
    KEY idx_password_reset_user (user_id, actor_type, used_at, expires_at),
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS phone_verification_codes (
    id CHAR(36) NOT NULL,
    tenant_id BIGINT UNSIGNED NULL,
    phone_number VARCHAR(32) NOT NULL,
    purpose VARCHAR(32) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    consumed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_phone_verification_lookup (tenant_id, phone_number, purpose, consumed_at, expires_at),
    KEY idx_phone_verification_expires (expires_at),
    CONSTRAINT fk_phone_verification_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oauth_identities (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    tenant_id BIGINT UNSIGNED NULL,
    provider VARCHAR(32) NOT NULL,
    provider_subject VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_oauth_identity_provider_subject_tenant (provider, provider_subject, tenant_id),
    KEY idx_oauth_identities_user (user_id),
    CONSTRAINT fk_oauth_identities_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_oauth_identities_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
