import { useRef } from "react"
import { Bot, User, Upload, Send } from "lucide-react"

export function AIAssistant({ messages, input, isProcessing, onInputChange, onSend, onFileUpload }) {
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div
        className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: "600px" }}
      >
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/20">
              <Bot className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              AI Assistant
            </h3>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-violet-500/30"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload PDF
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={onFileUpload} className="hidden" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 animate-slide-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {message.role === "assistant" && (
                <div className="p-2.5 rounded-xl bg-indigo-500/20 shadow-lg shadow-indigo-500/20">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] shadow-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 shadow-violet-500/30"
                    : "backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 shadow-slate-900/50"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="p-2.5 rounded-xl bg-violet-500/20 shadow-lg shadow-violet-500/20">
                  <User className="w-5 h-5 text-violet-400" />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-3 animate-slide-in">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 animate-pulse shadow-lg shadow-indigo-500/20">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl shadow-lg shadow-slate-900/50">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce shadow-lg shadow-indigo-400/50"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSend()}
              placeholder="Ask about property predictions..."
              className="flex-1 px-5 py-3.5 rounded-xl bg-slate-800/50 border border-indigo-500/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white placeholder:text-slate-500"
            />
            <button
              onClick={onSend}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 transition-all hover:scale-105 shadow-lg shadow-violet-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}