const g = typeof globalThis !== "undefined" ? globalThis : window;
const revenge = g.revenge || g.vendetta;
const commands = revenge?.commands;

let unregister;

module.exports = {
  onLoad: () => {
    if (!commands) return;

    unregister = commands.registerCommand({
      name: "t",
      displayName: "t",
      description: "Generates a dynamic Discord timestamp tag",
      displayDescription: "Generates a dynamic Discord timestamp tag",
      options: [
        {
          name: "hour",
          displayName: "hour",
          description: "Hour (0-23)",
          displayDescription: "Hour (0-23)",
          type: 4, // ApplicationCommandOptionType.INTEGER
          required: true
        },
        {
          name: "day",
          displayName: "day",
          description: "Day of month (1-31)",
          displayDescription: "Day of month (1-31)",
          type: 4,
          required: true
        },
        {
          name: "month",
          displayName: "month",
          description: "Month (1-12)",
          displayDescription: "Month (1-12)",
          type: 4,
          required: true
        },
        {
          name: "year",
          displayName: "year",
          description: "Year (e.g. 2026)",
          displayDescription: "Year (e.g. 2026)",
          type: 4,
          required: true
        },
        {
          name: "minute",
          displayName: "minute",
          description: "Minute (0-59)",
          displayDescription: "Minute (0-59)",
          type: 4,
          required: false
        }
      ],
      // 1 = CHAT_INPUT
      type: 1,
      execute: (args, ctx) => {
        try {
          const getOpt = (name) => args.find((o) => o.name === name)?.value;

          const hour = getOpt("hour");
          const day = getOpt("day");
          const month = getOpt("month") - 1; // JS months are 0-11
          const year = getOpt("year");
          const minute = getOpt("minute") || 0;

          // Construct Date object in UTC
          const date = new Date(Date.UTC(year, month, day, hour, minute));
          const unix = Math.floor(date.getTime() / 1000);

          if (isNaN(unix)) {
            return { content: "Invalid date provided!" };
          }

          // Sends <t:UNIX:F> directly into the chat box
          return { content: `<t:${unix}:F>` };
        } catch (err) {
          return { content: "Failed to generate timestamp." };
        }
      }
    });
  },

  onUnload: () => {
    if (typeof unregister === "function") unregister();
  }
};
