CREATE DATABASE IF NOT EXISTS sales_builder_auth
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_user
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_product
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_catalog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_inventory
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_cart
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_order
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_payment
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_discount
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_content
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sales_builder_audit
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON sales_builder_auth.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_user.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_product.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_catalog.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_inventory.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_cart.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_order.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_payment.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_discount.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_content.* TO 'sales_builder'@'%';
GRANT ALL PRIVILEGES ON sales_builder_audit.* TO 'sales_builder'@'%';

FLUSH PRIVILEGES;
