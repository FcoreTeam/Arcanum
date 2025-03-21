import { createBuyingGames, createGames, createLeaderboard, createUsers } from "./sqlquery.js";


export function initCreateAllTables(client) {
    client.query(createUsers);
    client.query(createGames);
    client.query(createBuyingGames);
    client.query(createLeaderboard);;
}