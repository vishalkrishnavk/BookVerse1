import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../redux/messageSlice";
import { Send, X, Image } from "lucide-react";
import toast from "react-hot-toast";

const SendMsg = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const fileInputRef = useRef(null);
  const { selectedUser } = useSelector((state) => state.messages);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      return toast.error("Please select a valid image");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImg(reader.result);
    };
  };

  const removeImage = () => {
    setImg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !img) return;
    if (!selectedUser) return toast.error("Please select a user to chat with");

    try {
      const messageData = {
        text: text.trim(),
        image: img,
      };

      await dispatch(sendMessage({ selectedUser, messageData })).unwrap();
      setText("");
      setImg(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error(error.message || "Cannot send the message");
    }
  };

  return (
    <div className="p-4 w-full bg-primary border-t border-[#66666645]">
      {img && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={img}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#66666645]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary
              flex items-center justify-center text-ascent-1 border border-[#66666645]"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-secondary text-ascent-1 
            placeholder:text-ascent-2 border border-[#66666645] focus:outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex w-10 h-10 rounded-full bg-secondary
            items-center justify-center border border-[#66666645]
            ${img ? "text-blue" : "text-ascent-2"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className={`w-10 h-10 rounded-full flex items-center justify-center
          ${
            !text.trim() && !img
              ? "bg-secondary text-ascent-2 cursor-not-allowed"
              : "bg-blue text-white"
          } 
          border border-[#66666645]`}
          disabled={!text.trim() && !img}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default SendMsg;
