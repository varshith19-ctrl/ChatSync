import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

const Sidebar = () => {
  // Access necessary states and actions from global stores
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    summarizeMode,
    setSummarizeMode,
    setSummaryMessage,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false); // Filter toggle state

  // Fetch users when the component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users if "show online only" toggle is on
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // Show loading skeleton while fetching users
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200"
      role="complementary" // Accessibility: defines the sidebar as complementary content
      aria-label="Sidebar with user contacts"
    >
      <div className="border-b border-base-300 w-full p-5">
        {/* Header: Contacts title */}
        <div className="flex items-center gap-2">
          <Users className="size-6" aria-hidden="true" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Toggle: Show online only */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
              aria-label="Toggle to show online users only" // Accessibility label
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>

        {/* Toggle: Summarize mode */}
        <div className="mt-2 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={summarizeMode}
              onChange={(e) => setSummarizeMode(e.target.checked)}
              className="checkbox checkbox-sm"
              aria-label="Toggle summarize mode"
            />
            <span className="text-sm">Google AI Summarize mode</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {/* User list */}
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={async () => {
              setSelectedUser(user); // Set the selected chat

              if (!summarizeMode) {
                setSummaryMessage(null);
                return;
              }

              try {
                // Fetch conversation history
                const res = await axiosInstance.get(`/messages/${user._id}`);
                const data = res.data;

                // Format messages for summarization
                const formatted = data.map((msg) =>
                  msg.sender === user._id
                    ? `User: ${msg.text}`
                    : `Me: ${msg.text}`
                );

                // Call backend to summarize conversation
                const summaryRes = await axiosInstance.post(
                  "/messages/summarize",
                  { messages: formatted }
                );

                const summary = summaryRes?.data?.summary;
                setSummaryMessage(summary || "⚠️ No summary returned.");
              } catch (err) {
                console.error(err);
                setSummaryMessage(
                  `⚠️ Failed to load summary: ${
                    err.response?.data?.error || err.message
                  }`
                );
              }
            }}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
            aria-pressed={selectedUser?._id === user._id}
            aria-label={`Select chat with ${user.fullName}`}
          >
            {/* User avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={`Profile of ${user.fullName}`}
                className="size-12 object-cover rounded-full"
                loading="lazy" // Lazy loading improves performance
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                  aria-label="Online"
                  role="status"
                />
              )}
            </div>

            {/* User details */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No online users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
