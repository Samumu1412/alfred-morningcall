require('dotenv').config();
const slackAPI = require('slackbots');
let schedule = require('node-schedule');
// Dependencies
const buzzerStatus = require('./buzzerStatus');
const targetChannel = 'buzzer_alfred';
const versionText = 'ver 0.1.1';

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'ALFRED_Bot_MorningCall'
    })

process.env.TZ = 'Asia/Shanghai'
const discordBotMorningCallText = 'Discord Bot ' + versionText + ' starts working at ';
const telegramBotMorningCallText = 'Telegram Bot ' + versionText + ' starts working at ';


let discordBotMorningCallSchedule = new schedule.scheduleJob('*/3 * * * * * ', async function () {
    var discordBotAwakeOrNotStatus = await getDiscordBotAwakeOrNotStatus();
    var discordBuzzerSendOrNotString = await getDiscordBuzzerSendOrNotString();
    let time = new Date();
    if (discordBotAwakeOrNotStatus) {
        sendMessageToSlack(discordBotMorningCallText, time);
        updateDiscordBuzzerAwakeOrNotToFalse();
        if (discordBuzzerSendOrNotString == "alreadySend") {
            updatediscordBuzzerSendOrNotStringToFalse();
        }
    }
});

let telegramBotMorningCallSchedule = new schedule.scheduleJob('*/3 * * * * * ', async function () {
    var telegramBotAwakeOrNotStatus = await getTelegramBotAwakeOrNotStatus();
    var telegramBuzzerSendOrNotString = await getTelegramBuzzerSendOrNotString();
    let time = new Date();
    if (telegramBotAwakeOrNotStatus) {
        sendMessageToSlack(telegramBotMorningCallText, time);
        updateTelegramBuzzerAwakeOrNotToFalse();
        if (telegramBuzzerSendOrNotString == "alreadySend") {
            updateTelegramBuzzerSendOrNotStringToFalse();
        }
    }
});

async function getDiscordBotAwakeOrNotStatus() {
    try {
        var buzzer = await buzzerStatus.findOne({ name: "DiscordBuzzer" }).exec();
        var status = buzzer._doc.awakeOrNot;
        return status;
    } catch (err) {
        console.error(err);
    }
}

async function getTelegramBotAwakeOrNotStatus() {
    try {
        var buzzer = await buzzerStatus.findOne({ name: "TelegramBuzzer" }).exec();
        var status = buzzer._doc.awakeOrNot;
        return status;
    } catch (err) {
        console.error(err);
    }
}

async function getDiscordBuzzerSendOrNotString() {
    try {
        var buzzer = await buzzerStatus.findOne({ name: "DiscordBuzzer" }).exec();
        var sendWarningToSlackOrNotString = buzzer._doc.sendWarningToSlackOrNot;
        return sendWarningToSlackOrNotString;
    } catch (err) {
        console.error(err);
    }
}

async function getTelegramBuzzerSendOrNotString() {
    try {
        var buzzer = await buzzerStatus.findOne({ name: "TelegramBuzzer" }).exec();
        var sendWarningToSlackOrNotString = buzzer._doc.sendWarningToSlackOrNot;
        return sendWarningToSlackOrNotString;
    } catch (err) {
        console.error(err);
    }
}

function sendMessageToSlack(message, time) {
    slackBot.postMessageToChannel(targetChannel, message + time);
    console.log(message);
}

function updateDiscordBuzzerAwakeOrNotToFalse() {
    buzzerStatus.updateOne({ name: "DiscordBuzzer" },
        { awakeOrNot: false }).then()
}

function updateTelegramBuzzerAwakeOrNotToFalse() {
    buzzerStatus.updateOne({ name: "TelegramBuzzer" },
        { awakeOrNot: false }).then()
}

function updatediscordBuzzerSendOrNotStringToFalse() {
    buzzerStatus.updateOne({ name: "DiscordBuzzer" },
        { sendWarningToSlackOrNot: "false" }).then()
}

function updateTelegramBuzzerSendOrNotStringToFalse() {
    buzzerStatus.updateOne({ name: "TelegramBuzzer" },
        { sendWarningToSlackOrNot: "false" }).then()
}