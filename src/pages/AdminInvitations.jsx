import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInvite, setNewInvite] = useState({ email: "", role: "" });
  const [sending, setSending] = useState(false);

  const API_BASE = "http://localhost:4000/api";

  const fetchInvitations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/invite/all`);
      setInvitations(res.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (e) => {
    e.preventDefault();
    if (!newInvite.email || !newInvite.role) {
      alert("Please enter both email and role");
      return;
    }
    setSending(true);
    try {
      const res = await axios.post(`${API_BASE}/invite`, newInvite);
      alert("✅ Invitation sent successfully");
      setNewInvite({ email: "", role: "" });
      fetchInvitations();
    } catch (err) {
      console.error("Error sending invitation:", err);
      alert("❌ Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const resendInvitation = async (email, role, token) => {
    await axios.post(`${API_BASE}/invite/resend`, { email, role, token });
    alert(`📨 Invitation resent to ${email}`);
  };

  const deleteInvitation = async (email) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      await axios.delete(`${API_BASE}/invite/${email}`);
      setInvitations(invitations.filter((i) => i.email !== email));
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  if (loading) return <p className="text-center py-10">Loading invitations...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold mb-4">Finance System Invitations</h1>

      {/* 📨 Create New Invitation */}
      <form onSubmit={sendInvitation} className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Send New Invitation</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="Enter user email"
            value={newInvite.email}
            onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
          <select
            value={newInvite.role}
            onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          >
            <option value="">Select Role</option>
            <option value="Finance Officer">Finance Officer</option>
            <option value="Finance Manager">Finance Manager</option>
            <option value="Chief Accountant">Chief Accountant</option>
          </select>
          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </form>

      {/* 📋 Invitation List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Sent On</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invite) => (
              <tr key={invite.email} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{invite.email}</td>
                <td className="py-3 px-4">{invite.role}</td>
                <td className="py-3 px-4">
                  {invite.status === "pending" ? (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded">Pending</span>
                  ) : (
                    <span className="bg-green-600 text-white px-3 py-1 rounded">Active</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {new Date(invite.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  {invite.status === "pending" && (
                    <button
                      onClick={() => resendInvitation(invite.email, invite.role, invite.token)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Resend
                    </button>
                  )}
                  <button
                    onClick={() => deleteInvitation(invite.email)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
