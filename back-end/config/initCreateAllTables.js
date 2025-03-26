import { create } from "domain";
import { createBuyingGames, createGames, createHipples, createLeaderboard, createMessages, createRequests, createUsers } from "./sqlquery.js";


export function initCreateAllTables(client) {
    client.query(createUsers);
    client.query(createGames);
    client.query(createHipples);
    client.query(createBuyingGames);
    client.query(createLeaderboard);;
    client.query(createRequests);
    client.query(createMessages);
}