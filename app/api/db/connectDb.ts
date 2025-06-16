import mongoose from "mongoose";

// Define a type for connection options
interface MongoConnectionOptions {
  dbName: string;
  bufferCommands: boolean;
}

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

const connectDb = async (): Promise<void> => {
  // Check if URI is defined
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const connectionState = mongoose.connection.readyState;

  // Existing connection states
  if (connectionState === 1) {
    console.log("Connection already established");
    return;
  }

  if (connectionState === 2) {
    console.log("Connection is connecting");
    return;
  }

  try {
    // Define connection options with type
    const options: MongoConnectionOptions = {
      dbName: "health-api",
      bufferCommands: true,
    };

    // Connect with proper typing
    await mongoose.connect(MONGODB_URI, options);
    console.log("Connection established");
  } catch (error: unknown) {
    // Proper error handling with type guard
    if (error instanceof Error) {
      console.error("Database connection error:", error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      console.error("Unexpected error during database connection");
      throw new Error("Unexpected error during database connection");
    }
  }
};

export default connectDb;
