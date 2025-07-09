import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  summarizeMode: false,
  summaryMessage: null,

  // NEW: holds unread messages for each user
  unreadMessages: {},

  setSummarizeMode: (val) => set({ summarizeMode: val }),
  setSummaryMessage: (msg) => set({ summaryMessage: msg }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    const isScheduled = !!messageData.scheduledTime;

    try {
      if (isScheduled) {
        await axiosInstance.post(
          `/messages/schedule/${selectedUser._id}`,
          messageData
        );
        toast.success("Message scheduled successfully");
        return;
      }

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isScheduled
            ? "Failed to schedule message"
            : "Failed to send message")
      );
    }
  },

  // UPDATED: adds unread message tracking
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!isMessageFromSelectedUser) {
        // Save as unread
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [newMessage.senderId]: [
              ...(state.unreadMessages[newMessage.senderId] || []),
              newMessage,
            ],
          },
        }));
        return;
      }

      // If the message is from the selected user, show it directly
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  // UPDATED: clears unread when selecting a user
  setSelectedUser: (selectedUser) => {
    set((state) => {
      const unreadCopy = { ...state.unreadMessages };
      if (selectedUser && unreadCopy[selectedUser._id]) {
        delete unreadCopy[selectedUser._id];
      }
      return {
        selectedUser,
        unreadMessages: unreadCopy,
      };
    });
    // NEW: also tell server to mark as read
  if (selectedUser) {
    axiosInstance
      .post(`/messages/markAsRead/${selectedUser._id}`)
      .catch((err) => console.error("Failed to mark messages as read", err));
  }
  },
}));
