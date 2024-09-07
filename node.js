// CZ Developers Studio - Simulátor Bezdomovce
// Discord Bot made by marecikov5
// Discord contact: tomasito107

// server.js
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");

const fs = require("fs");

const TOKEN = 'MTI4MTMyNzY0NzczMzA1NTU0OQ.GOCRFk.0P7gMy3Ih9RwG4U9I-NqICyT8HHnvGXruCntyo';
const CLIENT_ID = '1281327647733055549';  // ID bota
const GUILD_ID = '1197904063388459078';  // ID serveru, na kterém bude slash command

const dbPath = "./database.json";

// Načtení dat z database.json
function loadDatabase() {
  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  }
  return {};
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Zaregistrujte nový slash command /penize
const commands = [
  {
    name: "penize",
    description: "Získej informace o penězích hráče",
    options: [
      {
        name: "username",
        description: "Zadej Roblox jméno hráče",
        type: 3, // Type 3 = string
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Začíná registrace slash commandů.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Slash commandy byly úspěšně zaregistrovány.');
  } catch (error) {
    console.error(error);
  }
})();

client.once("ready", async () => {
  console.log(`Bot je přihlášen jako ${client.user.tag}`);

  try {
    // Nastavení aktivity a statusu
    await client.user.setPresence({
      activities: [{ name: 'Simulator Bezdomovce 😔🎉', type: 'PLAYING' }],
      status: 'online',
    });
    console.log('Aktivita a status bota byly nastaveny.');
  } catch (error) {
    console.error('Chyba při nastavování aktivity a statusu:', error);
  }
});



// Event na interakci se slash commandem
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "penize") {
    const robloxName = options.getString("username");
    const db = loadDatabase();

    // Zkontroluje, zda dané Roblox jméno existuje v databázi
    if (db[robloxName]) {
      const money = db[robloxName].money;
      await interaction.reply(`Hráč ${robloxName} má ${money} peněz.`);
    } else {
      await interaction.reply(`Hráč ${robloxName} není v databázi.`);
    }
  }
});

// Přihlášení bota
client.login(TOKEN);

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
const express = require('express');

const app = express();
const port = 3000; // Port for API

app.use(express.json());

app.post('/update_balance', (req, res) => {
    const { userId, username, balance } = req.body;

    if (!userId || !username || balance === undefined) {
        return res.status(400).send('Invalid request');
    }

    const dbFile = 'database.json';
    let db = {};

    try {
        const data = fs.readFileSync(dbFile);
        db = JSON.parse(data);
    } catch (error) {
        // If file does not exist, initialize empty object
    }

    db[userId] = { username, balance };

    try {
        fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
        res.status(200).send('Balance updated');
    } catch (error) {
        res.status(500).send('Error saving data');
    }
});

app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
});

