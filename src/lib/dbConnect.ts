// In Node JS, once we start the server, it will keep running until inturuption. But Next JS is an Edge time framework, means it won't keep running; it executes functions and everything as the requests come. Means database connection is not there forever; it forms as the requests come. It can happen that the db connection is already there and we are trying to connect again and again; we requested something a while ago and sending the request again and again. This way we can choke the app be taking many connections. So before we do anything, we check if we already have the connection.if yes, we use that connection. If not, create new connection.

import mongoose from "mongoose";

// we use TS to check the data / object that is coming after the connection. We check the value, datatype.

type ConnectionObject = {
  isConnected?: number; // 'isConnected' is optional. But if its there, it should be iin number format
};

const connection: ConnectionObject = {}; // an empty variable with 'ConnectionObject' type. Since 'isConnected' is optional, we can assign '{}'

async function dbConnect(): Promise<void> {
  // this function will return a 'Promise'. Here '<void>' doesn't mean empty; it means "it can be any type of value"

  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  // when db is not connected
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {}); // if the URL isn't there, "" will give the error, which will be handled. {} allows to pass more option; check documentation

    connection.isConnected = db.connections[0].readyState; // checking the ready state of the db connection. A boolean value. We can also hardcode it.

    console.log("DB connected successfully");
  } catch (error) {
    // db is not connecting
    console.log("Database connection failed", error);
    process.exit();
  }
}

export default dbConnect;