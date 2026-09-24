CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    customer_id BIGINT NOT NULL,
    channel VARCHAR(30) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED'
);

CREATE INDEX IF NOT EXISTS idx_transactions_date
ON transactions(transaction_date);

CREATE INDEX IF NOT EXISTS idx_transactions_date_channel
ON transactions(transaction_date, channel);

CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    segment VARCHAR(30) NOT NULL,
    created_at DATE NOT NULL
);
