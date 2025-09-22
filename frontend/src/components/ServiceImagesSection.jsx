import React from 'react';

const ServiceImagesSection = () => {
  return (
    <section className="bg-white dark:bg-black pb-12 lg:pb-24 overflow-hidden transition-colors duration-200">
      <div className="px-4 sm:px-8 lg:px-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-6">
            <div className="flex-1 aspect-square lg:aspect-[1/1] relative">
              <img 
                src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/93fb/8ca7/aced0c0c489b720166226826d06d4a4a?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=makA4cJEqBlZ~PmxVsvsD5K0~LFDm2968JoSq02OsREvl3kxDmqnDQVeVk~ZcGyerjx5qlR4qZNd89w6cIRkUrht5ajP8JJqEt7vn5i5XQcYkLjAYQlwXXlzc678~PD2gy9LlN5d4a59x6arbCqwVP5f1n3AFN51CyMuuulGXyvjzRzG91SK6X3emhcsjJSOzgrmWDDcqUXOt8vkvqPJuMUa3u0ORNmIYZBb5Mdm4sr3PFYadFF-MwoQlHOmE1nC5GDbEEbdj28DyUaekz2u-pClC7VHa9mufjf0g~6Y248sVcm5qL3kNTRPV6wGFrHXZ7DCidmojdQ2xdhjMFNMLg__"
                alt="Professionals in a modern office environment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 aspect-square lg:aspect-[1/1] relative">
              <img 
                src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/1949/c7a8/ee1d5213102ee7867a9afdaffcedf84e?Expires=1759104000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=X8~LbPmlPnPzVgGfiP0pOwxhmG9EYlIiKL~Yb7M-jHeaZoX-y4hkWrHFpvZzm3VTGzHnkZKfN4-FjMQvkQlBGboLylfeNiFe6FnE74xNaeNLR-4yiLn6mOjKiqyOAYO6fPwyNgXct6tz0teRbrbvhZy7nqIm0TTGrS-YiPDP3lgdUXaddkTxn5YzGwvwPydp7NuphWWg2na~OdppN7mLuVk7Jse4C2HZhjUKAnHThuZAaMNW1GaMEmfzdV8pKzWPlN1nceOxiIkQdjoo7a4vpx2jtzW72c3pI-USb2rQZsofP-GPvKX8OKV67yhNDAx~RVeS80hIym03LQgY2oEKwQ__"
                alt="A job seeker reviewing their profile on a laptop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceImagesSection;
