
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, Users, Video, Shield, User, LogOut, Gamepad2, UserPlus, Swords } from 'lucide-react';
import Home from './pages/Home';
import Fights from './pages/Fights';
import FightDetail from './pages/FightDetail';
import Fighters from './pages/Fighters';
import FighterDetail from './pages/FighterDetail';
import Leaderboards from './pages/Leaderboards';
import MediaPage from './pages/MediaPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import FantasyDojo from './pages/FantasyDojo';
import JoinFighter from './pages/JoinFighter';
import Tournaments from './pages/Tournaments';

// --- Components (Layout) ---

const Navbar = ({ user, logout }: { user: any, logout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Shield className="w-4 h-4 mr-1" /> },
    { name: 'Fights', path: '/fights', icon: <Calendar className="w-4 h-4 mr-1" /> },
    { name: 'Tournaments', path: '/tournaments', icon: <Swords className="w-4 h-4 mr-1" /> },
    { name: 'Fighters', path: '/fighters', icon: <Users className="w-4 h-4 mr-1" /> },
    { name: 'Dojo', path: '/fantasy', icon: <Gamepad2 className="w-4 h-4 mr-1" /> },
    { name: 'Media', path: '/media', icon: <Video className="w-4 h-4 mr-1" /> },
  ];

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-red-600 font-black text-2xl tracking-tighter italic">FIGHT<span className="text-white">NIGHT</span></span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Link to="/join" className="px-3 py-1.5 border border-zinc-700 rounded text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white transition-colors flex items-center">
                  <UserPlus className="w-3 h-3 mr-1"/> Join Roster
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-zinc-500 text-xs hidden lg:block">{user.email}</span>
                  <Link to="/admin" className="text-zinc-300 hover:text-white text-sm font-medium">Admin</Link>
                  <button onClick={logout} className="text-zinc-300 hover:text-white">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-zinc-300 hover:text-white">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-zinc-800 inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                   location.pathname === link.path
                    ? 'bg-red-600 text-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link to="/join" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-red-500 hover:text-white">
               Join as Fighter
            </Link>
            {user ? (
              <>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">Admin Dashboard</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-zinc-950 border-t border-zinc-900 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-zinc-500 text-sm">© 2025 FightNight Pro. All rights reserved.</p>
      <p className="text-zinc-600 text-xs mt-2">Simulated Platform for Demonstration</p>
    </div>
  </footer>
);

// --- Main App Logic ---

const App = () => {
  // Simple Auth State
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fn_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (email: string) => {
    // Simulate user ID from email for prediction uniqueness
    const mockUser = { id: email.replace(/[^a-zA-Z0-9]/g, ''), email, role: 'ADMIN' };
    setUser(mockUser);
    localStorage.setItem('fn_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fn_user');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
        <Navbar user={user} logout={logout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fights" element={<Fights />} />
            <Route path="/fights/:id" element={<FightDetail user={user} />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/fighters" element={<Fighters />} />
            <Route path="/fighters/:id" element={<FighterDetail />} />
            <Route path="/join" element={<JoinFighter />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/fantasy" element={<FantasyDojo user={user} />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
