import React from 'react';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const TeamMember = ({ image, name, role, description, bgColor = '#EEEEEE' }) => {
  return (
    <div className="flex-1 min-w-0 max-w-sm">
      <div className="aspect-[3/4] relative group" style={{ backgroundColor: bgColor }}>
        <div className="w-full h-full relative overflow-hidden">
          <img 
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="absolute bottom-4 right-4 flex gap-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
            <Twitter className="w-5 h-5 text-white" />
          </div>
          <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
            <Facebook className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="px-4 lg:px-8 py-8 lg:py-12">
        <div className="mb-6">
          <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400 mb-2 transition-colors duration-200">
            ({role})
          </p>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-tight text-heading-sm whitespace-pre-line transition-colors duration-200">
            {name}
          </h3>
          <p className="text-small font-inter text-primary-500/60 dark:text-gray-300 leading-relaxed transition-colors duration-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const teamMembers = [
    {
      image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/b3f9/f6a2/5ac7cbfd8fdddac1b5a24a615b2e42c0?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QVzvVz~oXaFCi7GvPSi5DECCUiYHSuQiM1Sz3PWd0gk4grcRVPpDqYkJpMh1Pu9Atx9r6K-J-GvjH1tG~hOToU2V8Y8is0lv6HHcpqUx3Z1V01wTDe~b7uxZ3c8XX3mc~trYq4id~TiYlqzEZiqRLIb7ZiFqUaVVMeTfjqF3xZlC6vghlruzbiDSx4jlwyZknbNypm1BKLRXWTH5lg81s9IE9DStcy9SC2ZQPtmcxhlnEErjEr3DWtOGgNiRlN-VgA57IQw~n54~hsELr-F85B08brxisCptYkI1zU-jQV3jMcavsHKbrmNBXeFUMcmAaHKSs0WUTKQbSYuFTAWwUA__",
      name: "JANE\nDOE",
      role: "CEO & Founder",
      description: "Jane is a visionary leader with over a decade of experience in HR technology. Her passion for connecting people with opportunities drives our mission to revolutionize the hiring landscape.",
      bgColor: '#EEEEEE'
    },
    {
      image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/a78f/9600/61b6b65339c30076e4d81a05c84293df?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=AcJWaWwCKkPMl7mDfX4w-Ff2bb~SKxoXN6dmyCnDyLqm10d~n65vQtZuZVqVYkzlJDK9XVZZj0oRNkI3iJAyeDmglSouI1xxawHC-Fzxhp3FfEtrxetjvbcw1bC8A0pSdy6IN43iqcMEz~9R20-mLxoOyh2wbq~C-X92FzhOYykThFnFbXaykjZvoswJxhvodJX0K0Mqjb13gBz1FIWATwKfNxJfPe3Fnn~ccsZSMwMpl3Vw5hjEt~AUSBazvGc3YfeojHkGQ178pAxeOG~wb4paaSBP1hQ-yNRPeGqaOBN8Fh-4w-lnVUa2YeuRbOWqAcGJF6esfwsnGbua26kirQ__",
      name: "JOHN\nSMITH",
      role: "Head of Engineering",
      description: "With a passion for technology and scalability, John leads our engineering team to build a robust and seamless platform. His attention to detail ensures an exceptional user experience.",
      bgColor: '#F8F8F8'
    },
    {
      image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/8d91/c4fe/e3d607088fa8040ba078f2ee78901421?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=F04THzuF2xaDgRzLGT~9Z6bZDsNR8vTalfxErKkKFq667N2jhO2jUKGBvmWKg-VVZl--lyIYYQU-G2hHN0s6KxAaCwFrwsH8X8uTJx5ODsuaMQgwls5prMLd~PyxhPi7KuT0TvV0EHrRg2NKCKziL6oSatM09-yJK~szCNgCQ8rfJRxhIm8s5IjWrrbiptpynzFi9l-ijHTPgoy2fk~6jPNp1XFnVwPHfDq-kf4xmQoDEcoWwEBG27LzGO0w2TKSVx38gPtYdegxN3sCtfDh7~6K9KPlCLLbpICGNn1pWuMDcYrSdmok5TvHZOrKyBCJkIyJf~XGkG5pcpCKlyVmnA__",
      name: "EMILY\nCHEN",
      role: "Head of Product",
      description: "Emily specializes in creating intuitive and engaging user experiences. Her empathetic approach allows her to understand the needs of both job seekers and recruiters to build a world-class product.",
      bgColor: '#EEEEEE'
    }
  ];

  return (
    <section className="bg-white dark:bg-black overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400">
                (Our Team)
              </p>
              <p className="text-medium font-times italic text-primary-500/60 dark:text-gray-400">
                (01)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h2 className="font-impact font-black uppercase text-primary-500 dark:text-white leading-none text-display transition-colors duration-200">
              EXPERTS BEHIND YOUR NEXT HIRE
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                image={member.image}
                name={member.name}
                role={member.role}
                description={member.description}
                bgColor={member.bgColor}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
