import mongoose from "mongoose";

const connectDb = async () => {
  const uri = "mongodb+srv://satyam87yadav_db_user:%40Satyam7255@ainotes.y7vgwj8.mongodb.net/ai_notes_analyzer?retryWrites=true&w=majority&appName=AInotes";

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

export default connectDb;
