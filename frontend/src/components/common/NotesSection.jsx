import React, { useState, useEffect } from "react";
import { MessageSquare, AtSign, Clock } from "lucide-react";

// Same HR users as in NotesModal for consistency
const HR_USERS = [
  {
    id: 1,
    name: "JohanSeong3342",
    displayName: "Johan Seong",
    role: "Senior HR Manager",
  },
  {
    id: 2,
    name: "SarahWilsonHR",
    displayName: "Sarah Wilson",
    role: "HR Specialist",
  },
  {
    id: 3,
    name: "MikeJohnsonHR",
    displayName: "Mike Johnson",
    role: "Talent Acquisition",
  },
  { id: 4, name: "LisaChenHR", displayName: "Lisa Chen", role: "HR Director" },
  {
    id: 5,
    name: "AlexRodriguezHR",
    displayName: "Alex Rodriguez",
    role: "Recruiter",
  },
  {
    id: 6,
    name: "EmilyDavisHR",
    displayName: "Emily Davis",
    role: "HR Coordinator",
  },
  {
    id: 7,
    name: "DavidWilliamsHR",
    displayName: "David Williams",
    role: "Senior Recruiter",
  },
  {
    id: 8,
    name: "JessicaBrownHR",
    displayName: "Jessica Brown",
    role: "HR Business Partner",
  },
];

const NotesSection = ({ candidateId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [candidateId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { dbHelpers } = await import("../../lib/database");
      console.log(
        "📝 [NotesSection] Fetching notes for candidate:",
        candidateId
      );
      const candidateNotes = await dbHelpers.getCandidateNotes(
        parseInt(candidateId)
      );
      console.log("📝 [NotesSection] Raw notes from DB:", candidateNotes);

      // Sort by creation date (newest first)
      const sortedNotes = candidateNotes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      console.log("📝 [NotesSection] Sorted notes:", sortedNotes);
      setNotes(sortedNotes);
    } catch (error) {
      console.error("❌ [NotesSection] Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderNoteText = (text) => {
    // Replace mentions with highlighted spans
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.substring(1);
        const user = HR_USERS.find((u) => u.name === username);
        return (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-1 rounded font-medium inline-flex items-center gap-1"
            title={user ? `${user.displayName} (${user.role})` : username}
          >
            <AtSign className="w-3 h-3" />
            {user ? user.displayName : username}
          </span>
        );
      }
      return part;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
            Notes & Comments
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-impact font-bold uppercase text-primary-500 dark:text-primary-400 tracking-tight">
          Notes & Comments
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No notes yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click "Add Note" to start documenting your thoughts about this
            candidate
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              {/* Note Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {note.authorName?.charAt(0) || "H"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {note.authorName || "HR User"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(note.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Mention count indicator */}
                {note.mentions && note.mentions.length > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                    <AtSign className="w-3 h-3" />
                    {note.mentions.length} mention
                    {note.mentions.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>

              {/* Note Content */}
              <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {renderNoteText(note.text)}
              </div>

              {/* Mentioned Users Summary (if any) */}
              {note.mentions && note.mentions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Mentioned:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {note.mentions.map((mention, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        <AtSign className="w-3 h-3" />
                        {mention.displayName || mention.username}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesSection;
