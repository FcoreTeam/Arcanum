export const createUsers = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    tg_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(255),
    username VARCHAR(255),
    balance DECIMAL(100,2) NOT NULL DEFAULT 0,
    from_ref_id BIGINT,
    avatar_url VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT false
);`;

export const createMessages = `CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    tg_id_sender BIGINT NOT NULL UNIQUE,
    message VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

export const createGames = `CREATE TABLE IF NOT EXISTS games(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    date VARCHAR(255),
    price DECIMAL(100,2) NOT NULL DEFAULT 0,
    video_url VARCHAR(255),
    video_after_url VARCHAR(255),
    answer VARCHAR(255),
    max_pts INTEGER NOT NULL DEFAULT 0
);`

export const createLeaderboard = `CREATE TABLE IF NOT EXISTS leaderboard(
    id SERIAL PRIMARY KEY,
    player_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    is_rewarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games(id),
    CONSTRAINT fk_player_id FOREIGN KEY (player_id) REFERENCES users(id)
);`