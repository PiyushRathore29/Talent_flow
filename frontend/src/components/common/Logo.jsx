import React from 'react';

const Logo = () => {
  return (
    <div className="w-[160px] h-14 relative">
      <img 
        src="/assets/talent-flow.svg" 
        alt="TalentFlow" 
        className="w-full h-full object-contain filter dark:invert"
      />
    </div>
  );
};

export default Logo;
