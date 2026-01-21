import { createServer, IncomingMessage, ServerResponse } from "node:http";
import next from "next";
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    if (req.method === "POST") {
      console.log("Recieved post: ", req.url);
      handlePost(req, res, io);
      return;
    }
    handler(req, res);
  });
  
  const io = new Server(httpServer);

  // Socket connection handler
  io.on("connection", (socket) => {
    console.log("User connection:", socket.id);
    console.log("hello")
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});


function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const endpoints = {
  team: requireEnv("ENDPOINT_TEAM"),
  boxes: requireEnv("ENDPOINT_BOXES"),
  tokens: requireEnv("ENDPOINT_TOKENS"),
  services: requireEnv("ENDPOINT_SERVICES"),
  claims: requireEnv("ENDPOINT_CLAIMS"),
  points: requireEnv("ENDPOINT_POINTS"),
};

export const eventNames = {
  teams: requireEnv("EVENT_TEAMS"),
  boxes: requireEnv("EVENT_BOXES"),
  claims: requireEnv("EVENT_CLAIMS"),
  tokens: requireEnv("EVENT_TOKENS"),
  services: requireEnv("EVENT_SERVICES"),
  points: requireEnv("EVENT_POINTS"),
};

const handlePost = async (req: IncomingMessage, res: ServerResponse, io: Server) => {
  try {
    if (req.url?.startsWith("/__nextjs_")) {
      console.log("Skipping internal Next.js request:", req.url);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Skipped internal Next.js request" }));
      return; // Ensure no further processing
    }

    const buffers: Uint8Array[] = [];

    // Collect chunks of data
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    // Convert buffer to JSON
    const body = JSON.parse(Buffer.concat(buffers).toString());

    // Handle the request based on URL
    switch (req.url) {
      case endpoints.team:
        io.emit(eventNames.teams, body);
        break;
      case endpoints.boxes:
        io.emit(eventNames.boxes, body);
        break;
      case endpoints.tokens:
        io.emit(eventNames.tokens, body);
        break;
      case endpoints.services:
        io.emit(eventNames.services, body);
        break;
      case endpoints.claims:
        io.emit(eventNames.claims, body);
        break;
      case endpoints.points:
        io.emit(eventNames.points, body);
        break;
      default:
        console.warn("WARN: Invalid endpoint");
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid endpoint"} ));
        return;
    }
  }
  catch (error) {
    console.error("POST error:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON"}));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ stringify: true }));
  return;
}

