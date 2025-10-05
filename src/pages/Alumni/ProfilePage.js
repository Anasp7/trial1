import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Profile from '../../components/Profile';
import { profileApi } from '../../services/profileApi';
import { useAuthLite } from '../../hooks/useAuthLite';

const AlumniProfilePage = () => {
  const { user: ctxUser } = useAuth();
  const { user: liteUser } = useAuthLite();
  const authUserId = (ctxUser && ctxUser.id) || (liteUser && liteUser.id) || null;
  const params = useParams();
  const routeId = params.id ? Number(params.id) : null;
  const viewingUserId = routeId || authUserId;
  const isOwnProfile = !routeId;
  const type = 'alumni';

  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const lastSavedRef = useRef(null);

  const load = useCallback(async () => {
    if (!viewingUserId) {
      setLoading(false);
      setError('User not found');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { profile: p } = await profileApi.getProfile(type, viewingUserId);
      const normalized = {
        type,
        id: p.id ?? viewingUserId,
        user_id: p.user_id ?? viewingUserId,
        name: p.name ?? '',
        email: p.email ?? '',
        phone: p.phone ?? '',
        location: p.location ?? '',
        bio: p.bio ?? '',
        linkedIn: p.linkedIn ?? p.linkedin ?? '',
        github: p.github ?? '',
        profile_pic: p.profile_pic ?? '',
        occupation: p.occupation ?? '',
        company: p.company ?? '',
        workingDomain: p.workingDomain ?? p.domain ?? '',
      };
      setProfile(normalized);
      lastSavedRef.current = normalized;
      setDraft({});
    } catch (e) {
      setError(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [viewingUserId]);

  useEffect(() => { load(); }, [load]);

  const merged = useMemo(() => (profile ? { ...profile, ...draft } : null), [profile, draft]);

  const validate = () => {
    if (!merged) return 'Invalid profile';
    if (merged.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merged.email)) return 'Invalid email format';
    const urlOk = (v) => !v || /^https?:\/\/.+/i.test(v);
    if (!urlOk(merged.linkedIn)) return 'LinkedIn must be a valid URL';
    if (!urlOk(merged.github)) return 'GitHub must be a valid URL';
    return null;
  };

  const onChange = (changes) => {
    if (!isOwnProfile) return;
    if (!isEditing) setIsEditing(true);
    setDraft((d) => ({ ...d, ...changes }));
  };

  const onCancel = () => {
    if (lastSavedRef.current) setProfile(lastSavedRef.current);
    setDraft({});
    setIsEditing(false);
    setError(null);
  };

  const onSave = async () => {
    if (!isOwnProfile) return;
    const err = validate();
    if (err) { setError(err); return; }
    if (!merged || !authUserId) return;

    const prev = lastSavedRef.current;
    lastSavedRef.current = merged;
    setProfile(merged);
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: merged.name,
        email: merged.email,
        phone: merged.phone,
        location: merged.location,
        bio: merged.bio,
        linkedIn: merged.linkedIn,
        github: merged.github,
        occupation: merged.occupation,
        company: merged.company,
        workingDomain: merged.workingDomain,
      };
      const { profile: saved } = await profileApi.updateProfile(type, authUserId, payload);
      const normalized = {
        type,
        id: saved.id ?? merged.id,
        user_id: saved.user_id ?? merged.user_id,
        name: saved.name ?? '',
        email: saved.email ?? '',
        phone: saved.phone ?? '',
        location: saved.location ?? '',
        bio: saved.bio ?? '',
        linkedIn: saved.linkedIn ?? saved.linkedin ?? '',
        github: saved.github ?? '',
        profile_pic: saved.profile_pic ?? merged.profile_pic ?? '',
        occupation: saved.occupation ?? '',
        company: saved.company ?? '',
        workingDomain: saved.workingDomain ?? saved.domain ?? '',
      };
      setProfile(normalized);
      lastSavedRef.current = normalized;
      setDraft({});
    setIsEditing(false);
    } catch (e) {
      if (prev) { setProfile(prev); lastSavedRef.current = prev; }
      setError(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Profile
      profile={merged ? { ...merged, type } : null}
      isEditing={isOwnProfile && isEditing}
      onChange={onChange}
      onSave={onSave}
      onCancel={onCancel}
      loading={loading}
      saving={saving}
      error={error}
    />
  );
};

export default AlumniProfilePage;
