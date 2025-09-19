import React from 'react';

const ProcessStep = ({ stepNumber, category, title, description1, description2, image, imageOnLeft = true }) => {
  const imageSection = (
    <div className="flex-1 aspect-[4/3] lg:aspect-[16/12] relative bg-primary-50">
      <img 
        src={image}
        alt={`${title} process step`}
        className="w-full h-full object-cover"
      />
    </div>
  );

  const contentSection = (
    <div className="flex-1 bg-primary-50 p-8 lg:p-24 flex flex-col justify-between aspect-[4/3] lg:aspect-[16/12]">
      <div className="flex flex-col gap-6 lg:gap-12">
        <h3 className="font-impact font-black uppercase text-primary-500 leading-none text-display-sm lg:text-heading tracking-tight">
          {stepNumber}
        </h3>
        
        <div className="flex flex-col gap-6 lg:gap-8">
          <p className="text-medium font-times italic text-primary-500/60">
            ({category})
          </p>
          <h4 className="text-subheading lg:text-heading-sm font-inter font-semibold text-primary-500 leading-tight tracking-tighter">
            {title}
          </h4>
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <p className="text-body font-inter text-primary-500/60 leading-relaxed flex-1">
              {description1}
            </p>
            <p className="text-body font-inter text-primary-500/60 leading-relaxed flex-1">
              {description2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessSection = () => {
  const processSteps = [
    {
      stepNumber: "01",
      category: "Sign Up",
      title: "Create Your Profile.",
      description1: "For job seekers, build a standout profile that showcases your skills and experience. For employers, create a compelling company page to attract top talent.",
      description2: "Our intuitive onboarding makes it easy to get started in minutes, setting the stage for successful connections.",
      image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/a108/24b2/49adeb8d124fb8bb7ff8ca94b4ce377d?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mBxxrRU~ca3yc~EkAZqZrJGaRe40~lixy1kPS3gTBDqMzICgSD1Ti07frvCSgUVTiw3v6aFoODLGRhAvj6gPwqxY2eHyRJZdoDOV7jA7HvCtgMmlLvqw4eaf4NAe3S2B3FszEYen9zd1sSu~4LjUt6V7FJwzzcpUsZbblUzchNOdIEUiNlHpTr7MCDYzwYOs6N8uUuqytdTW~q8nh5ZcFjPxImprnHztKfmFLOHg4Py~nc5KGd3CJw4U93oIbp6yZ6WvZU41WgZ0mzkrekCo06n9z4IoQk9UBnLaIFgD1uymYwkCZ3Me4qXe~ZCOaoWSCL7HDWyIS~j8svCXv80fRQ__",
      imageOnLeft: true
    },
    {
      stepNumber: "02",
      category: "Discover",
      title: "Find Your Perfect Match.",
      description1: "Our AI-powered platform intelligently matches candidates with relevant job openings. Job seekers can browse curated lists, while employers receive a shortlist of qualified applicants.",
      description2: "This data-driven approach eliminates the noise, allowing both sides to focus on opportunities with the highest potential for success.",
      image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/4f26/472b/6c7ebee4d7726508f7db3870fb8c59a8?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ILgC1E--AuiKTxxB0~~8Sf6RXv3x7mGvQfmlYivjg-XLNTD44KeILKBgfzbzc~AfnVdlQJ0sub362-kWAhDYRyQVE3A8G9mqJWmDDIxkUoygzb4OZrvxMUrWbf7Jp~2rdYL72Knar3oJSMecISEsGlCsAEq42GCxO0rBuC2q9Diu3essZxo2Kkf3ueFkWyP8QawArt9SI11TGYz2bHauELxhDm0OWJTRRT4~k6UP-vx12BopOWJZuQq1iAW33WwLfTrfCKrPgx6-E9QR0EekedBkp8Yf~Js0fbSDlDzWehJgttZqv6-25NaqX67tNPJj81NYRwW-jGKkLD4PLWG2IQ__",
      imageOnLeft: false
    },
    {
      stepNumber: "03",
      category: "Connect",
      title: "Interview & Collaborate.",
      description1: "Once a match is made, our platform facilitates seamless communication. Schedule interviews, exchange messages, and manage the entire hiring process through our integrated tools.",
      description2: "We provide the infrastructure for meaningful conversations, helping you move from initial contact to a formal offer efficiently.",
      image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/0d6a/5d26/11bd3b125c747fdc4df64166208d7bfb?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=DXgcAtMll0mn54YTpi2U~xcVnpZ2w4OnHOEvkRctsCepJ918VJ6fEproPo64f7uDDdow2cbBiQzjg6n2iEwYefY2SWpgpOWZ0vrv3JxZCrwytTTnc2rcUKZ6skSYMcWl9xyZrnsDK5ux1Mm~imoB9AQjNVYEoy6GTC9NNIJs06~IXtT~AgZ0WkVC7AAZlQB-qXtqY9DnaMMH5jaxopmNfIf6L-qZISpxd6XdyecHKNyAVS7Ioj6hnw9W79jGKWlfwPcZQ1pJEAe1XJGkxQUaKuqEsdtowqxYt7~c9UOmL2r8Z4I-xIiZsTU2l6wQky0~BHh4aEp3gvoXQgSUAxxyBg__",
      imageOnLeft: true
    },
    {
      stepNumber: "04",
      category: "Succeed",
      title: "Get Hired & Grow.",
      description1: "Congratulations! Whether you've landed your dream job or hired a key team member, the journey doesn't end here. We provide resources for onboarding and professional development.",
      description2: "We are committed to your long-term success, offering guidance and support to help you thrive in your new role or build a world-class team.",
      image: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/ec49/e7a4/e32a2789d9dc1a6e066b1579c7230724?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Z2U~WB~47xD-ScBcupzR9ZGSMwF0K-5AjP9z0bllbbs9e5BbQoz--vMjL7eY7JeUPe-iXsMsgHdIPbnVQ8Hxv4LMTmS-5~qbrksrAyJiKj8ikY3vdOIwLSOBt4R7NwTxEMmpCdMwS-aDPODL2R7sku8eJXOITvczs5JO85ZFE9HXDDlQzroOjrNjuF7hHcWPFszYIS2UELHisgBfftXF0Bt-BrP822H0IMsM1YwT~D9kst7kxFUmpSn9GhwEamreztyxhILjOHv05QeLS-1MR973H6yZ6D5hx8at2v6HdoRolbcnXANwLlD3H8b300yBXOjnwIy9n2t1RbsZEFoWCQ__",
      imageOnLeft: false
    }
  ];

  return (
    <section className="bg-white py-12 lg:py-24 overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 lg:mb-24 gap-4">
            <div className="flex items-center gap-8 lg:gap-24">
              <p className="text-medium font-times italic text-primary-500/60">
                (How it works)
              </p>
              <p className="text-medium font-times italic text-primary-500/60">
                (02)
              </p>
            </div>
          </div>
          
          <div className="mb-12 lg:mb-24">
            <h2 className="font-impact font-black uppercase text-primary-500 leading-none mb-4 lg:mb-8 text-hero tracking-tight">
              PROCESS
            </h2>
            <p className="text-heading font-inter font-semibold text-primary-500 leading-tight max-w-4xl">
              Our streamlined process makes hiring simple, fast, and effective.
            </p>
          </div>
          
          <div className="flex flex-col gap-0">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                stepNumber={step.stepNumber}
                category={step.category}
                title={step.title}
                description1={step.description1}
                description2={step.description2}
                image={step.image}
                imageOnLeft={step.imageOnLeft}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
