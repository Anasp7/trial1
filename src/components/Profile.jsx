import React from 'react';

const inputBase = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500';
const labelBase = 'block text-sm font-medium text-gray-700 mb-2';

const Profile = ({ profile, isEditing, onChange, onSave, onCancel, loading, saving, error }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Retry</button>
      </div>
    );
  }

  if (!profile) return null;

  const isAlumni = profile?.type === 'alumni';
  const isStudent = profile?.type === 'student';

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        {profile.profile_pic ? (
          <img src={profile.profile_pic} alt={profile.name} className="w-20 h-20 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-700">
            {profile.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.name || 'Profile'}</h1>
          <p className="text-gray-600 mt-1 capitalize">{profile.type}</p>
          {!isEditing && (
            <div className="flex items-center space-x-3 mt-2">
              {profile.linkedIn && (
                <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                  <img alt="LinkedIn" src="https://www.svgrepo.com/show/157006/linkedin.svg" className="w-5 h-5 mr-1" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center text-gray-800 hover:text-black">
                  <img alt="GitHub" src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5 mr-1" />
                  <span className="text-sm">GitHub</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelBase}>Name</label>
            <input type="text" className={inputBase} value={profile.name || ''} onChange={(e)=>onChange({ name: e.target.value })} disabled={!isEditing} placeholder="Your full name" />
          </div>
          <div>
            <label className={labelBase}>Email</label>
            <input type="email" className={inputBase} value={profile.email || ''} onChange={(e)=>onChange({ email: e.target.value })} disabled={!isEditing} placeholder="you@example.com" />
          </div>
          <div>
            <label className={labelBase}>Phone</label>
            <input type="tel" className={inputBase} value={profile.phone || ''} onChange={(e)=>onChange({ phone: e.target.value })} disabled={!isEditing} placeholder="+1 555 555 5555" />
          </div>
          <div>
            <label className={labelBase}>Location</label>
            <input type="text" className={inputBase} value={profile.location || ''} onChange={(e)=>onChange({ location: e.target.value })} disabled={!isEditing} placeholder="City, Country" />
          </div>
          <div>
            <label className={labelBase}>LinkedIn</label>
            <input type="url" className={inputBase} value={profile.linkedIn || ''} onChange={(e)=>onChange({ linkedIn: e.target.value })} disabled={!isEditing} placeholder="https://www.linkedin.com/in/username" />
          </div>
          <div>
            <label className={labelBase}>GitHub</label>
            <input type="url" className={inputBase} value={profile.github || ''} onChange={(e)=>onChange({ github: e.target.value })} disabled={!isEditing} placeholder="https://github.com/username" />
          </div>
          <div className="md:col-span-2">
            <label className={labelBase}>Bio</label>
            <textarea rows={4} className={inputBase} value={profile.bio || ''} onChange={(e)=>onChange({ bio: e.target.value })} disabled={!isEditing} placeholder="Tell us about yourself..." />
          </div>

          {isAlumni && (
            <>
              <div>
                <label className={labelBase}>Occupation</label>
                <input type="text" className={inputBase} value={profile.occupation || ''} onChange={(e)=>onChange({ occupation: e.target.value })} disabled={!isEditing} placeholder="Software Engineer" />
              </div>
              <div>
                <label className={labelBase}>Company</label>
                <input type="text" className={inputBase} value={profile.company || ''} onChange={(e)=>onChange({ company: e.target.value })} disabled={!isEditing} placeholder="Acme Inc." />
              </div>
              <div className="md:col-span-2">
                <label className={labelBase}>Working Domain</label>
                <input type="text" className={inputBase} value={profile.workingDomain || ''} onChange={(e)=>onChange({ workingDomain: e.target.value })} disabled={!isEditing} placeholder="Web, AI/ML, Cloud..." />
              </div>
            </>
          )}

          {isStudent && (
            <>
              <div>
                <label className={labelBase}>CGPA (0 - 10)</label>
                <input type="number" step="0.01" min={0} max={10} className={inputBase} value={profile.cgpa ?? ''} onChange={(e)=>onChange({ cgpa: e.target.value === '' ? null : Number(e.target.value) })} disabled={!isEditing} placeholder="e.g. 8.50" />
              </div>
              <div>
                <label className={labelBase}>Category</label>
                <input type="text" className={inputBase} value={profile.category || ''} onChange={(e)=>onChange({ category: e.target.value })} disabled={!isEditing} placeholder="General / OBC / SC / ST / EWS" />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          {!isEditing ? (
            <button onClick={()=>onChange({})} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">Edit</button>
          ) : (
            <>
              <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors" disabled={!!saving}>Cancel</button>
              <button onClick={onSave} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!!saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


