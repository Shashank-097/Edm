'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_PASSWORD = '12341234';
const MAX_WORDS_PREVIEW = 100;

type Media = { images: string[]; videos: string[] };

function truncateWords(text: string, maxWords: number) {
  const words = text.split(/\s+/);
  return words.length <= maxWords
    ? text
    : words.slice(0, maxWords).join(' ') + '...';
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'saved'>('new');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [media, setMedia] = useState<Media>({ images: [], videos: [] });
  const [savedPosts, setSavedPosts] = useState<
    { title: string; content: string; author: string; date: string; media: Media; category: string }[]
  >([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [expandedPostIdx, setExpandedPostIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  // Load saved posts from localStorage
  useEffect(() => {
    const postsStr = localStorage.getItem('blog-posts');
    if (postsStr) {
      try {
        const parsed = JSON.parse(postsStr);
        const normalized = parsed.map((p: any) => ({
          ...p,
          media: p.media || { images: [], videos: [] },
        }));
        setSavedPosts(normalized);
      } catch (err) {
        console.error('Error parsing saved posts:', err);
      }
    }
  }, []);

  // ---------- Media Handlers ----------
  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) =>
      setMedia((m) => ({ ...m, images: [...m.images, ...results] }))
    );
  };

  const handleVideosChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) =>
      setMedia((m) => ({ ...m, videos: [...m.videos, ...results] }))
    );
  };

  // ---------- Save Blog ----------
  const saveBlog = () => {
    if (editingIdx !== null) {
      const updatedPosts = [...savedPosts];
      updatedPosts[editingIdx] = {
        title,
        content,
        author,
        date: date || new Date().toISOString(),
        category,
        media,
      };
      setSavedPosts(updatedPosts);
      localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
      alert('Post updated successfully!'); // Alert for update
      setEditingIdx(null);
    } else {
      const posts = [
        ...savedPosts,
        { title, content, author, date: date || new Date().toISOString(), category, media },
      ];
      setSavedPosts(posts);
      localStorage.setItem('blog-posts', JSON.stringify(posts));
      alert('Post saved successfully!'); // Alert for new post
    }
  };

  // ---------- Auth ----------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setAuthorized(true);
    else alert('Wrong password!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author || !category) return alert('Please fill all fields!');
    saveBlog();
    setTitle('');
    setContent('');
    setAuthor('');
    setDate('');
    setCategory('');
    setMedia({ images: [], videos: [] });
  };

  const handleDelete = (idx: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const posts = [...savedPosts];
      posts.splice(idx, 1);
      setSavedPosts(posts);
      localStorage.setItem('blog-posts', JSON.stringify(posts));
      alert('Post deleted successfully!'); // Alert after deletion
    }
  };

  const handleEdit = (idx: number) => {
    const post = savedPosts[idx];
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setDate(post.date);
    setCategory(post.category);
    setMedia(post.media || { images: [], videos: [] });
    setEditingIdx(idx);
    setActiveTab('new');
  };

  // ---------- Filters ----------
  const categories = Array.from(new Set(savedPosts.map((post) => post.category))).sort();
  const categoriesWithAll = ['All', ...categories];

  const filteredPosts =
    (filterCategory === 'All'
      ? savedPosts
      : savedPosts.filter((post) => post.category === filterCategory)
    ).slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getContentToShow = (content: string, idx: number) =>
    expandedPostIdx === idx ? content : truncateWords(content, MAX_WORDS_PREVIEW);

  const toggleExpand = (idx: number) => setExpandedPostIdx((prev) => (prev === idx ? null : idx));

  // ---------- Login Screen ----------
  if (!authorized)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Admin Login
          </h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
            Login
          </button>
        </form>
      </main>
    );

  // ---------- Main Dashboard ----------
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col shadow-lg relative">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <nav className="flex flex-col gap-2">
          {['new', 'saved'].map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'new' ? 'New Post' : 'Saved Posts';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative text-left w-full p-3 rounded-lg font-medium transition flex items-center ${
                  isActive
                    ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 dark:bg-blue-400 rounded-tr-lg rounded-br-lg"></span>
                )}
                {label}
              </button>
            );
          })}
        </nav>

        <button
          className="mt-auto p-3 rounded-lg text-left font-medium w-full hover:bg-red-50 dark:hover:bg-red-700 transition text-red-600 dark:text-red-400"
          onClick={() => setAuthorized(false)}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'new' ? (
            // ---------- New Blog Form ----------
            <motion.div
              key="new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-semibold mb-6">
                {editingIdx !== null ? 'Edit Blog' : 'Create New Blog'}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
              >
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="" disabled>
                    Choose Category
                  </option>
                  <option>Agency Updates</option>
                  <option>Analytics & Tools</option>
                  <option>Artificial Intelligence</option>
                  <option>Branding & Design</option>
                  <option>Business Growth</option>
                  <option>Case Studies</option>
                  <option>Content Marketing</option>
                  <option>Digital Marketing</option>
                  <option>Google Ads</option>
                  <option>Performance Marketing</option>
                  <option>SEO</option>
                  <option>Social Media Marketing</option>
                  <option>Tips & Guides</option>
                  <option>Trends & Innovations</option>
                  <option>Website Development</option>
                </select>

                <textarea
                  placeholder="Blog content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={6}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />

                {/* Media Upload Section */}
                <div className="flex flex-col gap-4">
                  {/* Images */}
                  <div>
                    <label className="block mb-2 font-medium">Images</label>
                    <div
                      className="flex flex-wrap gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition"
                      onClick={() => document.getElementById('image-input')?.click()}
                    >
                      {media.images.map((img, i) => (
                        <div key={i} className="relative w-28 h-28 rounded-lg overflow-hidden shadow-sm group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMedia((m) => ({
                                ...m,
                                images: m.images.filter((_, idx) => idx !== i),
                              }));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 py-0.5 opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center justify-center w-28 h-28 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg">
                        + Add
                      </div>
                    </div>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImagesChange}
                    />
                  </div>

                  {/* Videos */}
                  <div>
                    <label className="block mb-2 font-medium">Videos</label>
                    <div
                      className="flex flex-wrap gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition"
                      onClick={() => document.getElementById('video-input')?.click()}
                    >
                      {media.videos.map((vid, i) => (
                        <div key={i} className="relative w-40 h-24 rounded-lg overflow-hidden shadow-sm group">
                          <video src={vid} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMedia((m) => ({
                                ...m,
                                videos: m.videos.filter((_, idx) => idx !== i),
                              }));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 py-0.5 opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center justify-center w-40 h-24 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg">
                        + Add
                      </div>
                    </div>
                    <input
                      id="video-input"
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={handleVideosChange}
                    />
                  </div>
                </div>

                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                  {editingIdx !== null ? 'Update Blog' : 'Save Blog'}
                </button>
              </form>
            </motion.div>
          ) : (
            // ---------- Saved Posts ----------
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-semibold mb-4">Saved Posts</h2>

              {/* Filter */}
              {savedPosts.length > 0 && (
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Filter by Category:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setExpandedPostIdx(null);
                    }}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    {categoriesWithAll.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Posts */}
              {filteredPosts.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No blogs found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, idx) => {
                    const contentToShow = getContentToShow(post.content, idx);
                    const isExpanded = expandedPostIdx === idx;
                    const wordCount = post.content.split(/\s+/).length;

                    return (
                      <motion.div
                        key={idx}
                        className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 relative"
                      >
                        <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          By {post.author}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Category: {post.category}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {new Date(post.date).toLocaleDateString()}
                        </p>

                        {/* Media */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(post.media?.images || []).map((img, i) => (
                            <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg shadow-sm" />
                          ))}
                          {(post.media?.videos || []).map((vid, i) => (
                            <video key={i} src={vid} controls className="w-full max-h-40 rounded-lg" />
                          ))}
                        </div>

                        <p className="text-gray-700 dark:text-gray-300">{contentToShow}</p>
                        {wordCount > MAX_WORDS_PREVIEW && (
                          <button
                            className="text-blue-600 dark:text-blue-400 mt-1 text-sm font-medium"
                            onClick={() => toggleExpand(idx)}
                          >
                            {isExpanded ? 'Show Less' : 'Read More'}
                          </button>
                        )}

                        <div className="flex justify-end mt-4 gap-3">
                          <button
                            onClick={() => handleEdit(idx)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(idx)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
