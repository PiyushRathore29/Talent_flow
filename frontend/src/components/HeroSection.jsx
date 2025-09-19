import React from 'react';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      <div className="pt-32 lg:pt-40 pb-12 lg:pb-24 px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12 lg:mb-24">
            <h1 className="text-hero font-impact font-black uppercase text-primary-500 leading-none mb-4 lg:mb-8 tracking-tight">
              TALENT FLOW
            </h1>
            <p className="text-heading font-inter font-semibold text-primary-500 leading-tight tracking-tight max-w-4xl">
              Connecting top talent with leading companies. Your next career move starts here.
            </p>
          </div>
          
          <div className="w-full aspect-[4/3] lg:aspect-[16/10] relative">
            <img 
              src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/4a3b/30ee/e79f13949ad11cffea0a98bbf4db0c3c?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ReyMUOsaSdsHWBsjX6l99Lh2Py08jAbUAyo2l42n1F1As1~Mm9t6cGsI06Nq6YBgrzalgvRU8fqzCy6rZ0OVX7MDPutETsl-Wx3Oj43dONoeRAu28P2YdY8T4eSJ~9e-y2EQ44pVc0Wx9Im1FCIBJu6zf9phLUzRIyYBYicO4oE6rTzN7GOZh23fdK8LPA2xCDUv~V9o4lrFEdd-erLGJ-HkGIcWa3VQswz2oLtMy8CPm~A3g62-fWzUrNiKaqyZEGyPDH9owXiSGU9mlHoZHWR~w3-MGbm27MmGQjMWZXh8r51MzQuq5swNN2BLedLnQyeTgFsnFzG~JmfCYuploA__"
              alt="Team collaborating in a modern office"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
