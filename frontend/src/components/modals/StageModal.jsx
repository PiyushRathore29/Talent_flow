import React, { useState, useEffect } from 'react';
import { X, Users, ClipboardList } from 'lucide-react';

const StageModal = ({ isOpen, onClose, onSave, stage }) => {
  const [name, setName] = useState('');
  const [nodeType, setNodeType] = useState('candidate');

  useEffect(() => {
    if (isOpen) {
      setName(stage ? stage.name : '');
      setNodeType(stage ? stage.nodeType || 'candidate' : 'candidate');
    }
  }, [stage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ 
        name: name.trim(), 
        id: stage ? stage.id : null,
        nodeType: nodeType
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold font-inter text-primary-500 mb-6">
          {stage ? 'Edit Stage' : 'Add New Stage'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="stage-name" className="block text-sm font-medium text-gray-700 font-inter">Stage Name</label>
              <input
                type="text"
                id="stage-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                required
                autoFocus
              />
            </div>
            
            {!stage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 font-inter mb-3">Stage Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    nodeType === 'candidate' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="nodeType"
                      value="candidate"
                      checked={nodeType === 'candidate'}
                      onChange={(e) => setNodeType(e.target.value)}
                      className="sr-only"
                    />
                    <Users className={`w-6 h-6 mb-2 ${nodeType === 'candidate' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${nodeType === 'candidate' ? 'text-blue-600' : 'text-gray-700'}`}>
                      Default Stage
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Regular candidate progression
                    </span>
                  </label>
                  
                  <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    nodeType === 'assessment' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="nodeType"
                      value="assessment"
                      checked={nodeType === 'assessment'}
                      onChange={(e) => setNodeType(e.target.value)}
                      className="sr-only"
                    />
                    <ClipboardList className={`w-6 h-6 mb-2 ${nodeType === 'assessment' ? 'text-orange-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${nodeType === 'assessment' ? 'text-orange-600' : 'text-gray-700'}`}>
                      Assessment Stage
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Includes online assessment
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-400 hover:bg-primary-400/90">
              {stage ? 'Save Changes' : 'Add Stage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StageModal;
