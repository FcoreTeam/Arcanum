import { createGames, createLeaderboard, createMessages, createUsers } from "./sqlquery.js";


export function initCreateAllTables(client) {
    client.query(createUsers);
    client.query(createGames);
    client.query(createMessages);
    client.query(createLeaderboard);;
}