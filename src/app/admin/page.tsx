'use client';
import React, { useEffect, useState } from 'react';
import { getAdminStats, getUserDetails } from '../actions';
import { Users, HardDrive, ShieldCheck, Eye, Download, X, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const res = await getAdminStats();
    if (res.success) setData(res);
    setLoading(false);
  }

  async function handleViewUser(email: string) {
    const res = await getUserDetails(email);
    if (res.success) setSelectedUser(res);
  }

  if (loading) return <div className="p-20 text-center font-mono">Accessing Records...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black mb-8 flex items-center gap-2"><ShieldCheck className="text-blue-600"/> MASTER CONTROL</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
            <div><p className="text-[10px] font-bold text-slate-400 uppercase">Users</p><h2 className="text-3xl font-black">{data?.users?.length}</h2></div>
            <Users size={32} className="text-slate-200" />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
            <div><p className="text-[10px] font-bold text-slate-400 uppercase">Files</p><h2 className="text-3xl font-black">{data?.vaultFiles?.length}</h2></div>
            <HardDrive size={32} className="text-slate-200" />
          </div>
        </div>

        {/* USER LIST */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr>
                <th className="p-6">User</th>
                <th className="p-6">Email</th>
                <th className="p-6">Vault Items</th>
                <th className="p-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.users.map((u: any) => (
                <tr key={u.email} className="hover:bg-slate-50/50">
                  <td className="p-6 font-bold">{u.name}</td>
                  <td className="p-6 text-slate-500 text-sm">{u.email}</td>
                  <td className="p-6 font-mono text-blue-600">{data.vaultFiles.filter((f:any)=>f.user_email === u.email).length}</td>
                  <td className="p-6">
                    <button onClick={() => handleViewUser(u.email)} className="flex items-center gap-2 text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                      <Eye size={14}/> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedUser.user.name}</h2>
                <p className="text-slate-400 text-sm">{selectedUser.user.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/10 rounded-full transition"><X/></button>
            </div>
            
            <div className="p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Vaulted Files</h3>
              {selectedUser.files.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {selectedUser.files.map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20}/>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[200px]">{file.file_name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{file.file_type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={`/uploads/${file.file_name}`} target="_blank" className="p-2 bg-white border rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"><Eye size={16}/></a>
                        <a href={`/uploads/${file.file_name}`} download={file.file_name} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"><Download size={16}/></a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-slate-400 italic">No files in vault yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}