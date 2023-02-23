import React, { useState } from "react";
import { css } from "@emotion/react";
import chatGPTimg from "src/image/ChatGPT_logo.png";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

export type ChatMessage = {
  text: string;
  sender: "user" | "bot";
};

export default function ChatBot() {
  const openAiKey = process.env.REACT_APP_OPENAI_API_KEY;
  // ChatGPT와의 대화 내용을 담을 State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // user의 입력 input
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // chatGPT
  const generateText = async (prompt: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        // "https://api.openai.com/v1/engines/davinci/completions",
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",
          prompt: `${prompt}`,
          temperature: 0.9,
          max_tokens: 2900,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: ["user:", "bot:"],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + openAiKey,
          },
        }
      );

      const { choices, load } = response.data;
      console.log(response);
      const text = choices[0].text.trim();
      return text;
    } catch (e: any) {
      console.log(e.response?.status);
      if (e.response?.status === 500) {
        // alert("OpenAI 서버에 오류가 발생했습니다.");
        setMessages([
          ...messages,
          { text: inputText, sender: "user" },
          { text: "OpenAI 서버에 오류가 발생했습니다.", sender: "bot" },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  async function handleSendMessage() {
    if (inputText.trim() === "") {
      return;
    }
    const response = await generateText(inputText);
    console.log(response);
    if (!response || response === undefined) {
      setMessages([
        ...messages,
        { text: inputText, sender: "user" },
        { text: "에러가 발생했습니다.", sender: "bot" },
      ]);
    } else {
      setMessages([
        ...messages,
        { text: inputText, sender: "user" },
        { text: response, sender: "bot" },
      ]);
    }
    setInputText("");
  }

  const handlekeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage();
      setInputText("");
    }
  };

  return (
    <section className="p-2 w-full bg-[#FDEBEC] rounded-md ">
      {messages.length === 0 && isLoading === true ? (
        <li className="flex items-center text-xs text-gray-400">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only"></span>
          </div>
          불러오는 중입니다...
        </li>
      ) : (
        ""
      )}

      <div
        className="flex-1 overflow-auto h-[468px]"
        css={css`
          &::-webkit-scrollbar {
            /*  스크롤바 막대 너비 설정 */
            width: 3px;
            height: 4px;
          }
          /* 스크롤바 막대 설정*/
          &::-webkit-scrollbar-thumb {
            /* 스크롤바 막대 높이 설정    */
            height: 17%;
            background-color: #bbbbbb;
            /* 스크롤바 둥글게 설정    */
            border-radius: 10px;
          }
          /* 스크롤바 뒷 배경 설정*/
          &::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0);
            background-color: #e2e1e1;
          }
        `}
      >
        {messages.map((message, index) => (
          <div className="py-2 px-3" key={index}>
            {message.sender === "bot" ? (
              <div className="flex flex-col mb-2">
                <div className="mr-1">
                  <div className="w-10 rounded-full">
                    {/* <img
                        src={chatGPTimg}
                        alt="chatGPT"
                        css={css`
                          width: 1.5rem;
                          height: 1.5rem;
                          margin-bottom: 0.5rem;
                        `}
                      /> */}
                  </div>
                  {/* <p className="text-gray-600 text-xs font-semibold">ChatGPT</p> */}
                </div>

                <div className="w-full py-2 px-3 bg-[#74AA9C]">
                  {/* <p className="text-sm text-teal">Sylverter Stallone</p> */}
                  <p className="text-sm mt-1">{message.text}</p>
                  <p className="text-right text-xs text-grey-dark mt-1">
                    {dayjs(new Date()).format("HH:mm")}
                  </p>
                </div>

                {isLoading === true ? (
                  <li className="flex items-center text-xs text-gray-400">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only"></span>
                    </div>
                    불러오는 중입니다...
                  </li>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div className="flex justify-end mb-2">
                <div className="w-full py-2 px-3 bg-cardPink">
                  {/* <p className="text-sm text-teal">Sylverter Stallone</p> */}
                  <p className="text-sm mt-1">{message.text}</p>
                  <p className="text-right text-xs text-grey-dark mt-1">
                    {dayjs(new Date()).format("HH:mm")}
                  </p>
                </div>

                {/* <div className="ml-2">
                        <div className="w-10 rounded-full m-auto">
                          <img
                            src={`${URL}${currentFarmUser?.profile_image}`}
                            alt=""
                            css={css`
                              width: 2.5rem;
                              height: 2.5rem;
                              border-radius: 10rem;
                            `}
                          />
                        </div>
                        <p className="text-gray-600 text-xs font-semibold">{currentFarmUser.name}</p>
                      </div> */}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* <div className="chat-footer opacity-50">Delivered</div> */}

      <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
        {/* <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button> */}
        <button onClick={() => toast.error("현재 준비중입니다.")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <input
          type="text"
          // placeholder="Message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
          name="message"
          required
          onKeyDown={handlekeyPress}
        />
        {/* <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button> */}
        <button onClick={handleSendMessage}>
          <svg
            className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
