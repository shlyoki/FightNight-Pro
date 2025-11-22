
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/mockData';
import { Fighter, Fight, Media, FightStatus, Tournament, FighterApplication, MediaType } from '../types';
import { 
    LayoutDashboard, Users, Swords, Trophy, Image, FileText, 
    Plus, Edit2, Trash2, CheckCircle, XCircle, Search, 
    MoreHorizontal, LogOut, DollarSign, AlertCircle,
    ChevronRight
} from 'lucide-react';

// --- Reusable Components ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        'UPCOMING': 'bg-blue-900/30 text-blue-400 border-blue-900',
        'IN_PROGRESS': 'bg-red-900/30 text-red-400 border-red-900 animate-pulse',
        'FINISHED': 'bg-zinc-800 text-zinc-400 border-zinc-700',
        'OPEN': 'bg-green-900/30 text-green-400 border-green-900',
        'CLOSED': 'bg-zinc-800 text-zinc-500 border-zinc-700',
        'PENDING': 'bg-yellow-900/30 text-yellow-500 border-yellow-900',
        'APPROVED': 'bg-green-900/30 text-green-400 border-green-900',
        'ACCEPTED': 'bg-green-900/30 text-green-400 border-green-900',
        'REJECTED': 'bg-red-900/30 text-red-500 border-red-900',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${styles[status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><XCircle className="w-6 h-6"/></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [view, setView] = useState<'HOME' | 'FIGHTERS' | 'FIGHTS' | 'TOURNAMENTS' | 'MEDIA' | 'APPLICATIONS'>('HOME');
    const [stats, setStats] = useState<any>(null);
    
    // Data States
    const [fighters, setFighters] = useState<Fighter[]>([]);
    const [fights, setFights] = useState<Fight[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [media, setMedia] = useState<Media[]>([]);
    const [applications, setApplications] = useState<FighterApplication[]>([]);
    
    const [loading, setLoading] = useState(true);

    // Forms
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        const [f, ev, t, m, app, s] = await Promise.all([
            dataService.getFighters(),
            dataService.getFights(),
            dataService.getTournaments(),
            dataService.getMedia(),
            dataService.getFighterApplications(),
            dataService.getDashboardStats()
        ]);
        setFighters(f);
        setFights(ev);
        setTournaments(t);
        setMedia(m);
        setApplications(app);
        setStats(s);
        setLoading(false);
    };

    // --- Actions ---

    const handleDelete = async (id: string, type: 'FIGHTER' | 'FIGHT' | 'TOURNAMENT' | 'MEDIA') => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        if (type === 'FIGHTER') await dataService.deleteFighter(id);
        if (type === 'FIGHT') await dataService.deleteFight(id);
        if (type === 'TOURNAMENT') await dataService.deleteTournament(id);
        if (type === 'MEDIA') await dataService.deleteMedia(id);
        loadAllData();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (view === 'FIGHTERS') {
            const payload = { ...formData, imageUrl: formData.imageUrl || 'https://picsum.photos/400/400' };
            editingId ? await dataService.updateFighter({ ...payload, id: editingId }) : await dataService.createFighter(payload);
        } else if (view === 'FIGHTS') {
            editingId ? console.warn("Update fight not impl in mock") : await dataService.createFight(formData);
        } else if (view === 'TOURNAMENTS') {
            editingId ? await dataService.updateTournament({ ...formData, id: editingId }) : await dataService.createTournament(formData);
        } else if (view === 'MEDIA') {
            const payload = { ...formData, createdAt: new Date().toISOString() };
            await dataService.createMedia(payload);
        }
        setIsModalOpen(false);
        loadAllData();
    };

    const openModal = (item: any = null) => {
        setEditingId(item?.id || null);
        setFormData(item || {});
        setIsModalOpen(true);
    };

    const handleApproveApp = async (id: string) => {
        await dataService.updateFighterApplicationStatus(id, 'APPROVED');
        loadAllData();
    };

    const handleRejectApp = async (id: string) => {
        await dataService.updateFighterApplicationStatus(id, 'REJECTED');
        loadAllData();
    };

    // --- Render Helpers ---

    const SidebarItem = ({ id, icon: Icon, label }: { id: typeof view, icon: any, label: string }) => (
        <button 
            onClick={() => setView(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${view === id ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-zinc-800">
                    <h1 className="text-2xl font-black text-white italic tracking-tighter">ADMIN<span className="text-red-600">PANEL</span></h1>
                    <p className="text-xs text-zinc-500 mt-1">FightNight Pro Management</p>
                </div>
                <div className="flex-1 p-4 space-y-2">
                    <SidebarItem id="HOME" icon={LayoutDashboard} label="Overview" />
                    <SidebarItem id="FIGHTERS" icon={Users} label="Fighters" />
                    <SidebarItem id="FIGHTS" icon={Swords} label="Fights" />
                    <SidebarItem id="TOURNAMENTS" icon={Trophy} label="Tournaments" />
                    <SidebarItem id="MEDIA" icon={Image} label="Media Gallery" />
                    <SidebarItem id="APPLICATIONS" icon={FileText} label="Applications" />
                </div>
                <div className="p-4 border-t border-zinc-800">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-red-500 transition-colors text-sm font-bold">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* View Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">{view.replace('_', ' ')}</h2>
                        <p className="text-zinc-500 text-sm mt-1">Manage your platform content and users.</p>
                    </div>
                    {view !== 'HOME' && view !== 'APPLICATIONS' && (
                        <button onClick={() => openModal()} className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg font-bold text-sm flex items-center transition-colors">
                            <Plus className="w-4 h-4 mr-2" /> Add New
                        </button>
                    )}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-3 gap-6">
                        {[1,2,3].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <>
                        {/* HOME VIEW */}
                        {view === 'HOME' && stats && (
                            <div className="space-y-8">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 uppercase">Total Revenue</p>
                                                <h3 className="text-2xl font-black text-white mt-1">${stats.totalRevenue.toLocaleString()}</h3>
                                            </div>
                                            <div className="bg-green-900/20 p-2 rounded text-green-500"><DollarSign className="w-5 h-5"/></div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 uppercase">Active Fighters</p>
                                                <h3 className="text-2xl font-black text-white mt-1">{stats.totalFighters}</h3>
                                            </div>
                                            <div className="bg-blue-900/20 p-2 rounded text-blue-500"><Users className="w-5 h-5"/></div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 uppercase">Upcoming Fights</p>
                                                <h3 className="text-2xl font-black text-white mt-1">{stats.upcomingFights}</h3>
                                            </div>
                                            <div className="bg-red-900/20 p-2 rounded text-red-500"><Swords className="w-5 h-5"/></div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 uppercase">Pending Apps</p>
                                                <h3 className="text-2xl font-black text-white mt-1">{stats.pendingApplications}</h3>
                                            </div>
                                            <div className="bg-yellow-900/20 p-2 rounded text-yellow-500"><AlertCircle className="w-5 h-5"/></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity / Quick Actions could go here */}
                            </div>
                        )}

                        {/* FIGHTERS VIEW */}
                        {view === 'FIGHTERS' && (
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
                                        <tr>
                                            <th className="p-4 pl-6">Fighter</th>
                                            <th className="p-4">Record</th>
                                            <th className="p-4">Weight Class</th>
                                            <th className="p-4 text-right pr-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {fighters.map(f => (
                                            <tr key={f.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <img src={f.imageUrl} className="w-10 h-10 rounded-full object-cover bg-zinc-800" alt=""/>
                                                        <div>
                                                            <div className="font-bold text-white">{f.name}</div>
                                                            <div className="text-xs text-zinc-500">{f.gym}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-zinc-300">{f.recordWins}-{f.recordLosses}-{f.recordDraws}</td>
                                                <td className="p-4 text-zinc-400">{f.weightClass}</td>
                                                <td className="p-4 pr-6 text-right space-x-2">
                                                    <button onClick={() => openModal(f)} className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><Edit2 className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDelete(f.id, 'FIGHTER')} className="p-2 hover:bg-red-900/20 rounded text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* FIGHTS VIEW */}
                        {view === 'FIGHTS' && (
                             <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
                                        <tr>
                                            <th className="p-4 pl-6">Event</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right pr-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {fights.map(f => (
                                            <tr key={f.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-white">{f.eventName}</td>
                                                <td className="p-4 text-zinc-400">{new Date(f.date).toLocaleDateString()}</td>
                                                <td className="p-4"><StatusBadge status={f.status} /></td>
                                                <td className="p-4 pr-6 text-right">
                                                    <button onClick={() => handleDelete(f.id, 'FIGHT')} className="p-2 hover:bg-red-900/20 rounded text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* APPLICATIONS VIEW */}
                        {view === 'APPLICATIONS' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Fighter Applications</h3>
                                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                        {applications.length === 0 ? <div className="p-8 text-center text-zinc-500">No pending applications.</div> : 
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
                                                <tr>
                                                    <th className="p-4 pl-6">Name</th>
                                                    <th className="p-4">Stats</th>
                                                    <th className="p-4">Experience</th>
                                                    <th className="p-4">Status</th>
                                                    <th className="p-4 text-right pr-6">Review</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-800">
                                                {applications.map(app => (
                                                    <tr key={app.id} className="hover:bg-zinc-800/50 transition-colors">
                                                        <td className="p-4 pl-6">
                                                            <div className="font-bold text-white">{app.fullName}</div>
                                                            <div className="text-xs text-zinc-500">{app.email}</div>
                                                        </td>
                                                        <td className="p-4 text-zinc-300">
                                                            {app.age}yo • {app.heightCm}cm • {app.weightClass}
                                                        </td>
                                                        <td className="p-4 text-zinc-300 max-w-xs truncate">{app.experience}</td>
                                                        <td className="p-4"><StatusBadge status={app.status} /></td>
                                                        <td className="p-4 pr-6 text-right space-x-2">
                                                            {app.status === 'PENDING' && (
                                                                <>
                                                                    <button onClick={() => handleApproveApp(app.id)} className="p-2 bg-green-900/20 hover:bg-green-900/40 rounded text-green-500"><CheckCircle className="w-4 h-4"/></button>
                                                                    <button onClick={() => handleRejectApp(app.id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded text-red-500"><XCircle className="w-4 h-4"/></button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                         {/* TOURNAMENTS VIEW */}
                         {view === 'TOURNAMENTS' && (
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
                                        <tr>
                                            <th className="p-4 pl-6">Name</th>
                                            <th className="p-4">Division</th>
                                            <th className="p-4">Prize</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right pr-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {tournaments.map(t => (
                                            <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-white">{t.name}</td>
                                                <td className="p-4 text-zinc-400">{t.division}</td>
                                                <td className="p-4 text-zinc-400">{t.prizePool}</td>
                                                <td className="p-4"><StatusBadge status={t.status} /></td>
                                                <td className="p-4 pr-6 text-right space-x-2">
                                                    <button onClick={() => openModal(t)} className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><Edit2 className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDelete(t.id, 'TOURNAMENT')} className="p-2 hover:bg-red-900/20 rounded text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* MEDIA VIEW */}
                        {view === 'MEDIA' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {media.map(m => (
                                    <div key={m.id} className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                                        <div className="aspect-video bg-black">
                                            <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"/>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(m.id, 'MEDIA')}
                                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 className="w-3 h-3"/>
                                        </button>
                                        <div className="p-3">
                                            <p className="text-xs font-bold text-white truncate">{m.title}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase mt-1">{m.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </>
                )}
            </main>

            {/* Generic Modal Form */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingId ? 'Edit' : 'Add'} ${view.slice(0,-1)}`}>
                <form onSubmit={handleSave} className="space-y-4">
                    {view === 'FIGHTERS' && (
                        <>
                             <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Full Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                             <div className="grid grid-cols-2 gap-4">
                                <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Nickname" value={formData.nickname || ''} onChange={e => setFormData({...formData, nickname: e.target.value})} />
                                <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Weight Class" value={formData.weightClass || ''} onChange={e => setFormData({...formData, weightClass: e.target.value})} required />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Wins" type="number" value={formData.recordWins || ''} onChange={e => setFormData({...formData, recordWins: parseInt(e.target.value)})} />
                                <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Losses" type="number" value={formData.recordLosses || ''} onChange={e => setFormData({...formData, recordLosses: parseInt(e.target.value)})} />
                             </div>
                             <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Gym / Team" value={formData.gym || ''} onChange={e => setFormData({...formData, gym: e.target.value})} />
                             <textarea className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Bio" rows={3} value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} />
                        </>
                    )}

                    {view === 'MEDIA' && (
                         <>
                            <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <select className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" value={formData.type || 'PHOTO'} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option value="PHOTO">Photo</option>
                                <option value="VIDEO">Video</option>
                            </select>
                            <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Thumbnail URL" value={formData.thumbnailUrl || ''} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} required />
                         </>
                    )}

                    {view === 'TOURNAMENTS' && (
                        <>
                             <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Tournament Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                             <input className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" placeholder="Division" value={formData.division || ''} onChange={e => setFormData({...formData, division: e.target.value})} required />
                             <div className="grid grid-cols-2 gap-4">
                                 <input type="date" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} onChange={e => setFormData({...formData, date: new Date(e.target.value).toISOString()})} required />
                                 <select className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-red-600 outline-none" value={formData.status || 'OPEN'} onChange={e => setFormData({...formData, status: e.target.value})}>
                                     <option value="OPEN">Open</option>
                                     <option value="CLOSED">Closed</option>
                                     <option value="COMPLETED">Completed</option>
                                 </select>
                             </div>
                        </>
                    )}

                    <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white font-bold text-sm">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-red-900/20">Save Item</button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default AdminDashboard;
