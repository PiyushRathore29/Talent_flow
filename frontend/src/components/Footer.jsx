import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary-500 text-white overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-24 py-12 lg:py-24 min-h-screen lg:min-h-[10.5rem] flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="font-impact font-black uppercase text-white leading-none text-display">
              TALENT FLOW©
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:gap-12">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
            <div className="grid grid-cols-2 lg:flex lg:gap-16 gap-8 flex-1">
              <div className="flex flex-col items-start lg:items-center gap-4 lg:gap-6">
                <p className="text-medium font-times italic text-white/60">
                  (Navigate)
                </p>
                <div className="flex flex-col gap-3 lg:gap-4">
                  <a
                    href="/"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Home
                  </a>
                  <a
                    href="/jobs"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Jobs
                  </a>
                  <a
                    href="/docs"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Docs
                  </a>
                  <a
                    href="#contact"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Contact
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6">
                <p className="text-medium font-times italic text-white/60">
                  (Resources)
                </p>
                <div className="flex flex-col gap-3 lg:gap-4">
                  <a
                    href="#blog"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Blog
                  </a>
                  <a
                    href="#help"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Help Center
                  </a>
                  <a
                    href="#pricing"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Pricing
                  </a>
                  <a
                    href="#security"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Security
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6">
                <p className="text-medium font-times italic text-white/60">
                  (Legal)
                </p>
                <div className="flex flex-col gap-3 lg:gap-4">
                  <a
                    href="#privacy"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#terms"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6">
                <p className="text-medium font-times italic text-white/60">
                  (Socials)
                </p>
                <div className="flex flex-col gap-3 lg:gap-4">
                  <a
                    href="#linkedin"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#twitter"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Twitter
                  </a>
                  <a
                    href="#facebook"
                    className="text-body font-inter font-semibold text-white hover:opacity-70 transition-opacity"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col items-start sm:items-center group cursor-pointer">
              <span className="text-nav font-inter font-semibold text-white group-hover:opacity-70 transition-opacity">
                Terms of Service
              </span>
              <div className="w-full h-0.5 bg-white group-hover:opacity-70 transition-opacity" />
            </div>

            <div
              className="flex flex-col items-start sm:items-center group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="text-nav font-inter font-semibold text-white group-hover:opacity-70 transition-opacity">
                Back to Top
              </span>
              <div className="w-full h-0.5 bg-white group-hover:opacity-70 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
