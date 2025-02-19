export const createUser = `CREATE TABLE IF NOT EXISTS users (
    tg_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(255),
    username VARCHAR(255),
    balance DECIMAL(100,2) NOT NULL DEFAULT 0,
    max_balance DECIMAL(100,2) NOT NULL DEFAULT 5000,
    from_ref_id BIGINT,
    avatar_url VARCHAR(255)
);`;