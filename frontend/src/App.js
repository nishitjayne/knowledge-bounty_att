import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    Trophy, Gift, Plus, BarChart3, ShieldCheck, Zap, X, Send, 
    MessageSquare, Bell, Clock, Tag, ExternalLink, User, Target, Palette 
} from 'lucide-react';
import confetti from 'canvas-confetti';
//const API = "http://localhost:5000/api";  
const API = "https://knowledge-bounty-att.onrender.com/api";

const THEMES = {
    deepSea: { name: 'Deep Sea', bg: '#1b3c53', card: '#234c6a', text: '#e3e3e3', subText: '#94a3b8', accent: '#456882', button: '#456882', highlight: '#e3e3e3', zap: '#fbbf24' },
    retro: { name: 'Retro', bg: '#FDF6E3', card: '#EEE8D5', text: '#586E75', subText: '#93A1A1', accent: '#93A1A1', button: '#CB4B16', highlight: '#268BD2', zap: '#CB4B16' },
    summer: { name: 'Summer', bg: '#F7F9F9', card: '#FFFFFF', text: '#2C3E50', subText: '#95A5A6', accent: '#BDC3C7', button: '#FF6F61', highlight: '#4ECDC4', zap: '#FF6F61' },
    neon: { name: 'Cyberpunk', bg: '#0B0C10', card: '#1F2833', text: '#C5C6C7', subText: '#66FCF1', accent: '#45A29E', button: '#F50057', highlight: '#66FCF1', zap: '#66FCF1' },
    modern: { name: 'Modern', bg: '#F8F9FA', card: '#FFFFFF', text: '#1A202C', subText: '#718096', accent: '#E2E8F0', button: '#2B6CB0', highlight: '#38A169', zap: '#2B6CB0' },
    artistic: { name: 'Playful', bg: '#FFF0F5', card: '#FFFFFF', text: '#2D3436', subText: '#B2BEC3', accent: '#DFE6E9', button: '#6C5CE7', highlight: '#FAB1A0', zap: '#FAB1A0' }
};

