import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../api/users';
import { authApi } from '../api/auth';

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi
      .getMe()
      .then((me) => setBio(me.profile?.bio || ''))
      .catch(() => {});
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userApi.updateMe({ bio });
      authApi.saveUser(updated);
      toast('Profile updated', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container container-narrow">
      <h1>My account</h1>
      <div className="card">
        <h2>Profile</h2>
        <form className="form" onSubmit={saveProfile}>
          <div className="summary-row">
            <span>Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="summary-row">
            <span>Role</span>
            <span>{user?.role}</span>
          </div>
          <label>
            Bio
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
