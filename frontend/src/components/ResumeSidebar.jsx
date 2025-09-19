import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ResumeSidebar = ({ onClose, candidate }) => {
  if (!candidate) return null;

  return (
    <motion.div
      key="resume-sidebar"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200"
    >
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
          <p className="text-sm text-gray-500">Resume Preview</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="flex-1 bg-gray-100">
        <iframe
          src={candidate.resumeUrl}
          title={`${candidate.name}'s Resume`}
          className="w-full h-full border-0"
        />
      </div>
    </motion.div>
  );
};

export default ResumeSidebar;
