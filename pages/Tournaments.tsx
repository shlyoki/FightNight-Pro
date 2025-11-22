
import React, { useEffect, useState } from 'react';
import { dataService } from '../services/mockData';
import { Tournament } from '../types';
import { Trophy, MapPin, Calendar, Users, CheckCircle, X } from 'lucide-react';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  
  // Registration Form
  const [regForm, setRegForm] = useState({ fighterName: '', email: '', team: '' });
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getTournaments();
      setTournaments(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedTournament) return;
    
    await dataService.submitTournamentApplication({
        tournamentId: selectedTournament.id,
        fighterName: regForm.fighterName,
        email: regForm.email,
        team: regForm.team
    });

    setSubmitStatus('SUCCESS');
    setTimeout(() => {
        setSubmitStatus('IDLE');
        setSelectedTournament(null);
        setRegForm({ fighterName: '', email: '', team: '' });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
           Open Tournaments
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
            Test your might. Register for upcoming Grand Prix events, regional qualifiers, and open grappling tournaments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
            Array.from({length:4}).map((_,i) => <div key={i} className="h-64 bg-zinc-900 rounded-xl animate-pulse"></div>)
        ) : (
            tournaments.map(tourney => (
                <div key={tourney.id} className={`relative bg-zinc-900 rounded-xl border ${tourney.status === 'OPEN' ? 'border-zinc-700 hover:border-red-600' : 'border-zinc-800 opacity-60'} transition-all p-8 flex flex-col overflow-hidden group`}>
                    {tourney.status === 'OPEN' && <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">Registration Open</div>}
                    {tourney.status === 'CLOSED' && <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-500 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">Registration Closed</div>}
                    
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                            <Trophy className={`w-8 h-8 ${tourney.status === 'OPEN' ? 'text-yellow-500' : 'text-zinc-600'}`} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase leading-none mb-2">{tourney.name}</h3>
                            <span className="inline-block bg-zinc-800 px-2 py-1 rounded text-xs font-bold text-zinc-300 uppercase tracking-wider">{tourney.division}</span>
                        </div>
                    </div>

                    <p className="text-zinc-400 text-sm mb-6 flex-grow border-l-2 border-zinc-800 pl-4">
                        {tourney.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div className="flex items-center text-zinc-300"><Calendar className="w-4 h-4 mr-2 text-red-600"/> {new Date(tourney.date).toLocaleDateString()}</div>
                        <div className="flex items-center text-zinc-300"><MapPin className="w-4 h-4 mr-2 text-red-600"/> {tourney.location}</div>
                        <div className="flex items-center text-zinc-300"><Trophy className="w-4 h-4 mr-2 text-red-600"/> Prize: {tourney.prizePool}</div>
                        <div className="flex items-center text-zinc-300"><Users className="w-4 h-4 mr-2 text-red-600"/> {tourney.currentEntrants}/{tourney.maxEntrants} Entrants</div>
                    </div>

                    <button 
                        onClick={() => setSelectedTournament(tourney)}
                        disabled={tourney.status !== 'OPEN'}
                        className="w-full py-3 bg-white text-black font-black uppercase tracking-wider rounded-lg hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {tourney.status === 'OPEN' ? 'Register Now' : 'Closed'}
                    </button>
                </div>
            ))
        )}
      </div>

      {/* Registration Modal */}
      {selectedTournament && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
              <div className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative">
                  <button onClick={() => setSelectedTournament(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-6 h-6"/></button>
                  
                  {submitStatus === 'SUCCESS' ? (
                      <div className="p-12 text-center animate-fade-in">
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-black text-white uppercase">Registered!</h3>
                          <p className="text-zinc-400 mt-2">We'll see you on the mats.</p>
                      </div>
                  ) : (
                    <div className="p-8">
                        <h2 className="text-xl font-black text-white uppercase italic mb-1">Tournament Registration</h2>
                        <p className="text-red-500 font-bold text-sm mb-6">{selectedTournament.name}</p>
                        
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Fighter Name</label>
                                <input 
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" 
                                    required
                                    value={regForm.fighterName}
                                    onChange={e => setRegForm({...regForm, fighterName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label>
                                <input 
                                    type="email"
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" 
                                    required
                                    value={regForm.email}
                                    onChange={e => setRegForm({...regForm, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Team / Gym</label>
                                <input 
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" 
                                    value={regForm.team}
                                    onChange={e => setRegForm({...regForm, team: e.target.value})}
                                />
                            </div>

                            <div className="pt-4">
                                <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg transition-colors">
                                    Confirm Entry
                                </button>
                            </div>
                        </form>
                    </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Tournaments;
