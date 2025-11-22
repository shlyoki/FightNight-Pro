
import React, { useState } from 'react';
import { dataService } from '../services/mockData';
import { User, Mail, Dumbbell, MapPin, Shield, CheckCircle } from 'lucide-react';

const JoinFighter = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    weightClass: '',
    heightCm: '',
    experience: '',
    gym: ''
  });
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');
    
    await dataService.submitFighterApplication({
      fullName: formData.fullName,
      email: formData.email,
      age: parseInt(formData.age),
      weightClass: formData.weightClass,
      heightCm: parseInt(formData.heightCm),
      experience: formData.experience,
      gym: formData.gym
    });

    setStatus('SUCCESS');
  };

  if (status === 'SUCCESS') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-zinc-900 p-10 rounded-2xl border border-green-600/30 text-center max-w-md w-full shadow-[0_0_50px_rgba(22,163,74,0.1)]">
          <div className="bg-green-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic mb-2">Application Sent</h2>
          <p className="text-zinc-400 mb-6">We have received your fighter profile. Our scouts will review your stats and contact you within 48 hours.</p>
          <button onClick={() => window.location.reload()} className="text-green-500 hover:text-green-400 font-bold uppercase tracking-wider text-sm">Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      {/* Hero Content */}
      <div className="md:w-1/2 space-y-8">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
          Become <br/><span className="text-red-600">Legendary</span>
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          Are you ready to step into the cage? Join the fastest growing combat sports organization in the world. We are looking for talent, heart, and skill.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="bg-red-600/20 p-3 rounded-lg"><Shield className="w-6 h-6 text-red-500"/></div>
            <div>
              <h3 className="font-bold text-white uppercase">Professional Contract</h3>
              <p className="text-sm text-zinc-500">Get signed and fight on the main stage.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="bg-blue-600/20 p-3 rounded-lg"><Dumbbell className="w-6 h-6 text-blue-500"/></div>
            <div>
              <h3 className="font-bold text-white uppercase">World Class Exposure</h3>
              <p className="text-sm text-zinc-500">Showcase your skills to millions of fans.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="md:w-1/2">
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-blue-600"></div>
          <h2 className="text-2xl font-black text-white uppercase mb-6">Fighter Application</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Age</label>
                <input 
                  type="number" 
                  required 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-red-600 outline-none"
                  placeholder="24"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Height (cm)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-red-600 outline-none"
                  placeholder="180"
                  value={formData.heightCm}
                  onChange={e => setFormData({...formData, heightCm: e.target.value})}
                />
              </div>
               <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Weight</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-2 text-white focus:ring-1 focus:ring-red-600 outline-none text-sm"
                  value={formData.weightClass}
                  onChange={e => setFormData({...formData, weightClass: e.target.value})}
                  required
                >
                    <option value="">Select...</option>
                    <option value="Flyweight">Flyweight</option>
                    <option value="Bantamweight">Bantamweight</option>
                    <option value="Featherweight">Featherweight</option>
                    <option value="Lightweight">Lightweight</option>
                    <option value="Welterweight">Welterweight</option>
                    <option value="Middleweight">Middleweight</option>
                    <option value="Light Heavyweight">Light Heavyweight</option>
                    <option value="Heavyweight">Heavyweight</option>
                </select>
              </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Gym / Team</label>
               <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-red-600 outline-none"
                    placeholder="e.g. American Top Team"
                    value={formData.gym}
                    onChange={e => setFormData({...formData, gym: e.target.value})}
                  />
                </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Experience / Record</label>
              <textarea 
                required 
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-red-600 outline-none"
                placeholder="List your amateur/pro record, martial arts background..."
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'SUBMITTING'}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'SUBMITTING' ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinFighter;
