import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getSocketId, io } from "../utils/socket.js";
export const getUsersForSideBar = async (req, res) => {
  try {
    const { userId } = req.body.user;

    // Fetch the user and populate friends
    const user = await User.findById(userId).populate("friends", "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = user.friends;

    const friendsWithUnreadFlag = await Promise.all(
      friends.map(async (friend) => {
        const unreadMsgCount = await Message.countDocuments({
          senderId: friend._id,
          recieverId: userId,
          isRead: false,
        });
        return {
          ...friend.toObject(),
          hasUnreadMessages: unreadMsgCount > 0,
        };
      })
    );

    res.status(200).json(friendsWithUnreadFlag);
  } catch (error) {
    console.log("Error getUsersForSideBar", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: passedId } = req.params;
    const { userId } = req.body.user;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recieverId: passedId },
        { senderId: passedId, recieverId: userId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error getMessages", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const { userId: senderId } = req.body.user;

    /* let imgUrl;
    if (image) {
      const cloudResponse = await cloudinary.uploader.upload(image);
      imgUrl = cloudResponse.secure_url;
    } */
    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image,
    });

    await newMessage.save();

    const recieverSocketId = getSocketId(recieverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sendMessages", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markMsgAsRead = async (req, res) => {
  try {
    const { userId } = req.params; // sender's ID
    const { userId: currentUserId } = req.body.user; // current user's ID (receiver)

    if (!userId || !currentUserId) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const result = await Message.updateMany(
      {
        senderId: userId,
        recieverId: currentUserId,
        isRead: false,
      },
      { isRead: true }
    );

    const senderSocketId = getSocketId(userId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { userId: currentUserId });
    }

    res.status(200).json({
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.log("Error in marking as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
