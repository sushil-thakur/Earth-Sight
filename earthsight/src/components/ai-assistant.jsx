import { useRef } from "react"
import { Bot, User, Upload, Send } from "lucide-react"

export function AIAssistant({ messages, input, isProcessing, onInputChange, onSend, onFileUpload }) {
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)

  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div
        className="relative backdrop-blur-xl bg-white/95 rounded-3xl shadow-xl border border-emerald-100 flex flex-col overflow-hidden"
        style={{ height: "600px" }}
      >
        {/* Chat Header */}
        <div className="p-6 border-b border-emerald-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AI Assistant
            </h3>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload PDF
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={onFileUpload} className="hidden" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 animate-slide-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {message.role === "assistant" && (
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] shadow-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30"
                    : "bg-emerald-50/80 border border-emerald-200 text-slate-800"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-3 animate-slide-in">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 animate-pulse shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl shadow-lg">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce shadow-lg shadow-emerald-400/50"
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
        <div className="p-6 border-t border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSend()}
              placeholder="Ask about property predictions..."
              className="flex-1 px-5 py-3.5 rounded-xl bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
            />
            <button
              onClick={onSend}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}