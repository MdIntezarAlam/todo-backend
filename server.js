// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./src/config/db.js";
// import todoRouter from "./src/router/todoRouter.js";
// import userRouter from "./src/router/userRouter.js";
// import addressRouter from "./src/router/addressRouter.js";
// import ticketRouter from "./src/router/ticketRouter.js";
// import cookieParser from "cookie-parser";
// import { Server } from "socket.io";
// import { createServer } from "http";
// import { socketConnectionController } from "./src/controller/socketController.js";

// dotenv.config();
// connectDB();

// const app = express();


// const server = createServer( app );
// const io = new Server( server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://dev-intezar-todo.onrender.com",
//       "https://fullstack-forntend.netlify.app/"
//     ],
//     credentials: true,
//   },
// } );

// app.use( cookieParser() );
// app.use( express.json() );
// app.use(
//   cors( {
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://dev-intezar-todo.onrender.com",
//       "https://fullstack-forntend.netlify.app/"
//     ],
//     credentials: true,
//   } )
// );

// app.use( "/api/v2", todoRouter );
// app.use( "/api/v2/auth", userRouter );
// app.use( "/api/v2/address", addressRouter );
// app.use( "/api/v2", ticketRouter );

// socketConnectionController( io );

// const PORT = process.env.PORT;
// server.listen( PORT, () => {
//   console.log( `Server is running on port ${ PORT }` );
// } );



// //this is the deplyed link api =>https://dev-intezar-todo.onrender.com/api/v2/fetch
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import todoRouter from "./src/router/todoRouter.js";
import userRouter from "./src/router/userRouter.js";
import addressRouter from "./src/router/addressRouter.js";
import ticketRouter from "./src/router/ticketRouter.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

// List of allowed origins (ensure there are no typos)
const allowedOrigins = [
  "http://localhost:3000", // Local development server
  "https://dev-intezar-todo.onrender.com", // Production Render URL
  "https://fullstack-forntend.netlify.app" // Production Netlify URL (verify no typo here)
];

// CORS configuration
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

app.use( cors( corsOptions ) ); // Apply CORS configuration
app.use( cookieParser() );
app.use( express.json() );
app.use( "/api/v2", todoRouter );
app.use( "/api/v2/auth", userRouter );
app.use( "/api/v2/address", addressRouter );
app.use( "/api/v2", ticketRouter );

const PORT = process.env.PORT || 5000;

const server = app.listen( PORT, () => {
  console.log( `Server is running on port ${ PORT }` );
} );
