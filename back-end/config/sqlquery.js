export const createUser = `CREATE TABLE IF NOT EXISTS users (
    tg_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(255),
    username VARCHAR(255),
    balance DECIMAL(100,2) NOT NULL DEFAULT 0,
    max_balance DECIMAL(100,2) NOT NULL DEFAULT 5000,
    from_ref_id BIGINT,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    current_storage DECIMAL(100,3) NOT NULL DEFAULT 0,
    max_storage DECIMAL(100,3) NOT NULL DEFAULT 1,
    income DECIMAL(100,2) NOT NULL DEFAULT 0,
    last_income_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    size_pic INT4RANGE NOT NULL DEFAULT '[0, 1000000)',
    pay_pic INT4RANGE NOT NULL DEFAULT '[0, 1000000)',
    percent_error DECIMAL(100,2) NOT NULL DEFAULT 0,
    avatar_url VARCHAR(255),
    reward_by_member BOOLEAN NOT NULL DEFAULT false
    );`;

export const createCategory = `CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY UNIQUE,
    title VARCHAR(255) NOT NULL UNIQUE
);`;

export const createCatOfUser = `CREATE TABLE IF NOT EXISTS cat_of_user (
    user_tg_id BIGINT NOT NULL,
	category_id INTEGER NOT NULL,
	quantity INTEGER DEFAULT 0,
    CONSTRAINT fk_user FOREIGN KEY (user_tg_id) REFERENCES users(tg_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);`;

export const createPromo = `CREATE TABLE IF NOT EXISTS promo (
    id SERIAL PRIMARY KEY UNIQUE,
    code varchar(30) NOT NULL UNIQUE,
    discount DECIMAL(100,2) NOT NULL
)`

export const createDefaultCategory = `INSERT INTO category (title) 
            VALUES ('Природа'), ('Еда'), ('Спорт'), ('Путешествия'), ('Архитектура');`

export const createErrors = `CREATE TABLE IF NOT EXISTS errors (
    id SERIAL PRIMARY KEY UNIQUE,
    message VARCHAR(255) NOT NULL
);`;

export const createDefaultErrors = `INSERT INTO errors (message)
    VALUES
    ('Изображение плохого качества'),
    ('Изображение слишком большое'),
    ('Изображение слишком маленькое'),
    ('Изображение содержит недопустимый контент'),
    ('Формат файла не поддерживается'),
    ('Изображение не соответствует теме или контексту'),
    ('Дубликат уже существующего изображения'),
    ('Изображение содержит водяные знаки или логотипы'),
    ('Присутствие посторонних объектов в кадре');`

export const createBonus = `CREATE TABLE IF NOT EXISTS bonus (
    id SERIAL PRIMARY KEY UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity_of_pictures INTEGER NOT NULL,
    price DECIMAL(100,2) NOT NULL,
    user_tg_id BIGINT,
    success BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_user FOREIGN KEY (user_tg_id) REFERENCES users(tg_id) ON DELETE CASCADE
);`

export const createPromoOfUser = `CREATE TABLE IF NOT EXISTS promo_of_user (
    id SERIAL PRIMARY KEY UNIQUE,
    promo_id BIGINT,
    user_tg_id BIGINT,
    CONSTRAINT fk_user FOREIGN KEY (user_tg_id) REFERENCES users(tg_id) ON DELETE CASCADE,
    CONSTRAINT fk_promo FOREIGN KEY (promo_id) REFERENCES promo(id) ON DELETE CASCADE
);`