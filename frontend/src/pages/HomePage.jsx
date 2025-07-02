import { useChatStore } from "../store/useChatStore";

// Importing main layout components
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore(); // State for currently selected chat

  return (
    <div className="h-screen bg-base-200">
      {/* Page container */}
      <div className="flex items-center justify-center pt-20 px-4">
        <div
          className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]"
          role="main" // Accessibility: main content wrapper
          aria-label="Chat main content"
        >
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar with contacts */}
            <Sidebar />

            {/* Conditional rendering of chat window or empty state */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
