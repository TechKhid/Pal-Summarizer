const fs = require('fs');
const { Voice } = require('@vonage/voice');
const path = require('path');
const Koa = require('koa');
const router = require('@koa/router')();
const koaBody = require('koa-body');
const websockify = require('koa-websocket');
const Twig = require('twig');
const twig = Twig.twig;
const views = require('koa-views');
const sdk = require('@symblai/symbl-js').sdk;
const uuid = require('uuid').v4;

require('dotenv').config();

const config = fs.readFileSync(path.join(__dirname, process.env.VONAGE_CONFIG_FILE));
const appUrl = process.env.TUNNEL_DOMAIN;

const vonage = new Voice({
    applicationId: config.application_id,
    privateKey: config.private_key,
});

async function initSymbl() {
    await sdk.init({
        appId: process.env.SYMBL_APPID,
        appSecret: process.env.SYMBL_SECRET,
        basePath: 'https://api.symbl.ai'
    });
}
 initSymbl();

const wsClients = [];
let meetingId;
let connection;

async function answer(ctx) {
    ctx.status = 200;
    ctx.body = [
        {
            action: "talk",
            text: "Please wait while we connect you to an agent",
        },
        {
            action: "connect",
            eventUrl: ["https://" + appUrl + "/webhooks/events"],
            from: process.env.VONAGE_FROM,
            endpoint: [
                {
                    type: "phone",
                    number: process.env.VONAGE_TO,
                }
            ]
        },
        {
            action: "connect",
            eventUrl: ["https://" + appUrl + "/webhooks/events"],
            from: process.env.VONAGE_FROM,
            endpoint: [
                {
                    type: "websocket",
                    uri: "wss://" + appUrl + "/",
                    "content-type": "audio/l16;rate=16000",
                }
            ]
        }
    ];

    console.log("connecting to symbl");
    try {
        meetingId = uuid();
        connection = await sdk.startRealtimeRequest({
            meetingId,
            insightTypes: ['action_item', 'question'],
            config: {
                meetingTitle: 'Test Meeting',
                confidenceThreshold: 0.7,
                timezoneOffset: 480, // Offset in minutes from UTC
                languageCode: 'en-US',
                sampleRateHertz: 16000,
            },
            handlers: {
                onSpeechDetected: (data) => {
                    // Do something with the data in real time
                },
                onMessageResponse: (data) => {
                    // Send the fully transcribed message back to all connected UI clients
                    for (let i = 0; i < wsClients.length; i++) {
                        if (typeof wsClients[i].send === 'function') {
                            wsClients[i].send(data[0].payload.content);
                        }
                    }
                  },
                  onInsightResponse: (data) => {
                    // Do something when an insight response is returned
                  },
                  onTopicResponse: (data) => {
                    // Do something when a topic is detected and returned
                    for (let i = 0; i < wsClients.length; i++) {
                        if (typeof wsClients[i].send === 'function') {
                            wsClients[i].send(data[0].payload.content);
                        }
                    }
                  }
            }
        });
        console.log("Connected");
    }catch (e) {
        console.log("Symbl connect error");
        console.error(e);
    }
}

async function events(ctx) {
    // console.log(ctx.request.body);
    ctx.status = 204;
    ctx.body = null;
}

async function handleWebsocket(ctx) {
    ctx.websocket.on('message', async (message) => {
        try {
            const event = JSON.parse(message);
            if (event.event === 'websocket:connected') {
            }

            if (event.event === 'webui:connect') {
                wsClients.push(ctx.websocket, wsClients);
                for (let i = 0; i < wsClients.length; i++) {
                    if (typeof wsClients[i].send === 'function') {
                        wsClients[i].send('Connected');
                    }
                }
            }
        } catch (err) {
            if (connection) {
                connection.sendAudio(message);
                return;
            }
        }
    });
}

const app = websockify(new Koa());
const render = views(__dirname + '/views', {
    extension: 'twig',
    map: {
      html: 'twig'
    }
  });
app.use(render);

router
    .get('/webhooks/answer', answer)
    .post('/webhooks/answer', answer)
    .post('/webhooks/events', events)
    .get('/home', async (ctx) => {
        await ctx.render('home');
    });

app.use(koaBody());
app.use(router.routes());
app.ws.use(handleWebsocket);

app.listen(process.env.HTTP_PORT);
