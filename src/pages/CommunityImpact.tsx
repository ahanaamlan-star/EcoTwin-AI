import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  ThumbsUp, 
  TreePine, 
  Smile, 
  Building2, 
  Wind, 
  Sun, 
  CheckCircle2, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { TwinRegion } from '../types';

interface CommunityImpactProps {
  region: TwinRegion;
}

export const CommunityImpact: React.FC<CommunityImpactProps> = ({ region }) => {
  const [votedPoll, setVotedPoll] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState({ yes: 1420, no: 180 });

  const communityProjects = [
    {
      id: 1,
      name: 'Harbor Linear Micro-Park & Bio-Swale',
      district: 'Harbor Delta Logistics Port',
      budget: '$4.2M',
      jobsCreated: 85,
      co2Offset: '1,400 tons/yr',
      supportCount: 842,
      status: 'Approved'
    },
    {
      id: 2,
      name: 'Central Plaza Cool-Roof & Solar Canopy Mandate',
      district: 'Central Financial Plaza',
      budget: '$12.5M',
      jobsCreated: 210,
      co2Offset: '8,200 tons/yr',
      supportCount: 1250,
      status: 'Voting Phase'
    },
    {
      id: 3,
      name: 'Miyawaki Forest Corridor Expansion',
      district: 'Green Ridge Residential Zone',
      budget: '$1.8M',
      jobsCreated: 42,
      co2Offset: '3,100 tons/yr',
      supportCount: 960,
      status: 'In Progress'
    }
  ];

  const handleVote = (option: 'yes' | 'no') => {
    if (votedPoll !== null) return;
    setPollVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1
    }));
    setVotedPoll(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest font-mono">
              CITIZEN TRANSPARENCY DASHBOARD
            </span>
            <span className="text-xs text-white/40">• Open Public Data</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Community Environmental Impact & Citizen Voice
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Transparent climate equity metrics, green job generation, and community policy feedback.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono">
          <Smile className="w-4 h-4 text-emerald-400" />
          <span className="text-white/80">Community Health Score: <strong className="text-emerald-400">88 / 100</strong></span>
        </div>
      </div>

      {/* Community Impact Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-1 backdrop-blur-xl">
          <span className="text-[10px] text-white/40 font-mono font-bold block uppercase">GREEN JOBS CREATED</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">1,240</div>
          <span className="text-[10px] text-white/40">Clean tech, solar, and forestry</span>
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-1 backdrop-blur-xl">
          <span className="text-[10px] text-white/40 font-mono font-bold block uppercase">AIR QUALITY IMPROVEMENT</span>
          <div className="text-2xl font-bold font-mono text-teal-300">+22% AQI</div>
          <span className="text-[10px] text-white/40">Compared to 2022 baseline</span>
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-1 backdrop-blur-xl">
          <span className="text-[10px] text-white/40 font-mono font-bold block uppercase">NEW GREEN SPACE</span>
          <div className="text-2xl font-bold font-mono text-cyan-300">142 Hectares</div>
          <span className="text-[10px] text-white/40">Bio-swales & micro-parks</span>
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-1 backdrop-blur-xl">
          <span className="text-[10px] text-white/40 font-mono font-bold block uppercase">PUBLIC POLICY PARTICIPATION</span>
          <div className="text-2xl font-bold font-mono text-amber-300">42,500 Votes</div>
          <span className="text-[10px] text-white/40">Active citizen engagement</span>
        </div>
      </div>

      {/* Citizen Feedback Poll */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
            <ThumbsUp className="w-4 h-4 text-emerald-400 mr-2" /> Active Municipal Citizen Poll
          </h3>
          <span className="text-[10px] text-white/40 font-mono">Closes in 5 Days</span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
          <p className="text-xs font-bold text-white leading-relaxed">
            Should the city council mandate that 40% of all commercial rooftops larger than 1,000 m² be equipped with solar panels or green vegetative gardens by 2028?
          </p>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleVote('yes')}
              disabled={votedPoll !== null}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                votedPoll !== null
                  ? 'bg-white/5 text-white/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] font-semibold'
              }`}
            >
              Support Mandate ({pollVotes.yes})
            </button>
            <button
              onClick={() => handleVote('no')}
              disabled={votedPoll !== null}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                votedPoll !== null
                  ? 'bg-white/5 text-white/40'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              Oppose Mandate ({pollVotes.no})
            </button>
          </div>

          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${((pollVotes?.yes || 0) + (pollVotes?.no || 0)) > 0 ? ((pollVotes.yes / (pollVotes.yes + pollVotes.no)) * 100) : 0}%` }}
            />
            <div
              className="bg-white/20 h-full transition-all"
              style={{ width: `${((pollVotes?.yes || 0) + (pollVotes?.no || 0)) > 0 ? ((pollVotes.no / (pollVotes.yes + pollVotes.no)) * 100) : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/40">
            <span>{((pollVotes?.yes || 0) + (pollVotes?.no || 0)) > 0 ? ((((pollVotes?.yes || 0) / ((pollVotes?.yes || 0) + (pollVotes?.no || 0))) * 100).toFixed(1)) : '0.0'}% Yes</span>
            <span>{((pollVotes?.yes || 0) + (pollVotes?.no || 0)) > 0 ? ((((pollVotes?.no || 0) / ((pollVotes?.yes || 0) + (pollVotes?.no || 0))) * 100).toFixed(1)) : '0.0'}% No</span>
          </div>
        </div>
      </div>

      {/* Community Projects List */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
          <TreePine className="w-4 h-4 text-emerald-400 mr-2" /> Active Neighborhood Resilience Projects
        </h3>

        <div className="space-y-3">
          {communityProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-white">{proj.name}</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    {proj.status}
                  </span>
                </div>
                <div className="text-[10px] text-white/40 mt-1 flex items-center space-x-3 font-mono">
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-emerald-400" /> {proj.district}</span>
                  <span>Budget: {proj.budget}</span>
                  <span>Jobs: {proj.jobsCreated}</span>
                  <span>CO2: -{proj.co2Offset}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-emerald-400">{proj.supportCount} Supporters</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
