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
    const error = "MONGODB_URI is not defined in environment variables";
    console.error(error);
    throw new Error(error);
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
      const errorMessage = `Database connection failed: ${error.message}`;
      console.error("Database connection error:", error.message);
      throw new Error(errorMessage);
    } else {
      const errorMessage = "Unexpected error during database connection";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
};

export default connectDb;
