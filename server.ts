import { createServer, IncomingMessage, ServerResponse } from "node:http";
import next from "next";
import { Server } from 'socket.io';

const backendEndpoint = "http://localhost:3000/";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const endpoints = {
  teams: "/update/teams",
  boxes: "/update/boxes",
  tokens:"/update/tokens",
  services: "/update/services",
  claims: "/update/claims"
}

export const eventNames = {
  teams: "update-teams",
  claims: "update-claims",
  services: "update-services",
}

const app = next({ dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    if (req.method === "POST") {
      console.log("RECIEVE POST!");
      handlePost(req, res, io);
    }
    handler(req, res);
  });
  
  const io = new Server(httpServer);

  // Socket connection handler
  io.on("connection", (socket) => {
    console.log("User connection:", socket.id);
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


const handlePost = async (req: IncomingMessage, res: ServerResponse, io: Server) => {
  try {
    const buffers: Uint8Array[] = [];

    // Collect chunks of data
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    // Convert buffer to JSON
    const body = JSON.parse(Buffer.concat(buffers).toString());

    // Handle the request based on URL
    switch (req.url) {
      case endpoints.teams:
        io.emit(eventNames.teams, body);
        break;
      case endpoints.claims:
        io.emit(eventNames.claims, body);
        break;
      case endpoints.services:
        io.emit(eventNames.services, body);
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

