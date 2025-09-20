import React, { useState, useRef } from 'react';
import { useCandidates } from '../hooks/useCandidates';
import { teamMembers } from '../data/candidatesData';
import { Send, AtSign } from 'lucide-react';

const NotesSection = ({ candidate }) => {
  const [noteText, setNoteText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const { addNoteToCandidate } = useCandidates();

  const handleInputChange = (e) => {
    const text = e.target.value;
    const cursor = e.target.selectionStart;
    setNoteText(text);
    setCursorPosition(cursor);

    // Find @ mentions
    const lastAt = text.lastIndexOf('@', cursor - 1);
    if (lastAt !== -1) {
      const textAfterAt = text.substring(lastAt + 1, cursor);
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('@')) {
        const query = textAfterAt.toLowerCase();
        const filteredMembers = teamMembers.filter(member => 
          member.name.toLowerCase().includes(query)
        );
        setSuggestions(filteredMembers);
        setShowSuggestions(filteredMembers.length > 0 && query.length >= 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (member) => {
    const lastAt = noteText.lastIndexOf('@', cursorPosition - 1);
    const beforeAt = noteText.substring(0, lastAt);
    const afterCursor = noteText.substring(cursorPosition);
    const newText = `${beforeAt}@${member.name} ${afterCursor}`;
    
    setNoteText(newText);
    setShowSuggestions(false);
    
    // Focus and set cursor position
    setTimeout(() => {
      textareaRef.current.focus();
      const newCursorPos = beforeAt.length + member.name.length + 2;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const extractMentions = (text) => {
    const mentionRegex = /@([A-Za-z]+\s[A-Za-z]+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedName = match[1];
      const member = teamMembers.find(m => m.name === mentionedName);
      if (member) {
        mentions.push(member.id);
      }
    }
    
    return mentions;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteText.trim()) {
      const mentions = extractMentions(noteText);
      addNoteToCandidate(candidate.id, {
        text: noteText,
        author: 'HR Manager', // In a real app, this would be the current user
        date: new Date().toISOString().split('T')[0],
        mentions
      });
      setNoteText('');
    }
  };

  const renderNoteText = (text, mentions) => {
    if (!mentions || mentions.length === 0) {
      return text.replace(/@([A-Za-z]+\s[A-Za-z]+)/g, '<span class="text-primary-600 font-medium">@$1</span>');
    }
    
    return text.replace(/@([A-Za-z]+\s[A-Za-z]+)/g, (match, name) => {
      const member = teamMembers.find(m => m.name === name);
      if (member && mentions.includes(member.id)) {
        return `<span class="text-primary-600 font-medium hover:text-primary-700 cursor-pointer" title="${member.role} - ${member.email}">@${name}</span>`;
      }
      return `<span class="text-primary-600 font-medium">@${name}</span>`;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold font-inter text-primary-500 mb-6">Internal Notes</h2>
      
      {candidate.notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AtSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No notes yet. Add the first note below.</p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {candidate.notes.map(note => (
            <div key={note.id} className="bg-primary-50 p-4 rounded-lg border border-primary-100">
              <p 
                className="text-gray-800 leading-relaxed" 
                dangerouslySetInnerHTML={{ 
                  __html: renderNoteText(note.text, note.mentions) 
                }}
              />
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary-200">
                <span className="text-sm font-medium text-primary-600">{note.author}</span>
                <time className="text-xs text-gray-500">
                  {new Date(note.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={noteText}
            onChange={handleInputChange}
            onSelect={(e) => setCursorPosition(e.target.selectionStart)}
            rows="4"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
            placeholder="Add a note... Type @ to mention a team member."
          />
          <button 
            type="submit" 
            disabled={!noteText.trim()}
            className="absolute top-3 right-3 text-gray-400 hover:text-primary-400 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {showSuggestions && (
          <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
            <div className="p-2 text-xs text-gray-500 font-medium border-b">Team Members</div>
            {suggestions.map(member => (
              <div
                key={member.id}
                onClick={() => handleSuggestionClick(member)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="font-medium text-gray-900">{member.name}</div>
                <div className="text-sm text-gray-500">{member.role}</div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default NotesSection;
