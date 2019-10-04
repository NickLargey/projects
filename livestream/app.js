const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");

// IDEA SERVICE
class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    idea.time = moment().format("h:mm:ss a");

    this.ideas.push(idea);

    return idea;
  }
}

const app = express(feathers());

// PARSE JSON
app.use(express.json());
// CONFIG SOCKETIO REALTIME API'S
app.configure(socketio());
// ENABLE REST SERVICES
app.configure(express.rest());
// REGISTER SERVICES
app.use("/ideas", new IdeaService());
// NEW CONNECTIONS CONNECT TO STREAM CHANNEL
app.on("connection", conn => app.channel("stream").join(conn));
// PUBLISH EVENTS TO STREAM
app.publish(data => app.channel("stream"));

const PORT = process.env.PORT || 3030;

app
  .listen(PORT)
  .on("listening", () =>
    console.log(`Realtime server running on port ${PORT}`)
  );

// app.service("ideas").create({
//   text: "Build a cool app",
//   tech: "nodejs",
//   viewer: "John Doe"
// });
