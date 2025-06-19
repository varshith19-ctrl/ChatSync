import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                theme === t ? "bg-base-200" : "hover:bg-base-200/50"
              }`}
              onClick={() => setTheme(t)}
            >
              <div className="w-full h-8 rounded-md overflow-hidden border">
                <iframe
                  title={t}
                  className="w-full h-full"
                  srcDoc={`
                    <html data-theme="${t}">
                      <head>
                        <link href="https://cdn.jsdelivr.net/npm/daisyui@3.8.0/dist/full.css" rel="stylesheet" />
                        <style>
                          html, body { margin: 0; padding: 0; height: 100%; }
                          .preview-grid {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 2px;
                            padding: 4px;
                            height: 100%;
                          }
                          .preview-grid div {
                            border-radius: 4px;
                            height: 100%;
                          }
                        </style>
                      </head>
                      <body>
                        <div class="preview-grid">
                          <div class="bg-primary"></div>
                          <div class="bg-secondary"></div>
                          <div class="bg-accent"></div>
                          <div class="bg-neutral"></div>
                        </div>
                      </body>
                    </html>
                  `}
                />
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                          message.isSent
                            ? "bg-primary text-primary-content"
                            : "bg-base-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-[10px] mt-1.5 ${
                            message.isSent
                              ? "text-primary-content/70"
                              : "text-base-content/70"
                          }`}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