function App() {
  const [bounties, setBounties] = useState([]);
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [time, setTime] = useState('15M');
  const [view, setView] = useState('market'); 
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [msg, setMsg] = useState(''); 
  const [notification, setNotification] = useState(null);
  const [showXP, setShowXP] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('deepSea');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const theme = THEMES[currentTheme]; 
  const prevCount = useRef(0);

  const refresh = async () => {
    try {
      const { data } = await axios.get(`${API}/bounties`);
      if (data.length > prevCount.current && prevCount.current !== 0) {
        setNotification("New Signal Detected!");
        setTimeout(() => setNotification(null), 4000);
      }
      prevCount.current = data.length;
      setBounties(data);
      if (selectedQuest) {
          const updated = data.find(b => b._id === selectedQuest._id);
          if(updated) setSelectedQuest(updated);
      }
    } catch (err) { console.error("HUD Offline - Server might be sleeping"); }
  };

  useEffect(() => { 
    refresh(); 
    const int = setInterval(refresh, 3000); // Faster polling for global sync
    return () => clearInterval(int);
  }, [selectedQuest?._id]);

  const onSubmit = async (e) => {
      e.preventDefault();
      if(!title || !reward) return;
      try {
          await axios.post(`${API}/bounties`, { title, reward, category, timeEstimate: time });
          setTitle(''); setReward(''); refresh();
      } catch (err) { alert("Server Error"); }
  };

  // 🔥 UPDATED CLAIM LOGIC 🔥
  const handleAction = async (id, action) => {
    try {
        await axios.patch(`${API}/bounties/${id}/${action}`);
        if(action === 'resolve') confetti({ particleCount: 150, spread: 70, colors: [theme.highlight, theme.zap] });
        if(action === 'claim') setNotification("Bounty Secured!");
        refresh();
    } catch (err) {
        // If the server returns 409 (Conflict), it means someone else took it
        if (err.response && err.response.status === 409) {
            alert("⚠️ TOO SLOW! Another agent secured this bounty just milliseconds before you.");
            refresh();
        } else {
            console.error(err);
        }
    }
  };
  const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nishitjayne:admin3210@cluster0.liatzdr.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

  const handleSchedule = async (id, timeStr, status) => {
    await axios.patch(`${API}/bounties/${id}/schedule`, { proposedTime: timeStr, meetingStatus: status });
    refresh();
  };

  const marketplaceBounties = bounties.filter(b => b.status === 'open');
  const myClaims = bounties.filter(b => b.status === 'claimed' || b.status === 'resolved');
  const myPosts = bounties.filter(b => b.requesterName === 'Sarah J.');
  const totalPoints = bounties.filter(b => b.status === 'resolved').length * 50;

  // ... (Rest of styles remain the same) ...
  const bgStyle = { backgroundColor: theme.bg, color: theme.text };
  const cardStyle = { backgroundColor: theme.card, borderColor: theme.accent, color: theme.text };
  const inputStyle = { backgroundColor: theme.bg, borderColor: theme.accent, color: theme.text };
  const btnStyle = { backgroundColor: theme.button, color: '#ffffff' }; 

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans overflow-x-hidden transition-colors duration-500" style={bgStyle}>
      
      {/* THEME PICKER */}
      <div className="fixed top-6 left-6 z-[60]">
        <button onClick={() => setShowThemePicker(!showThemePicker)} className="p-3 rounded-full shadow-lg transition-transform hover:scale-110 border" style={{ backgroundColor: theme.card, borderColor: theme.accent }}>
            <Palette size={20} style={{ color: theme.text }} />
        </button>
        {showThemePicker && (
            <div className="absolute top-14 left-0 p-4 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[160px] border animate-in slide-in-from-top-2" style={{ backgroundColor: theme.card, borderColor: theme.accent }}>
                <p className="text-[10px] uppercase font-black tracking-widest mb-2 opacity-50">Select Theme</p>
                {Object.keys(THEMES).map(key => (
                    <button key={key} onClick={() => { setCurrentTheme(key); setShowThemePicker(false); }} className="text-left text-xs font-bold py-2 px-3 rounded-lg hover:opacity-80 flex items-center gap-2" style={{ backgroundColor: THEMES[key].bg, color: THEMES[key].text, border: `1px solid ${THEMES[key].accent}` }}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEMES[key].button }}></div>
                        {THEMES[key].name}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* XP DASHBOARD */}
      {showXP && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
            <div className="border-2 p-12 rounded-[4rem] text-center max-w-sm w-full shadow-2xl animate-in zoom-in" style={{ backgroundColor: theme.card, borderColor: theme.zap }}>
                <Zap size={64} style={{ color: theme.zap }} className="mx-auto mb-6" fill="currentColor"/>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Rank</h2>
                <div className="text-7xl font-black mb-8 italic" style={{ color: theme.highlight }}>{1240 + totalPoints} XP</div>
                <button onClick={() => setShowXP(false)} className="w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform" style={{ backgroundColor: theme.bg, color: theme.text }}>Close Dashboard</button>
            </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 animate-bounce" style={{ backgroundColor: theme.zap, color: theme.bg }}>
          <Bell size={18} /> {notification}
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-20 pl-16"> 
        <div className="flex items-center gap-6 cursor-pointer" onClick={() => setView('market')}>
          <div className="p-4 rounded-[1.8rem] shadow-xl hover:scale-110 transition-transform" style={{ backgroundColor: theme.button }}>
            <Trophy size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
            KNOWLEDGE<span style={{ color: theme.highlight }}>BOUNTY</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
            <button onClick={() => setView(view === 'admin' ? 'market' : 'admin')} className="flex items-center gap-3 px-8 py-4 rounded-[1.8rem] border-2 shadow-xl hover:scale-105 transition-all active:scale-95" style={{ backgroundColor: '#4a148c', borderColor: '#ffffff', color: '#ffffff' }}>
                {view === 'admin' ? <User size={20} /> : <BarChart3 size={20} />}
                <span className="font-black uppercase text-xs tracking-widest hidden md:inline">{view === 'admin' ? 'My Profile' : 'Analytics'}</span>
            </button>
            <button onClick={() => setShowXP(true)} className="flex items-center gap-3 px-8 py-4 rounded-[1.8rem] border-2 shadow-xl cursor-pointer hover:scale-105 transition-all active:scale-95" style={{ backgroundColor: theme.card, borderColor: theme.zap, color: theme.text }}>
                <Zap size={22} style={{ color: theme.zap }} fill="currentColor"/>
                <span className="text-xl font-black font-mono italic" style={{ color: theme.highlight }}>{1240 + totalPoints}</span>
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {view === 'admin' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-10">
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <Target style={{ color: theme.highlight }} size={28}/>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Missions I'm Solving</h2>
                    </div>
                    <div className="space-y-8">
                        {myClaims.length > 0 ? myClaims.map(b => (
                             <BountyCard key={b._id} b={b} onAction={handleAction} onChat={setSelectedQuest} onSchedule={handleSchedule} theme={theme}/>
                        )) : (
                            <div className="p-10 border border-dashed rounded-[2rem] text-center font-bold uppercase text-xs tracking-widest" style={{ borderColor: theme.accent, color: theme.subText }}>No active missions.</div>
                        )}
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <User style={{ color: theme.button }} size={28}/>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Signals I Broadcasted</h2>
                    </div>
                    <div className="space-y-8">
                        {myPosts.length > 0 ? myPosts.map(b => (
                             <div key={b._id} className="p-8 rounded-[2.5rem] border shadow-sm" style={cardStyle}>
                                 <div className="flex justify-between mb-4 text-[10px] uppercase font-black" style={{ color: theme.subText }}>
                                     <span>{b.category}</span>
                                     <span style={{ color: b.status === 'open' ? theme.highlight : theme.zap }}>{b.status}</span>
                                 </div>
                                 <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                                 <p className="text-xs mb-4 opacity-70">Reward: {b.reward}</p>
                             </div>
                        )) : (
                            <div className="p-10 border border-dashed rounded-[2rem] text-center font-bold uppercase text-xs tracking-widest" style={{ borderColor: theme.accent, color: theme.subText }}>No broadcasts yet.</div>
                        )}
                    </div>
                </section>
            </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                  <div className="border p-10 rounded-[3.8rem] shadow-2xl sticky top-10" style={{ backgroundColor: theme.card, borderColor: theme.accent }}>
                      <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3" style={{ color: theme.subText }}><Plus size={18} /> New Broadcast</h2>
                      <form className="space-y-6" onSubmit={onSubmit}>
                          <input className="w-full rounded-[1.8rem] p-6 text-lg font-bold outline-none border focus:opacity-100 placeholder-opacity-50 transition-all" style={inputStyle} placeholder="Objective..." value={title} onChange={e => setTitle(e.target.value)} />
                          <div className="grid grid-cols-2 gap-4">
                              <div className="relative border rounded-[1.5rem] overflow-hidden transition-colors" style={{ backgroundColor: theme.bg, borderColor: theme.accent }}>
                                  <select className="w-full bg-transparent p-5 text-[10px] font-black uppercase outline-none appearance-none cursor-pointer relative z-10" style={{ color: theme.subText }} value={category} onChange={e => setCategory(e.target.value)}>
                                      <option style={{ color: 'black' }}>Engineering</option>
                                      <option style={{ color: 'black' }}>Sales</option>
                                      <option style={{ color: 'black' }}>HR</option>
                                      <option style={{ color: 'black' }}>Creative</option>
                                  </select>
                                  <Tag size={12} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"/>
                              </div>
                              <div className="relative border rounded-[1.5rem] overflow-hidden transition-colors" style={{ backgroundColor: theme.bg, borderColor: theme.accent }}>
                                  <select className="w-full bg-transparent p-5 text-[10px] font-black uppercase outline-none appearance-none cursor-pointer relative z-10" style={{ color: theme.subText }} value={time} onChange={e => setTime(e.target.value)}>
                                      <option style={{ color: 'black' }} value="5M">5M</option>
                                      <option style={{ color: 'black' }} value="15M">15M</option>
                                      <option style={{ color: 'black' }} value="30M">30M</option>
                                  </select>
                                  <Clock size={12} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"/>
                              </div>
                          </div>
                          <input className="w-full rounded-[1.8rem] p-6 text-lg font-bold outline-none border" style={inputStyle} placeholder="Reward..." value={reward} onChange={e => setReward(e.target.value)} />
                          <button className="w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:opacity-90 active:scale-95 transition-all" style={btnStyle}>Broadcast</button>
                      </form>
                  </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {marketplaceBounties.map(b => (
                      <BountyCard key={b._id} b={b} onAction={handleAction} onChat={setSelectedQuest} onSchedule={handleSchedule} theme={theme}/>
                  ))}
              </div>
          </div>
        )}
      </main>

      {/* CHAT SIDEBAR */}
      {selectedQuest && (
        <aside className="fixed top-0 right-0 h-full w-full md:w-[450px] border-l z-50 p-10 flex flex-col shadow-2xl transition-all" style={{ backgroundColor: theme.bg, borderColor: theme.accent }}>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black uppercase tracking-[0.2em]" style={{ color: theme.highlight }}>Mission Chat</h2>
                <button onClick={() => setSelectedQuest(null)} className="p-2 rounded-full hover:opacity-80" style={{ backgroundColor: theme.card }}><X size={18}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2">
                {selectedQuest.messages?.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.sender === 'Expert' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-5 rounded-[1.5rem] max-w-[85%] text-sm font-bold shadow-md`} style={{ backgroundColor: m.sender === 'Expert' ? theme.button : theme.card, color: m.sender === 'Expert' ? '#fff' : theme.text }}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={async (e) => {
                e.preventDefault(); if(!msg) return;
                await axios.post(`${API}/bounties/${selectedQuest._id}/chat`, { sender: "Expert", text: msg });
                setMsg(''); refresh();
            }} className="flex gap-3 p-3 rounded-[1.8rem] border" style={{ backgroundColor: theme.card, borderColor: theme.accent }}>
                <input className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-bold" style={{ color: theme.text }} placeholder="Transmitting..." value={msg} onChange={e => setMsg(e.target.value)} />
                <button type="submit" className="p-4 rounded-2xl hover:opacity-80 transition-all" style={btnStyle}><Send size={20}/></button>
            </form>
        </aside>
      )}
    </div>
  );
}

function BountyCard({ b, onAction, onChat, onSchedule, theme }) {
    const isClaimed = b.status === 'claimed';
    const isResolved = b.status === 'resolved';

    const containerStyle = {
        backgroundColor: theme.card,
        borderColor: isClaimed ? theme.highlight : theme.accent,
        opacity: isResolved ? 0.6 : 1
    };

    return (
        <div className={`p-10 rounded-[3.8rem] border-2 transition-all duration-500 transform ${isClaimed ? 'scale-105 shadow-2xl' : 'hover:scale-[1.02]'}`} style={containerStyle}>
            <div className="flex justify-between items-center mb-10 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.subText }}>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: theme.accent }}><Tag size={12}/> {b.category}</span>
                <span className="flex items-center gap-2"><Clock size={12}/> {b.timeEstimate}</span>
            </div>
            <h3 className="text-4xl font-black mb-10 italic lowercase tracking-tighter">{b.title}</h3>
            <div className="w-fit px-6 py-3 rounded-2xl flex items-center gap-3 mb-10 font-bold uppercase text-[10px] tracking-widest border" style={{ backgroundColor: theme.bg, color: theme.highlight, borderColor: theme.accent }}>
                 <Gift size={18}/> {b.reward}
            </div>

            {isClaimed && (
                <div className="mb-8 p-6 rounded-[2.5rem] border space-y-4" style={{ backgroundColor: theme.bg, borderColor: theme.accent }}>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.zap }}>Meeting Coordination</p>
                   {b.meetingStatus === 'agreed' ? (
                       <div className="py-4 px-6 rounded-2xl text-xs font-bold text-center border" style={{ backgroundColor: theme.card, color: theme.highlight, borderColor: theme.highlight }}>
                           Locked: {b.proposedTime}
                       </div>
                   ) : (
                       <div className="space-y-3">
                           <input type="text" placeholder="Suggest Time (e.g. 3PM)" className="w-full rounded-2xl p-4 text-xs font-bold outline-none border transition-all" style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.accent }} onBlur={(e) => onSchedule(b._id, e.target.value, 'proposed')} defaultValue={b.proposedTime} />
                           {b.meetingStatus === 'proposed' && 
                                <button onClick={() => onSchedule(b._id, b.proposedTime, 'agreed')} className="w-full py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:opacity-90" style={{ backgroundColor: theme.highlight, color: theme.bg }}>
                                    Confirm Meet
                                </button>
                           }
                       </div>
                   )}
                </div>
            )}

            <div className="space-y-4">
                {b.status === 'open' && 
                    <button onClick={() => onAction(b._id, 'claim')} className="w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all" style={{ backgroundColor: theme.highlight, color: theme.bg }}>
                        Claim Bounty
                    </button>
                }
                {isClaimed && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <a href="slack://open" className="py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:opacity-80 text-white bg-[#4A154B]"><ExternalLink size={14}/> Slack Bridge</a>
                        <a href="msteams://open" className="py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:opacity-80 text-white bg-[#6264A7]"><ExternalLink size={14}/> Teams Link</a>
                    </div>
                    <button onClick={() => onChat(b)} className="w-full py-4 border rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-all" style={{ borderColor: theme.accent, color: theme.text }}>
                        <MessageSquare size={16}/> Comms
                    </button>
                    <button onClick={() => onAction(b._id, 'resolve')} className="w-full py-6 rounded-[2rem] font-black uppercase text-xs shadow-2xl transition-all active:scale-95 hover:opacity-90" style={{ backgroundColor: theme.button, color: '#fff' }}>
                        Complete Mission
                    </button>
                  </div>
                )}
                {isResolved && 
                    <div className="w-full py-6 border rounded-[2rem] flex items-center justify-center gap-4 font-black uppercase text-xs tracking-[0.3em] shadow-inner" style={{ borderColor: theme.highlight, color: theme.highlight, backgroundColor: theme.bg }}>
                        <ShieldCheck size={24}/> Bounty Secured
                    </div>
                }
            </div>
        </div>
    );
}

export default App;