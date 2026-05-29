const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const spamMap = new Map();

client.on('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  if (!spamMap.has(userId)) {
    spamMap.set(userId, []);
  }

  const timestamps = spamMap.get(userId);

  timestamps.push(Date.now());

  while (timestamps.length > 0 && Date.now() - timestamps[0] > 5000) {
    timestamps.shift();
  }

  if (timestamps.length >= 5) {
    const member = message.member;

    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    try {
      await member.timeout(60000, "Spam");

      message.channel.send(
        `${message.author} đã bị mute 1 phút vì spam!`
      );

      spamMap.set(userId, []);
    } catch (err) {
      console.log(err);
    }
  }
});

client.login(process.env.TOKEN);
