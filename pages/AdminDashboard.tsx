import React, { useState, useEffect } from 'react';
import { dataService } from '../services/mockData';
import { Fighter, Fight, Media, FightStatus } from '../types';
import { Trash2, Plus, Edit2 } from 'lucide-react';

const AdminDashboard = () => {
  const [tab, setTab] = useState<'FIGHTERS' | 'FIGHTS'>('FIGHTERS');
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [fights, setFights] = useState<Fight[]>([]);

  // Form States (Simple inline for demo)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Fighter Form State
  const [fighterForm, setFighterForm] = useState<Partial<Fighter>>({ name: '', country: '', weightClass: '', recordWins: 0, recordLosses: 0, bio: '' });
  
  // Fight Form State
  const [fightForm, setFightForm] = useState<Partial<Fight>>({ eventName: '', location: '', status: FightStatus.UPCOMING });

  const loadData = async () => {
    const f = await dataService.getFighters();
    setFighters(f);
    const ev = await dataService.getFights();
    setFights(ev);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteFighter = async (id: string) => {
    if (window.confirm('Delete fighter?')) {
      await dataService.deleteFighter(id);
      loadData();
    }
  };

  const handleDeleteFight = async (id: string) => {
    if (window.confirm('Delete fight?')) {
      await dataService.deleteFight(id);
      loadData();
    }
  };

  const handleSaveFighter = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...fighterForm, 
      imageUrl: 'https://picsum.photos/400/400',
      recordDraws: 0, koWins: 0, submissionWins: 0, decisionWins: 0 
    } as Fighter;

    if (editingId) {
      await dataService.updateFighter({ ...payload, id: editingId });
    } else {
      await dataService.createFighter(payload);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setFighterForm({});
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white uppercase">Dashboard</h1>
        <button 
          onClick={() => { setIsModalOpen(true); setEditingId(null); setFighterForm({}); }}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-800 mb-8">
        <button onClick={() => setTab('FIGHTERS')} className={`pb-3 font-bold text-sm ${tab === 'FIGHTERS' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-500'}`}>Fighters</button>
        <button onClick={() => setTab('FIGHTS')} className={`pb-3 font-bold text-sm ${tab === 'FIGHTS' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-500'}`}>Fights</button>
      </div>

      {/* Content */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {tab === 'FIGHTERS' && (
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Record</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fighters.map(f => (
                <tr key={f.id} className="border-b border-zinc-800 last:border-0">
                  <td className="p-4 font-bold text-white">{f.name}</td>
                  <td className="p-4 text-zinc-400">{f.recordWins}-{f.recordLosses}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleDeleteFighter(f.id)} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
         {tab === 'FIGHTS' && (
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fights.map(f => (
                <tr key={f.id} className="border-b border-zinc-800 last:border-0">
                  <td className="p-4 font-bold text-white">{f.eventName}</td>
                  <td className="p-4 text-zinc-400">{new Date(f.date).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                     <button onClick={() => handleDeleteFight(f.id)} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Simple Modal for Fighter Create (Demo) */}
      {isModalOpen && tab === 'FIGHTERS' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 w-full max-w-lg p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-4">Add Fighter</h2>
            <form onSubmit={handleSaveFighter} className="space-y-4">
              <input className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white" placeholder="Name" value={fighterForm.name || ''} onChange={e => setFighterForm({...fighterForm, name: e.target.value})} required />
              <input className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white" placeholder="Nickname" value={fighterForm.nickname || ''} onChange={e => setFighterForm({...fighterForm, nickname: e.target.value})} />
              <div className="flex gap-4">
                <input className="w-1/2 bg-zinc-950 border border-zinc-800 p-2 rounded text-white" placeholder="Wins" type="number" value={fighterForm.recordWins || 0} onChange={e => setFighterForm({...fighterForm, recordWins: parseInt(e.target.value)})} />
                <input className="w-1/2 bg-zinc-950 border border-zinc-800 p-2 rounded text-white" placeholder="Losses" type="number" value={fighterForm.recordLosses || 0} onChange={e => setFighterForm({...fighterForm, recordLosses: parseInt(e.target.value)})} />
              </div>
              <input className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white" placeholder="Weight Class" value={fighterForm.weightClass || ''} onChange={e => setFighterForm({...fighterForm, weightClass: e.target.value})} required />
              <input className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white" placeholder="Country" value={fighterForm.country || ''} onChange={e => setFighterForm({...fighterForm, country: e.target.value})} required />
              
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
