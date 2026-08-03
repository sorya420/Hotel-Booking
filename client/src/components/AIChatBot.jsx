import React, { useState } from "react";
import axios from "axios";

const AIChatBot = () => {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat",

        {
          message,
        },
      );

      setChat((prev) => [
        ...prev,

        {
          sender: "bot",
          text: response.data.reply,
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setMessage("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full"
      >
        Chat
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-xl rounded-xl p-4">
          <h2 className="font-bold text-lg">AI Travel Assistant</h2>

          <div className="h-60 overflow-y-auto mt-3">
            {chat.map((item, index) => (
              <p
                key={index}
                className={
                  item.sender === "user"
                    ? "text-right text-blue-600"
                    : "text-left text-green-600"
                }
              >
                {item.text}
              </p>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
              className="border p-2 flex-1 rounded"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
