'use client';
import { useState } from 'react';
import { saveWisdom } from '@/app/actions'; // Import the new action

export default function MindSeeder({ email }: { email: string }) {
  const [thought, setThought] = useState('');
  const [status, setStatus] = useState('');

  const handleSaveThought = async () => {
    if (!thought) return;
    setStatus('Seeding Mind...');
    
    const result = await saveWisdom(email, thought); // Call the DB action
    
    if (result.success) {
        setStatus('Wisdom Seeded to Vault! ✅');
        setThought('');
        // Reset status after 3 seconds
        setTimeout(() => setStatus(''), 3000);
    } else {
        setStatus('Failed to seed ❌');
    }
  };

  return (
    <div className="p-6 bg-white/5 rounded-3xl text-center border border-white/10">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-400">
        {status || 'Add to your Digital Mind'}
      </p>
      <textarea 
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder="Share a piece of wisdom or a core belief..."
        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white mb-4 outline-none focus:ring-2 focus:ring-blue-500 h-24"
      />
      <button 
        onClick={handleSaveThought}
        disabled={!thought}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-30"
      >
        Seed Wisdom
      </button>
    </div>
  );
}