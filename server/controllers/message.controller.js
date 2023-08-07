const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const createError = require("../utils/createError");

exports.createMessage = async (req, res, next) => {
  const { conversationId, desc } = req.body;
  try {
    const message = await Message.create({
      conversationId,
      desc,
      senderId: req.user.id,
    });
    await Conversation.findOneAndUpdate(
      { id: conversationId },
      {
        readBySeller: req.user.isSeller,
        readByBuyer: !req.user.isSeller,
        lastMessage: desc,
      }
    );
    res.status(200).json({ sucess: true, data: message });
  } catch (err) {
    next(err);
  }
};
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    }).populate("senderId", "username img isSeller");
    if (!messages) return next(createError(404, "Messages not found"));
    res.status(200).json({ sucess: true, data: messages });
  } catch (err) {
    next(err);
  }
};
