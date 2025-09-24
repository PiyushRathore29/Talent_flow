import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, AtSign } from 'lucide-react';

// Hardcoded HR names for mentions
const HR_USERS = [
  { id: 1, name: 'JohanSeong3342', displayName: 'Johan Seong', role: 'Senior HR Manager' },
  { id: 2, name: 'SarahWilsonHR', displayName: 'Sarah Wilson', role: 'HR Specialist' },
  { id: 3, name: 'MikeJohnsonHR', displayName: 'Mike Johnson', role: 'Talent Acquisition' },
  { id: 4, name: 'LisaChenHR', displayName: 'Lisa Chen', role: 'HR Director' },
  { id: 5, name: 'AlexRodriguezHR', displayName: 'Alex Rodriguez', role: 'Recruiter' },
  { id: 6, name: 'EmilyDavisHR', displayName: 'Emily Davis', role: 'HR Coordinator' },
  { id: 7, name: 'DavidWilliamsHR', displayName: 'David Williams', role: 'Senior Recruiter' },
  { id: 8, name: 'JessicaBrownHR', displayName: 'Jessica Brown', role: 'HR Business Partner' }
];

const NotesModal = ({ isOpen, onClose, candidateId, candidateName, onNoteAdded }) => {
  const [noteText, setNoteText] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionStartPos, setMentionStartPos] = useState(-1);
  const [saving, setSaving] = useState(false);
  
  const textareaRef = useRef(null);
  const mentionsRef = useRef(null);

  useEffect(() => {
    if (mentionSearch) {
      const filtered = HR_USERS.filter(user => 
        user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        user.displayName.toLowerCase().includes(mentionSearch.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(HR_USERS);
    }
  }, [mentionSearch]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    const position = e.target.selectionStart;
    
    setNoteText(text);
    setCursorPosition(position);

    // Check for @ symbol
    const textBeforeCursor = text.substring(0, position);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      // Check if we're still in a mention (no spaces after @)
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setShowMentions(true);
        setMentionSearch(textAfterAt);
        setMentionStartPos(lastAtIndex);
      } else {
        setShowMentions(false);
        setMentionSearch('');
        setMentionStartPos(-1);
      }
    } else {
      setShowMentions(false);
      setMentionSearch('');
      setMentionStartPos(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowMentions(false);
      setMentionSearch('');
      setMentionStartPos(-1);
    }
  };

  const insertMention = (user) => {
    const beforeMention = noteText.substring(0, mentionStartPos);
    const afterMention = noteText.substring(cursorPosition);
    const mentionText = `@${user.name}`;
    
    const newText = beforeMention + mentionText + ' ' + afterMention;
    setNoteText(newText);
    
    setShowMentions(false);
    setMentionSearch('');
    setMentionStartPos(-1);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeMention.length + mentionText.length + 1;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || saving) return;

    setSaving(true);
    try {
      // Extract mentions from the note text
      const mentionRegex = /@(\w+)/g;
      const mentions = [];
      let match;
      
      while ((match = mentionRegex.exec(noteText)) !== null) {
        const mentionedUser = HR_USERS.find(user => user.name === match[1]);
        if (mentionedUser) {
          mentions.push({
            userId: mentionedUser.id,
            username: mentionedUser.name,
            displayName: mentionedUser.displayName
          });
        }
      }

      // Save note to IndexedDB
      const noteData = {
        candidateId: parseInt(candidateId),
        text: noteText.trim(),
        mentions: mentions,
        authorId: 1, // Default HR user ID
        authorName: 'Current HR User',
        createdAt: new Date().toISOString()
      };

      // Import dbHelpers dynamically to avoid issues
      const { dbHelpers } = await import('../lib/database');
      console.log('📝 [NotesModal] Saving note data:', noteData);
      const noteId = await dbHelpers.addCandidateNote(noteData);
      console.log('📝 [NotesModal] Note saved with ID:', noteId);

      // Call the callback to refresh notes
      if (onNoteAdded) {
        onNoteAdded(noteData);
      }

      // Reset form and close modal
      setNoteText('');
      onClose();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderNotePreview = () => {
    if (!noteText) return null;

    // Replace mentions with highlighted spans
    const parts = noteText.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.substring(1);
        const user = HR_USERS.find(u => u.name === username);
        return (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-1 rounded font-medium"
          >
            {user ? `@${user.displayName}` : part}
          </span>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Note
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                For {candidateName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="relative">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={noteText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your note here... Use @ to mention other HR team members"
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              rows={4}
            />

            {/* Mentions Dropdown */}
            {showMentions && (
              <div
                ref={mentionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto z-10"
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => insertMention(user)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none transition-colors"
                    >
                      <div className="flex items-center">
                        <AtSign className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            @{user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.displayName} • {user.role}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                    No HR users found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Note Preview */}
          {noteText && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</div>
              <div className="text-gray-900 dark:text-white text-sm leading-relaxed">
                {renderNotePreview()}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!noteText.trim() || saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Add Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotesModal;