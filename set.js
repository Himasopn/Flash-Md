const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR01PUUcwbEdvaHpha2paYlVnbk1nMmJ1dnRKbm5XYW5SczhQOTd1THkwZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUmNSR2R5bS9rYTdJaFRZTi9yL2RralRidWFlMUhzaTVzT1oxZElFMmUzRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDTURmZWFhMjhaYmFmTHhQZStTYll0TVdmcmkyZ2U0Wkt1aXpteGZJZlc4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvRlhRUk1wVmlWWVFtelZDT0htdFdXUGVPZzdzTHJlM091YzUxLzNpa1NzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlMMVZTb3ZTZzZSSCt2ZTNTSDNuMDRUekdSVWR6ZTNlYk5SSllNZ1BuVWs9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjE2VlI0T3dBY1BLTXI3eGVQY09ScGN5NTZIZzR2S3JqNGNhWk5CT01LMWs9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0tvenZ6d0toZDhhQkJmYlBKa2VnZ0hKelBWcWwwWEtDa0RYM1c1V3VIZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVFJiOXFkclZ0OUw3ZWczL2NFb0hmTndIY0tVQnpGaVN4ekNyME03N0p5Yz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InBseldlM3B0c0VZTitmK2xOY0ZSQ2V0VFVaUjRlSmp5QmNFTDBvQnpETmJFMzdNaDdDTmV6SzN0c0VUbFEzbytnMUgzNmpveUhCeUlPOEpWUEFSYmpRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjQ0LCJhZHZTZWNyZXRLZXkiOiJHSEg1N1dNMi80SFZMVEpEMVlnSS9xbXlQcWMrbC83RTRNOGVwQ2ZpcWM0PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjUwOTQ0NTk2NjM0QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkJFRTZBRDczMjBENzVCMzEyMEE0NkY3MjI0NkM5NDY0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MzkzODYyMzZ9LHsia2V5Ijp7InJlbW90ZUppZCI6IjUwOTQ0NTk2NjM0QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjZFMjhBQkE2NzVEOENFRkQ1NUVDNTRCNEY5NzVDNjZGIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MzkzODYyMzZ9LHsia2V5Ijp7InJlbW90ZUppZCI6IjUwOTQ0NTk2NjM0QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkUzNUJFMDg5RUMyNjVDREMxNzIyM0ZBRjQ2NzNDNjk2In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MzkzODYyNDB9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImRNLS1DVmtrUmEtWnJoLTFSMHFsMWciLCJwaG9uZUlkIjoiYTg1MjY1NjMtYjg4OS00MWQwLWJmNTgtODQ2YWYyMWZhNTNlIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhTVis2MkhzcFVoQVhXbTRJWWRjSHJyTGZJND0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJwNisvSDBSN291K2Vta0NNVEV1RyswT25rUlk9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiSkFOTDJYSjEiLCJtZSI6eyJpZCI6IjUwOTQ0NTk2NjM0OjdAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiQ3V0aWUgUGllZWVlIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNKckJ1L01FRU8vYXM3MEdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJ5M0tDdGxPbGM3dUNDUnJBNlM4Z2w3S3QxWm9taEY1YTBJOW8xZXp2VVZBPSIsImFjY291bnRTaWduYXR1cmUiOiJUbEZaVjNBVUFKT3UyMmZWYzE4SFJncEZzLzBaNEJmNmt6YzRxS3RMY0trMDVac1Qxb2lVSG42N3J0RVZZMnc0TXViS0k1eTZ2elE1TXF0OGFvckVBUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiUGlscE1RTFU5bVp0MGhuaEdvUDN5ZkZDSzE4dHpyOUNqZlhucUZmWGNKY1Z6MFAxU0RZVUgxQXowcFJoK2sxVEY2Z0tWNW5tMTVvMlJDRythaVJRZ0E9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI1MDk0NDU5NjYzNDo3QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmN0eWdyWlRwWE83Z2drYXdPa3ZJSmV5cmRXYUpvUmVXdENQYU5YczcxRlEifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzkzODYyMzUsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBRTNlIn0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "917002015750",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
