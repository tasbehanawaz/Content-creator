import React from 'react';

interface YouTubeBackgroundProps {
  videoTitle?: string;
  channelName?: string;
  channelAvatar?: string;
  subscriberCount?: string;
  viewCount?: string;
  uploadTime?: string;
  likes?: string;
}

export const YouTubeBackground: React.FC<YouTubeBackgroundProps> = ({
  videoTitle = "Learn Python Programming - Full Course for Beginners | Python Tutorial",
  channelName = "Programming with Mosh",
  channelAvatar = "P",
  subscriberCount = "2.47M subscribers",
  viewCount = "4,578,932 views",
  uploadTime = "Oct 26, 2018",
  likes = "57K"
}) => {
  return (
    <div className="w-full h-screen bg-white text-black overflow-hidden font-['Roboto',sans-serif]">
      {/* YouTube Header */}
      <div className="h-14 bg-white flex items-center justify-between px-4 border-b border-gray-200">
        {/* Left section */}
        <div className="flex items-center">
          {/* Menu icon */}
          <button className="p-2 mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="#030303"/>
            </svg>
          </button>
          
          {/* YouTube Logo */}
          <a href="#" className="flex items-center">
            <svg width="90" height="20" viewBox="0 0 90 20" fill="none">
              <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 1.05799e-06 14.285 0 14.285 0C14.285 0 5.35042 1.05799e-06 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
              <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              <path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z" fill="white"/>
              <path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.73397 43.8074 7.73397C43.4265 7.73397 43.156 7.94206 43.0008 8.35833C42.8432 8.77225 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z" fill="white"/>
              <path d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z" fill="white"/>
              <path d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z" fill="white"/>
              <path d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z" fill="white"/>
              <path d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z" fill="white"/>
              <path d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1106 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5534 17.8952C87.9208 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9772 7.09558C83.5558 6.2301 84.5459 5.79736 85.9499 5.79736C86.9165 5.79736 87.6597 5.97375 88.1771 6.32888C88.6945 6.684 89.059 7.23433 89.2707 7.98457C89.4824 8.7348 89.5882 9.76961 89.5882 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z" fill="white"/>
            </svg>
          </a>
        </div>

        {/* Center - Search */}
        <div className="flex-1 flex items-center justify-center max-w-2xl mx-8">
          <form className="flex w-full">
            <div className="flex flex-1 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-1 bg-white border border-gray-300 rounded-l-full text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <button className="px-6 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#030303"/>
                </svg>
              </button>
            </div>
            <button className="ml-2 p-2 bg-gray-50 rounded-full hover:bg-gray-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C10.34 3 9 4.37 9 6.07V11.93C9 13.63 10.34 15 12 15C13.66 15 15 13.63 15 11.93V6.07C15 4.37 13.66 3 12 3ZM18.5 12H17.5C17.5 15.03 15.03 17.5 12 17.5C8.97 17.5 6.5 15.03 6.5 12H5.5C5.5 15.24 7.89 17.93 11 18.41V21H13V18.41C16.11 17.93 18.5 15.24 18.5 12Z" fill="#030303"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z" fill="#030303"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#030303"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42l-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z" fill="#030303"/>
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          <button className="w-8 h-8 bg-[#00579c] rounded-full flex items-center justify-center text-white font-medium text-sm">
            J
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Primary column */}
        <div className="flex-1 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 py-6">
            <div className="flex gap-6">
              <div className="flex-1">
                {/* Video Player */}
                <div className="relative bg-black rounded-xl overflow-hidden" style={{aspectRatio: '16/9'}}>
                  <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/K5KVEU3aaeQ?start=56"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Video info */}
                <div className="mt-3">
                  <h1 className="text-[18px] font-normal leading-[26px] yt-formatted-string">
                    {videoTitle}
                  </h1>
                  
                  {/* Video stats and actions */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-gray-600 text-[14px]">
                      <span>{viewCount}</span>
                      <span className="mx-1">•</span>
                      <span>{uploadTime}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {/* Action buttons container */}
                      <div className="flex items-center">
                        {/* Like/Dislike container */}
                        <div className="flex items-center bg-gray-100 rounded-full">
                          <button className="flex items-center gap-1.5 px-3 h-9 hover:bg-gray-200 rounded-l-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H3v10h4h1h9.43c1.06 0 1.98-.74 2.2-1.78l1.34-6.29C21.23 11.82 20.18 11 18.77 11zM7 20H4v-8h3V20zm12.98-7.67l-1.34 6.29c-.1.43-.48.76-.98.76H9v-7.39l5.53-6.12c.09-.1.21-.15.34-.15.31 0 .48.26.37.54L13.6 12h5.18c.37 0 .61.38.48.72L19.98 13.33z" fill="#030303"/>
                            </svg>
                            <span className="text-[14px] font-medium text-black">{likes}</span>
                          </button>
                          <div className="w-px h-6 bg-gray-300"></div>
                          <button className="px-3 h-9 hover:bg-gray-200 rounded-r-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M17 4h-1H6.57C5.5 4 4.59 4.74 4.38 5.78L3.04 12.07C2.77 13.18 3.82 14 5.23 14H9.46l-1.52 4.94C7.62 19.97 8.46 21 9.62 21c.58 0 1.14-.24 1.52-.65L17 14h4V4h-4zM10.34 19.65c-.09.09-.21.15-.34.15-.31 0-.48-.26-.37-.54L11.4 14H5.23c-.41 0-.65-.43-.48-.78L6.09 6.92c.1-.43.48-.76.98-.76H16v7.39L10.34 19.65zM20 13h-3V5h3V13z" fill="#030303"/>
                            </svg>
                          </button>
                        </div>
                        
                        <button className="ml-2 flex items-center gap-1.5 px-3 h-9 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 5.63L20.66 12L15 18.37V15v-1h-1c-3.96 0-7.14 1-9.75 3.09c1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V9V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9l-8-9z" fill="#030303"/>
                          </svg>
                          <span className="text-[14px] font-medium text-black">Share</span>
                        </button>
                        
                        <button className="ml-2 flex items-center gap-1.5 px-3 h-9 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z" fill="#030303"/>
                          </svg>
                          <span className="text-[14px] font-medium text-black">Save</span>
                        </button>
                        
                        <button className="ml-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5zm4.5-1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5s1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5zm6 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5s1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" fill="#030303"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Channel section */}
                  <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mt-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#00579c] rounded-full flex items-center justify-center text-white font-medium text-xl mr-3">
                        {channelAvatar}
                      </div>
                      <div>
                        <div className="text-[16px] font-medium leading-5 text-black">{channelName}</div>
                        <div className="text-[12px] text-gray-600 mt-0.5">{subscriberCount}</div>
                      </div>
                    </div>
                    <button className="bg-[#cc0000] hover:bg-[#bb0000] text-white text-[14px] font-medium px-4 py-2 rounded-full transition-colors">
                      Subscribe
                    </button>
                  </div>
                  
                  {/* Description */}
                  <div className="mt-3 pb-4">
                    <div className="inline-flex flex-wrap gap-2 text-[12px] text-gray-600 mb-2">
                      <span className="font-medium text-black">{viewCount}</span>
                      <span>{uploadTime}</span>
                      <span className="text-[#3ea6ff] cursor-pointer hover:text-blue-800">#python</span>
                      <span className="text-[#3ea6ff] cursor-pointer hover:text-blue-800">#programming</span>
                      <span className="text-[#3ea6ff] cursor-pointer hover:text-blue-800">#tutorial</span>
                    </div>
                    <div className="text-[14px] leading-5 text-black">
                      <span>Python tutorial - Python full course for beginners - Go from Zero to Hero with Python (includes machine learning & web scraping projects).</span>
                      <button className="ml-2 font-medium hover:text-black text-gray-600 transition-colors">...more</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Secondary column - Related videos */}
              <div className="w-[426px]">
                <div className="space-y-2">
                  {/* Related video items */}
                  {[
                    {
                      title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
                      channel: "Programming with Mosh",
                      views: "6.5M views",
                      time: "4 years ago",
                      duration: "1:07:54"
                    },
                    {
                      title: "Python vs JavaScript - Which Should You Learn First?",
                      channel: "Tech With Tim",
                      views: "2.3M views", 
                      time: "2 years ago",
                      duration: "12:45"
                    },
                    {
                      title: "Full Stack Web Development Course - HTML, CSS, JavaScript, Python",
                      channel: "freeCodeCamp.org",
                      views: "8.1M views",
                      time: "1 year ago", 
                      duration: "4:32:18"
                    },
                    {
                      title: "100+ Python Exercises for Beginners - Solve Programming Problems",
                      channel: "Programming with Mosh",
                      views: "1.8M views",
                      time: "8 months ago",
                      duration: "2:15:30"
                    },
                    {
                      title: "Data Structures and Algorithms in Python - Full Course for Beginners",
                      channel: "freeCodeCamp.org", 
                      views: "3.2M views",
                      time: "3 years ago",
                      duration: "12:56:43"
                    },
                    {
                      title: "Machine Learning Course for Beginners",
                      channel: "Programming with Mosh",
                      views: "4.7M views",
                      time: "2 years ago",
                      duration: "3:02:47"
                    }
                  ].map((video, i) => (
                    <div key={i} className="flex gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <div className="w-[168px] h-[94px] bg-gray-200 rounded-lg flex-shrink-0 relative">
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] px-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[14px] font-medium leading-5 mb-1 text-black line-clamp-2">
                          {video.title}
                        </h3>
                        <div className="text-[12px] text-gray-600">
                          <div className="mb-1">{video.channel}</div>
                          <div className="flex items-center gap-1">
                            <span>{video.views}</span>
                            <span>•</span>
                            <span>{video.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};