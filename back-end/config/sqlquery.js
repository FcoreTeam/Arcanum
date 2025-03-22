export const createUsers = `CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY NOT NULL UNIQUE,
    first_name VARCHAR(255),
    username VARCHAR(255),
    balance DECIMAL(100,2) NOT NULL DEFAULT 0,
    avatar_url VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT false,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255) UNIQUE
);`;

export const createGames = `CREATE TABLE IF NOT EXISTS games(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    date VARCHAR(255),
    price DECIMAL(100,2) NOT NULL DEFAULT 0,
    preview_url VARCHAR(255),
    video_after_url VARCHAR(255),
    answer VARCHAR(255),
    is_test BOOLEAN NOT NULL DEFAULT false
);`

export const createBuyingGames = `CREATE TABLE IF NOT EXISTS buying_games (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games(id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);`;

export const createLeaderboard = `CREATE TABLE IF NOT EXISTS leaderboard(
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    is_rewarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games(id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);`

export const createHipples = `CREATE TABLE IF NOT EXISTS hipples(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT false,
    game_id BIGINT NOT NULL,
    CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games(id)
);`