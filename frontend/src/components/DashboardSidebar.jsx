import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, Briefcase, MoreHorizontal, Edit, Archive, Trash2, Menu, X, GripVertical, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const JobActions = ({ job, onEdit, onArchive, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200">
        <MoreHorizontal className="w-5 h-5" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-100"
            onMouseLeave={() => setIsOpen(false)}
          >
            <ul className="py-1">
              <li>
                <button onClick={() => { onEdit(job); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Edit className="w-4 h-4" /> Edit
                </button>
              </li>
              <li>
                <button onClick={() => { onArchive(job.id); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Archive className="w-4 h-4" /> {job.status === 'Archived' ? 'Unarchive' : 'Archive'}
                </button>
              </li>
              <li>
                <button onClick={() => { onDelete(job.id); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarContent = ({ jobs, activeJobId, onJobSelect, onNewJob, onEditJob, onArchiveJob, onDeleteJob, onReorder, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
    
    const reorderedJobs = [...jobs];
    const draggedItem = reorderedJobs.splice(dragItem.current, 1)[0];
    reorderedJobs.splice(dragOverItem.current, 0, draggedItem);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    onReorder(reorderedJobs.map(j => j.id));
  };
  
  return (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 w-88 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-30 flex flex-col p-4 gap-4"
    >
      <div className="flex justify-between items-center p-2">
        <Logo />
        <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-200/50 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-2">
        <button
          onClick={onNewJob}
          className="w-full flex items-center justify-center gap-2 bg-primary-400 text-white px-4 py-3 rounded-lg text-sm font-inter font-semibold hover:bg-primary-400/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Job
        </button>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 bg-gray-50/50 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
      
      <hr className="border-gray-200/80 mx-2" />

      <nav className="flex-1 overflow-y-auto px-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Job Openings</p>
        <ul>
          {filteredJobs.map((job, index) => {
            const isActive = job.id.toString() === activeJobId;
            return (
              <li 
                key={job.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`rounded-lg mb-1 group/item ${isActive ? 'bg-primary-400/10' : 'hover:bg-gray-100/80'}`}
              >
                <div
                  className="flex items-center gap-3 p-2 rounded-lg transition-colors text-left w-full cursor-pointer"
                  onClick={() => onJobSelect(job.id)}
                >
                  <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing group-hover/item:text-gray-400" />
                  <div className="flex-1 overflow-hidden">
                    <p className={`font-semibold text-sm truncate ${isActive ? 'text-primary-500' : 'text-gray-800'} ${job.status === 'Archived' ? 'text-gray-400 line-through' : ''}`}>
                      {job.title}
                    </p>
                    <span className={`text-xs font-medium ${job.status === 'Archived' ? 'text-gray-400' : (isActive ? 'text-primary-400' : 'text-teal-600')}`}>
                      {job.status}
                    </span>
                  </div>
                  <JobActions job={job} onEdit={onEditJob} onArchive={onArchiveJob} onDelete={onDeleteJob} />
                </div>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Menu at bottom */}
      <div className="mt-auto">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100/80 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.companyName}
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};


const DashboardSidebar = (props) => {
  return (
    <>
      <AnimatePresence>
        {props.isOpen && <SidebarContent {...props} />}
      </AnimatePresence>
      {!props.isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 left-4 z-30"
        >
          <button onClick={props.onToggle} className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200">
            <Menu className="w-6 h-6 text-primary-500" />
          </button>
        </motion.div>
      )}
    </>
  );
};

export default DashboardSidebar;
