
import React, { useState } from 'react';

interface HeaderProps {
  onNavClick: (view: any) => void;
  activeView: string;
  isLoggedIn: boolean;
  userRole?: 'student' | 'teacher' | 'admin';
  onLogout: () => void;
  onLoginClick: () => void;
  accessibilitySettings: any;
  onAccessibilityChange: (settings: any) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavClick, 
  activeView, 
  isLoggedIn, 
  userRole,
  onLogout, 
  onLoginClick 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (view: any) => {
    onNavClick(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] bg-white border-b-8 border-black">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-28 md:h-40">
          
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => handleNav('home')}>
            {/* Fixed typo in shadow class below by removing '极' */}
            <div className="w-16 h-16 md:w-28 md:h-28 bg-blue-700 rounded-[2.5rem] border-8 border-black flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
               <div className="flex flex-col items-center leading-none -space-y-3">
                 <span className="text-white text-5xl md:text-7xl font-black">I</span>
                 <span className="text-3xl md:text-5xl">🎓</span>
               </div>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-blue-800 italic">IFTU LMS</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[14px] font-black uppercase tracking-[0.5em] text-gray-400">National HUB</span>
                <div className="flex gap-1.5">
                   <div className="w-6 h-2 bg-[#009b44] rounded-full border border-black/10"></div>
                   <div className="w-6 h-2 bg-[#ffcd00] rounded-full border border-black/10"></div>
                   <div className="w-6 h-2 bg-[#ef3340] rounded-full border border-black/10"></div>
                </div>
              </div>
            </div>
          </div>

          <nav className="hidden xl:flex items-center bg-gray-50 border-8 border-black rounded-[3rem] px-16 h-28 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-14">
              {['home', 'courses', 'exams', 'tutor', 'about', 'news'].map((v) => (
                <button 
                  key={v}
                  onClick={() => handleNav(v as any)} 
                  className={`text-sm font-black uppercase tracking-widest transition-all ${activeView === v ? 'text-blue-700 border-b-8 border-blue-700 pb-1' : 'text-gray-400 hover:text-black'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex flex-col text-right mr-4 leading-none">
                  <span className="text-lg font-black uppercase">{userRole} ACCESS</span>
                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest mt-1">Sovereign Session</span>
                </div>
                {userRole === 'admin' && (
                  <button onClick={() => handleNav('admin')} className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-3xl border-8 border-black flex items-center justify-center shadow-lg hover:bg-purple-600 hover:text-white transition-all text-4xl">🛠️</button>
                )}
                <button onClick={onLogout} className="h-16 md:h-24 px-8 md:px-14 bg-rose-50 text-rose-600 rounded-[2.5rem] border-8 border-black font-black uppercase text-sm md:text-lg tracking-widest shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">Sign Out</button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="h-16 md:h-24 px-12 md:px-20 bg-blue-700 text-white rounded-[3rem] border-8 border-black font-black uppercase text-sm md:text-xl tracking-widest shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">Hub Login</button>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden w-16 h-16 md:w-20 md:h-20 bg-gray-50 border-8 border-black rounded-3xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t-8 border-black p-12 flex flex-col gap-10 animate-fadeIn overflow-y-auto max-h-[80vh]">
          {['home', 'courses', 'exams', 'tutor', 'about', 'news', 'admin'].map(v => (
            <button key={v} onClick={() => handleNav(v as any)} className="text-5xl font-black uppercase text-left hover:text-blue-700 transition-all">{v}</button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
