import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Communications() {
  const [communications, setCommunications] = useState([]);
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelMessages, setChannelMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "Finance Officer" });
  const [messageForm, setMessageForm] = useState({ recipient: "", subject: "", message: "" });
  const [channelForm, setChannelForm] = useState({ name: "", description: "", is_private: false });
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCommunications();
    fetchUsers();
    fetchChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchChannelMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCommunications = async () => {
    try {
      const response = await axios.get(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications`);
      setCommunications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching communications:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications/users`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications/channels`);
      setChannels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const fetchChannelMessages = async (channelId) => {
    try {
      const response = await axios.get(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications/channels/${channelId}/messages`);
      setChannelMessages(response.data.data || []);
    } catch (error) {
      console.error("Error fetching channel messages:", error);
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/invite`, inviteForm);
      alert("Invitation sent successfully!");
      setShowInviteModal(false);
      setInviteForm({ email: "", role: "Finance Officer" });
      fetchCommunications();
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications/message`, messageForm);
      alert("Message sent successfully!");
      setShowMessageModal(false);
      setMessageForm({ recipient: "", subject: "", message: "" });
      fetchCommunications();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications/channels`, channelForm);
      alert("Channel created successfully!");
      setShowChannelModal(false);
      setChannelForm({ name: "", description: "", is_private: false });
      fetchChannels();
    } catch (error) {
      console.error("Error creating channel:", error);
      alert("Failed to create channel");
    }
  };

  const handleSendChannelMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      await axios.post(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications/channels/${selectedChannel.id}/messages`, {
        message: newMessage
      });
      setNewMessage("");
      fetchChannelMessages(selectedChannel.id);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleJoinChannel = async (channelId) => {
    try {
      setActionLoading(true);
      await axios.post(`${window.location.origin.includes('localhost') ? 'http://localhost:4000' : 'https://finance-system-1.onrender.com'}/api/communications/channels/${channelId}/join`);
      alert("Successfully joined channel!");
      await fetchChannels();
      // Set the joined channel as selected to keep user in the channel
      const joinedChannel = channels.find(c => c.id === channelId);
      if (joinedChannel) {
        setSelectedChannel(joinedChannel);
      }
    } catch (error) {
      console.error("Error joining channel:", error);
      alert("Failed to join channel");
    } finally {
      setActionLoading(false);
    }
  };



  if (loading) {
    return <div className="loading">Loading communications...</div>;
  }

  return (
    <div className="page">
      <h2>💬 Team Communications</h2>

      <div className="summary-cards">
        <div className="card">
          <h3>Total Communications</h3>
          <p>{communications.length}</p>
        </div>
        <div className="card">
          <h3>Team Members</h3>
          <p>{users.length}</p>
        </div>
        <div className="card">
          <h3>Channels</h3>
          <p>{channels.length}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => setShowInviteModal(true)}>
          📧 Send Invitation
        </button>
        <button className="btn-primary" onClick={() => setShowMessageModal(true)}>
          💬 Send Message
        </button>
        <button className="btn-primary" onClick={() => setShowChannelModal(true)}>
          ➕ Create Channel
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", height: "600px" }}>
        {/* Channels Sidebar */}
        <div style={{ width: "300px", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px", background: "#f9fafb" }}>
          <h3 style={{ marginTop: 0 }}>📋 Channels</h3>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                style={{
                  padding: "10px",
                  marginBottom: "5px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background: selectedChannel?.id === channel.id ? "#e5e7eb" : "transparent",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>#{channel.name}</strong>
                  {channel.is_private && <span style={{ marginLeft: "5px", color: "#6b7280" }}>🔒</span>}
                  <br />
                  <small style={{ color: "#6b7280" }}>{channel.members.length} members</small>
                </div>
                {!channel.members.includes("finance@dicthelifecoach.com") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinChannel(channel.id);
                    }}
                    style={{ fontSize: "12px", padding: "2px 6px" }}
                    className="btn-secondary"
                  >
                    Join
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", flexDirection: "column" }}>
          {selectedChannel ? (
            <>
              <div style={{ padding: "15px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                <h3 style={{ margin: 0 }}>#{selectedChannel.name}</h3>
                <p style={{ margin: "5px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
                  {selectedChannel.description}
                </p>
              </div>

              <div style={{ flex: 1, padding: "15px", overflowY: "auto", maxHeight: "450px" }}>
                {channelMessages.map((msg) => (
                  <div key={msg.id} style={{ marginBottom: "15px", padding: "10px", background: "#f9fafb", borderRadius: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                      <strong style={{ fontSize: "14px" }}>{msg.sender}</strong>
                      <span style={{ marginLeft: "10px", fontSize: "12px", color: "#6b7280" }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px" }}>{msg.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendChannelMessage} style={{ padding: "15px", borderTop: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: "8px 16px" }}>
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6b7280" }}>
              <div style={{ textAlign: "center" }}>
                <h3>💬 Select a channel</h3>
                <p>Choose a channel from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Recent Communications */}
      <div className="list" style={{ marginTop: "30px" }}>
        <h3>📧 Recent Communications</h3>
        {communications.length === 0 ? (
          <p>No communications yet.</p>
        ) : (
          communications.slice(0, 5).map((comm) => (
            <div key={comm.id} className="list-item">
              <h4>{comm.subject}</h4>
              <p><strong>From:</strong> {comm.sender}</p>
              <p><strong>To:</strong> {comm.recipient}</p>
              <p><strong>Type:</strong> {comm.type}</p>
              <p><strong>Date:</strong> {new Date(comm.timestamp).toLocaleString()}</p>
              <p>{comm.message}</p>
              {comm.status && <p><strong>Status:</strong> {comm.status}</p>}
            </div>
          ))
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Send Invitation</h3>
            <form onSubmit={handleSendInvitation}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                >
                  <option value="Finance Officer">Finance Officer</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="btn-primary">Send Invitation</button>
                <button type="button" onClick={() => setShowInviteModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Send Message</h3>
            <form onSubmit={handleSendMessage}>
              <div className="form-group">
                <label>Recipient:</label>
                <select
                  value={messageForm.recipient}
                  onChange={(e) => setMessageForm({ ...messageForm, recipient: e.target.value })}
                  required
                >
                  <option value="">Select recipient</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.email}>{user.email} ({user.role})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject:</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  rows="4"
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="btn-primary">Send Message</button>
                <button type="button" onClick={() => setShowMessageModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Channel Modal */}
      {showChannelModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Channel</h3>
            <form onSubmit={handleCreateChannel}>
              <div className="form-group">
                <label>Channel Name:</label>
                <input
                  type="text"
                  value={channelForm.name}
                  onChange={(e) => setChannelForm({ ...channelForm, name: e.target.value })}
                  placeholder="e.g., project-updates"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  placeholder="Brief description of the channel"
                />
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={channelForm.is_private}
                    onChange={(e) => setChannelForm({ ...channelForm, is_private: e.target.checked })}
                  />
                  Private Channel
                </label>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="btn-primary">Create Channel</button>
                <button type="button" onClick={() => setShowChannelModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
