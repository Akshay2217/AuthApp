import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });


  const gameModel = mongoose.model('game', GameSchema);

  export default gameModel;

