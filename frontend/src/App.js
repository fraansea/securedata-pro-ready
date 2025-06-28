import React, { useState, useEffect } from 'react';
import './App.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Auth form state
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, currentFolder]);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load folders
      const foldersResponse = await fetch(`${API_URL}/api/folders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (foldersResponse.ok) {
        const foldersData = await foldersResponse.json();
        setFolders(foldersData);
      }

      // Load files
      const filesUrl = currentFolder 
        ? `${API_URL}/api/files?folder_id=${currentFolder.id}`
        : `${API_URL}/api/files`;
      
      const filesResponse = await fetch(filesUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setFiles(filesData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authForm),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthForm({ email: '', password: '', name: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setFiles([]);
    setFolders([]);
    setCurrentFolder(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (currentFolder) {
      formData.append('folder_id', currentFolder.id);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        loadData();
        e.target.value = '';
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFolderName,
          parent_id: currentFolder?.id || null,
        }),
      });

      if (response.ok) {
        setNewFolderName('');
        setShowCreateFolder(false);
        loadData();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Create folder error:', error);
      alert('Failed to create folder');
    }
  };

  const viewFile = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/files/${file.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const fileData = await response.json();
        setSelectedFile({
          ...file,
          content: fileData.content,
        });
      }
    } catch (error) {
      console.error('Failed to load file:', error);
      alert('Failed to load file');
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadData();
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Google login success handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/google`, {
        credential: credentialResponse.credential,
      });
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        alert('Google login failed');
      }
    } catch (error) {
      alert('Google login failed');
    }
  };

  // Phone/OTP logic
  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, { phone });
      if (response.status === 200) {
        setOtpSent(true);
        alert('OTP sent!');
      } else {
        alert('Failed to send OTP');
      }
    } catch (error) {
      alert('Failed to send OTP');
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { phone, otp });
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        alert('OTP verification failed');
      }
    } catch (error) {
      alert('OTP verification failed');
    }
    setOtpLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Secure Vault</h1>
              <p className="text-white/70">Your private file & image hideaway</p>
            </div>

            <div className="flex mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-purple-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-purple-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>

            <div style={{ margin: '16px 0' }}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => alert('Google login failed')}
                width="100%"
              />
            </div>
            <div style={{ margin: '16px 0' }}>
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', marginBottom: 8 }}
              />
              {otpSent ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                  <button onClick={handleVerifyOtp} disabled={otpLoading} style={{ width: '100%' }}>
                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </>
              ) : (
                <button onClick={handleSendOtp} disabled={otpLoading} style={{ width: '100%' }}>
                  {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              )}
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Secure Vault</h1>
                  <p className="text-white/70 text-sm">Welcome, {user?.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Navigation */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-white/70 mb-4">
              <button
                onClick={() => setCurrentFolder(null)}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              {currentFolder && (
                <>
                  <span>/</span>
                  <span className="text-white">{currentFolder.name}</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <label className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all cursor-pointer flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <button
                onClick={() => setShowCreateFolder(true)}
                className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Folder</span>
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
              </button>
            </div>
          </div>

          {/* Folders */}
          {folders.filter(f => f.parent_id === (currentFolder?.id || null)).length > 0 && (
            <div className="mb-8">
              <h2 className="text-white text-lg font-semibold mb-4">Folders</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders
                  .filter(f => f.parent_id === (currentFolder?.id || null))
                  .map(folder => (
                    <div
                      key={folder.id}
                      onClick={() => setCurrentFolder(folder)}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all border border-white/10"
                    >
                      <svg className="w-12 h-12 text-yellow-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                      </svg>
                      <p className="text-white text-sm font-medium truncate">{folder.name}</p>
                      <p className="text-white/50 text-xs">{folder.file_count} files</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Files */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Files</h2>
            {files.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-white/50">No files in this folder</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2"}>
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all ${
                      viewMode === 'grid' ? 'p-4 text-center' : 'p-3 flex items-center space-x-3'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          {file.is_image ? (
                            <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                          ) : (
                            <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-white text-sm font-medium truncate">{file.filename}</p>
                        <p className="text-white/50 text-xs">{formatFileSize(file.size)}</p>
                        <div className="flex justify-center space-x-2 mt-3">
                          <button
                            onClick={() => viewFile(file)}
                            className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded text-xs hover:bg-blue-500/30 transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 flex items-center justify-center">
                          {file.is_image ? (
                            <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{file.filename}</p>
                          <p className="text-white/50 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewFile(file)}
                            className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded text-xs hover:bg-blue-500/30 transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20">
              <h3 className="text-white text-lg font-semibold mb-4">Create New Folder</h3>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Viewer Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-semibold">{selectedFile.filename}</h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                {selectedFile.is_image ? (
                  <img
                    src={`data:${selectedFile.file_type};base64,${selectedFile.content}`}
                    alt={selectedFile.filename}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg mx-auto"
                  />
                ) : (
                  <div className="bg-white/5 rounded-lg p-8">
                    <svg className="w-16 h-16 text-white/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <p className="text-white/70 mb-4">File preview not available</p>
                    <a
                      href={`data:${selectedFile.file_type};base64,${selectedFile.content}`}
                      download={selectedFile.filename}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;