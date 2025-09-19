import React, { useState, useRef } from 'react';
import { useCandidates } from '../hooks/useCandidates';
import { users } from '../data/usersData';
import { Send } from 'lucide-react';

const NotesSection = ({ candidate }) => {
  const [noteText, setNoteText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef = useRef(null);
  const { addNoteToCandidate } = useCandidates();

  const handleInputChange = (e) => {
    const text = e.target.value;
    setNoteText(text);

    const lastAt = text.lastIndexOf('@');
    if (lastAt !== -1) {
      const query = text.substring(lastAt + 1);
      if (!query.includes(' ')) {
        const filteredUsers = users.filter(u => u.name.toLowerCase().startsWith(query.toLowerCase()));
        setSuggestions(filteredUsers);
        setShowSuggestions(filteredUsers.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user) => {
    const lastAt = noteText.lastIndexOf('@');
    const newText = `${noteText.substring(0, lastAt)}@${user.name} `;
    setNoteText(newText);
    setShowSuggestions(false);
    textareaRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteText.trim()) {
        addNoteToCandidate(candidate.id, {
            text: noteText,
            author: 'HR Manager', // Placeholder
            date: new Date().toISOString().split('T')[0]
        });
      setNoteText('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold font-inter text-primary-500 mb-6">Internal Notes</h2>
      <div className="space-y-6 mb-8">
        {candidate.notes.map(note => (
          <div key={note.id} className="bg-primary-50 p-4 rounded-lg">
            <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: note.text.replace(/@(\w+\s\w+)/g, '<strong class="text-primary-400">@$1</strong>') }}></p>
            <div className="text-right text-xs text-gray-500 mt-2">
              - {note.author} on {new Date(note.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          placeholder="Add a note... use @ to mention a colleague."
        />
        <button type="submit" className="absolute top-3 right-3 text-gray-400 hover:text-primary-400 transition-colors">
          <Send className="w-5 h-5" />
        </button>
        {showSuggestions && (
          <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
            {suggestions.map(user => (
              <div
                key={user.id}
                onClick={() => handleSuggestionClick(user)}
                className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {user.name}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default NotesSection;
