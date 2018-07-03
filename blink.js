const Discord = require("discord.js");
const client = new Discord.Client();
var Transfer = require('transfer-sh')
var morseAPI = require('morse');
function logEmbed(embed) {
    const {
        title,
        description,
        url,
        color,
        author,
        timestamp,
        fields,
        thumbnail,
        image,
        footer,
        file
    } = embed;
    logger.debug({
        title,
        description,
        url,
        color,
        author,
        timestamp,
        fields,
        thumbnail,
        image,
        footer,
        file
    })
}
const prefix = 'b/'
const settings = require("./modules/configuration.json");
const randomDog = require('random.dog.js');
const randomDogApi = randomDog.api();
const randomCat = require('random.cat.js');
const logger = require('tracer').colorConsole();
const colors = require('colors');
const randomCatApi = randomCat.api();
const fs = require('fs');
const Pageres = require('pageres');
const a = new Date();

/*
const pageres = new Pageres({delay: 2})
    .src('https://mugglenetwork.enjin.com', ['1920x1080'])
    .dest(__dirname)
    .run()
    .then(() => console.log('done'));
*/

function hasRole(member, role){
    if(member.roles.find('name', role)){
      return true;
    } else{
      return false;
    }
  }
  function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}
function msToTime(s) {
    function pad(n, z) {
        z = z || 2;
        return ("00" + n).slice(-z);
    }

    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return pad(hrs) + ":" + pad(mins) + ":" + pad(secs) + "." + pad(ms, 3);
}

client.on("ready", () => {
    logger.info("Connection found...");
    logger.trace("Requesting main.js from github...");
        logger.info("Github request complete.");
        logger.trace("Sending Login Request to Discord.");
        logger.info(".bink Bot Online.");
});

setInterval(function() {
    logger.debug(`API Latency ${client.ping}.`);
}, 3600000);

client.on("reconnecting", () => {
    logger.error("Clients WebSocket has been lost/closed from discord.");
});

client.on("messageDelete", message => {
    if (message.channel.name == undefined) {
    let member = message.author;
   logger.info(`Deleted`.red + ` || ` + `${member.username}`.cyan + ' / '.gray + `${member.id}`.cyan + ` || `.gray + `${message.content}`.white);
    }
  });
  

client.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.channel.name == undefined) {
        logger.info(`${oldMessage.author.username}`.cyan, ` / `.gray, `${oldMessage.author.id}`.cyan, ` || `.gray,  `${oldMessage.createdAt}`.yellow, `\n`, "oldMessage.content".red, " : ".gray , oldMessage.content.gray ? oldMessage.content.gray : "Empty / embed".red, `\n`, "newMessage.content".white, " : ".gray, newMessage.content.gray ? newMessage.content.gray : "Empty / embed".red)
    }
});

client.on("message", message => {
    if (message.channel.name == undefined) { 
        logger.info(message.author.username.cyan + ' / '.gray + message.author.id.cyan + ' || '.gray + message.content.white + ' || '.gray + `${message.createdAt}`.yellow); 
        message.attachments.forEach(a => {
            logger.debug(`${a.filename}`.green + ` || `.gray + `${humanFileSize(a.filesize)}`.cyan + ` || `.gray + `${a.url}`.blue)
        })
    }  
        if (message.content.startsWith(prefix + `eval`)) {

                message.content = message.content.substring(prefix.length + 5)
                if (message.author.id === settings.devID)
                    var code = message.content
                if (!code.length) return message.send(`Add some code there`);
                try {
                    const output = eval(code);
                    message.channel.send(`\`\`\`js\nInput\n${code.replace(/`/g, '"')}\`\`\`\n\`\`\`js\nOUTPUT:\n${typeof output === 'object' ? JSON.stringify(output) : output}\`\`\``);
        } catch(err) {
            message.channel.send(`\`Output:\`\n\`\`\`${code.replace(/`/g, '"')}\`\`\`\n\`ERROR:\`\n\`\`\`${err}\`\`\``);
        }}
});

client.on("error", error => {
    logger.fatal(`The clients WebSocket has errored || $ {error}.`);
});
                client.on("message", message => {
                    if (message.content.startsWith(`b/restart`)) {
                        if (message.author.id != settings.devID) return;
                        logger.trace(`.blink's Selfbot has been restarted under PM2 Process 0 by ${message.author.username}`)
                    }
                    if (message.content.startsWith("b/uptime")) {
                        if (message.author.id != settings.devID) return;
                        message.channel.send(`Current bot uptime ${msToTime(client.uptime)}`);
                    }
                    if (message.content.startsWith("b/randog")) {
                        if (message.author.id != settings.devID) return;
                        randomDogApi.getDog().then((dog) => message.channel.send(`${dog.url}`))
                    }
                    if (message.content.startsWith('b/rancat')) {
                        if (message.author.id != settings.devID) return;
                        randomCatApi.getCat().then((cat) => message.channel.send(`${cat.file}`))
                    }
                    if (message.content.startsWith('b/up')) {
                        if (message.author.id != settings.devID) return;
                        new Transfer(message.content.substring(5))
                            .upload()
                            .then(function (link) { message.channel.send(`Gay : ${link}`), logger.trace(`File Uploaded: ${link}`)})
                            .catch(function (err) { logger.error(err) })
                    }
                });

                // something tht i have no use for anymore unless i decide to go back to textfile daily rotations.
                function consoleAndLogger(...args) {
                    console.log(...args);
                    logger.info(...args);
                }

                client.login(settings.token);