import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import todoRouter from "./src/router/todoRouter.js";
import userRouter from "./src/router/userRouter.js";
import addressRouter from "./src/router/addressRouter.js";
import ticketRouter from "./src/router/ticketRouter.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketConnectionController } from "./src/controller/socketController.js";

dotenv.config();
connectDB();

const app = express();


const allowedOrigins = [
  "http://localhost:3000", // Local development server
  "https://dev-intezar-todo.onrender.com", // Production Render URL
  "https://fullstack-forntend.netlify.app" // Production Netlify URL (verify no typo here)
];

const corsOptions = {
  origin: function ( origin, callback ) {
    console.log( "Incoming origin:", origin ); // Debugging line to check incoming origin
    if ( allowedOrigins.indexOf( origin ) !== -1 || !origin )
    {
      callback( null, true );
    } else
    {
      callback( new Error( "Not allowed by CORS" ) );
    }
  },
  credentials: true,  // Enable credentials (cookies)
  methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ],  // Allow common methods
  allowedHeaders: [ 'Content-Type', 'Authorization' ],  // Allow specific headers
};

const server = createServer( app );
// const io = new Server( server, { cors: corsOptions, transports: [ "websocket" ] } );
const io = new Server( server, { cors: corsOptions, } );//addition

app.use( cookieParser() );
app.use( express.json() );
app.use( cors( corsOptions ) );

app.use( "/api/v2", todoRouter );
app.use( "/api/v2/auth", userRouter );
app.use( "/api/v2/address", addressRouter );
app.use( "/api/v2", ticketRouter );

socketConnectionController( io );

const PORT = process.env.PORT;
server.listen( PORT, () => {
  console.log( `Server is running on port ${ PORT }` );
} );


