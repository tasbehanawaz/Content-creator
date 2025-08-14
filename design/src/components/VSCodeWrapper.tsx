import React from 'react';

interface VSCodeWrapperProps {
  children: React.ReactNode;
}

export const VSCodeWrapper: React.FC<VSCodeWrapperProps> = ({ children }) => {
  return (
    <div className="w-full h-screen bg-[#1e1e1e] text-[#cccccc] flex flex-col overflow-hidden">
      {/* VS Code Title Bar */}
      <div className="h-[30px] bg-[#2d2d30] flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 ml-2">
            <div className="w-3 h-3 bg-[#ff5f57] rounded-full"></div>
            <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
            <div className="w-3 h-3 bg-[#28ca42] rounded-full"></div>
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-[#cccccc]">
          youtube.com — Visual Studio Code
        </div>
        <div className="flex gap-4 text-[#999999]">
          <span>—</span>
          <span>□</span>
          <span>×</span>
        </div>
      </div>

      {/* VS Code Menu Bar */}
      <div className="h-[35px] bg-[#2d2d30] flex items-center px-4 text-sm">
        <div className="flex gap-6">
          <span>Code</span>
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Debug</span>
          <span>Terminal</span>
          <span>Window</span>
          <span>Help</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Activity Bar (Left) */}
        <div className="w-[48px] bg-[#2d2d30] flex flex-col items-center py-2 gap-4">
          <div className="w-6 h-6 bg-[#007acc] rounded-sm"></div>
          <div className="w-6 h-6 bg-[#3d3d3d] rounded-sm"></div>
          <div className="w-6 h-6 bg-[#3d3d3d] rounded-sm"></div>
          <div className="w-6 h-6 bg-[#3d3d3d] rounded-sm"></div>
          <div className="w-6 h-6 bg-[#3d3d3d] rounded-sm"></div>
        </div>

        {/* Explorer Sidebar */}
        <div className="w-[200px] bg-[#252526] border-r border-[#3e3e42] p-2">
          <div className="text-xs uppercase text-[#cccccc] mb-2">Explorer</div>
          <div className="text-sm">
            <div className="py-1 px-2 hover:bg-[#2a2d2e]">▼ WEBSONIC</div>
            <div className="pl-6">
              <div className="py-0.5 px-2 hover:bg-[#2a2d2e] text-[#999999]">▼ src</div>
              <div className="pl-6">
                <div className="py-0.5 px-2 hover:bg-[#2a2d2e]">app.js</div>
                <div className="py-0.5 px-2 hover:bg-[#2a2d2e]">index.js</div>
              </div>
              <div className="py-0.5 px-2 hover:bg-[#2a2d2e] text-[#999999]">package.json</div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-[#1e1e1e] relative">
          {/* Tab Bar */}
          <div className="h-[35px] bg-[#252526] flex items-center">
            <div className="flex">
              <div className="px-4 py-1 bg-[#1e1e1e] text-sm flex items-center gap-2 border-t-2 border-[#007acc]">
                <span className="text-yellow-500">JS</span>
                <span>app.js</span>
                <span className="text-[#cccccc] ml-2">×</span>
              </div>
            </div>
          </div>

          {/* Content (YouTube player will go here) */}
          <div className="flex-1 flex items-center justify-center p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-[22px] bg-[#007acc] flex items-center justify-between px-2 text-xs text-white">
        <div className="flex gap-4">
          <span>🌿 main</span>
          <span>↻</span>
          <span>0 ↓ 0 ↑</span>
        </div>
        <div className="flex gap-4">
          <span>Ln 42, Col 16</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
      </div>
    </div>
  );
};