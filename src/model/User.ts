import mongoose, { Schema, Document } from "mongoose";

// This is Typescript. 'interface' is a datatype and keyword. here we are defining 'Message' schema by extending 'Document'. We store documents in mongoose
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// This is JS
const MessageSchema: Schema<Message> = new Schema({
  // "Schema<Message>" means 'MessageSchema' have to follow types of 'Message' schema defined above
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// User schema
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[]; // array of messages with 'Message' format
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
    match: [/.+@.+\..+/, "Please use a valid email address"], // matching with regex format
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

// In Node JS, once we start the server, it will keep running until inturuption. But Next JS is an Edge time framework, means it doesn't know if the app is running for the 1st time, or it ran before. It won't keep running; it executes functions and everything as the requests come. So when we export a model, we check if the model already present or not; if not, create the model in mongoose and return it.

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) || // "mongoose.models.User" gives the existing model. "mongoose.Model<User>" is TS, means the return datatype will be '<User>', not any other datatype
  mongoose.model<User>("User", UserSchema); // creates the model for the 1st time and returns it. Also the datatype will be <User>.

export default UserModel;
