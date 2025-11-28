'use client';

import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import DOMPurify from 'dompurify';

// Tiptap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

type Media = { images: string[]; videos: string[] };

type Post = {
  _id?: string;
  title: string;
  content: string; // HTML string (from Tiptap)
  author: string;
  date: string;
  category: string;
  media?: Media;
  images?: string[];
  videos?: string[];
};

const MAX_WORDS_PREVIEW = 100;

function truncateWords(text: string, maxWords: number) {
  const plain = text.replace(/<[^>]+>/g, ''); // strip tags for preview
  const words = plain.split(/\s+/).filter(Boolean);
  return words.length <= maxWords ? plain : words.slice(0, maxWords).join(' ') + '...';
}

export default function AdminDashboard() {
  // auth + UI state
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'saved'>('new');

  // post editor meta
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  // media as URLs for preview & sending
  const [media, setMedia] = useState<Media>({ images: [], videos: [] });

  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [expandedPostIdx, setExpandedPostIdx] = useState<number | null>(null);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [email, setEmail] = useState('');

  // reference to file inputs for images/videos outside editor (preview panel)
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------------- UPLOAD HELPER (moved here) ---------------------- */
  async function uploadFileToServer(
    file: File,
    type: 'image' | 'video' = 'image'
  ): Promise<{ url: string; publicId?: string; version?: number | string; resourceType?: string }> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(`${API_URL}/api/uploads/file?type=${type}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error('Upload failed: ' + txt);
    }

    const body = await res.json();
    return {
      url: body.url as string,
      publicId: body.public_id as string,
      version: body.version as number | string,
      resourceType: (body.resource_type as string) ?? type,
    };
  }

  // Compress + resize an image File to fit under maxBytes (default 10MB).
  async function compressImageFile(file: File, maxBytes = 10 * 1024 * 1024, maxWidth = 1600, maxHeight = 1600) {
    // If file already small, return original
    if (file.size <= maxBytes) return file;

    // Create an ImageBitmap (fast) or fallback to HTMLImageElement
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch (err) {
      // fallback (older browsers) — create a regular <img> to ensure decoding
      await new Promise<void>((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve();
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(img.src);
          reject(e);
        };
        img.src = URL.createObjectURL(file);
      });
      // now try createImageBitmap again
      bitmap = await createImageBitmap(file);
    }

    // compute target dimensions keeping aspect ratio
    const ratio = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
    const w = Math.round(bitmap.width * ratio);
    const h = Math.round(bitmap.height * ratio);

    // draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, w, h);

    // iterative quality reduction
    let quality = 0.92; // start high
    const MIN_QUALITY = 0.5;
    const STEP = 0.07;

    // helper to get blob
    async function canvasToBlob(q: number) {
      return await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/jpeg', q)
      );
    }

    let blob = await canvasToBlob(quality);
    while (blob && blob.size > maxBytes && quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - STEP);
      blob = await canvasToBlob(quality);
    }

    // if still too big, try to reduce dimensions further
    let currentMaxDim = Math.max(w, h);
    while (blob && blob.size > maxBytes && currentMaxDim > 400) {
      currentMaxDim = Math.round(currentMaxDim * 0.8);
      const newRatio = Math.min(1, currentMaxDim / Math.max(bitmap.width, bitmap.height));
      const nw = Math.round(bitmap.width * newRatio);
      const nh = Math.round(bitmap.height * newRatio);
      canvas.width = nw;
      canvas.height = nh;
      ctx.drawImage(bitmap, 0, 0, nw, nh);
      // reset quality a bit
      quality = Math.max(MIN_QUALITY, quality - 0.05);
      blob = await canvasToBlob(quality);
    }

    if (!blob) {
      // if conversion failed, fallback to original file
      return file;
    }

    // convert Blob back to File (preserve name)
    const newFile = new File([blob], file.name.replace(/\.(png|jpeg|jpg)$/i, '.jpg'), { type: 'image/jpeg' });
    return newFile;
  }

  /* ---------------------- Tiptap Editor ---------------------- */
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: true }),
      ImageExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: '', // will set when editing or creating
    editorProps: {
      attributes: {
        class: 'outline-none prose prose-sm max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  /* ---------------------- Fetch blogs ----------------------- */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/blogs`);
        if (!res.ok) throw new Error(`Failed to fetch blogs (status ${res.status})`);

        const payload: any = await res.json();

        let list: any[] = [];
        if (Array.isArray(payload)) {
          list = payload;
        } else if (Array.isArray(payload.data)) {
          list = payload.data;
        } else if (Array.isArray(payload.blogs)) {
          list = payload.blogs;
        } else if (payload && typeof payload === 'object' && (payload.id || payload._id)) {
          list = [payload];
        } else {
          console.warn('Unexpected payload shape from /api/blogs:', payload);
          list = [];
        }

        const normalized = list.map((p: Record<string, any>): Post => {
          const mediaObj = p.media && typeof p.media === 'object' ? p.media : undefined;

          const images = Array.isArray(mediaObj?.images)
            ? (mediaObj.images as string[])
            : Array.isArray(p.images)
            ? (p.images as string[])
            : [];

          const videos = Array.isArray(mediaObj?.videos)
            ? (mediaObj.videos as string[])
            : Array.isArray(p.videos)
            ? (p.videos as string[])
            : [];

          return {
            _id: (p._id as string) ?? (p.id as string) ?? '',
            title: (p.title as string) ?? '',
            content: (p.content as string) ?? (p.contentPreview as string) ?? '',
            author: (p.author as string) ?? '',
            date: (p.date as string) ?? '',
            category: (p.category as string) ?? '',
            media: { images, videos },
            images,
            videos,
          };
        });

        setSavedPosts(normalized);
      } catch (err) {
        console.error('❌ Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, []);

  /* ---------------- Image/Video input handling for preview area (not editor) ---------------- */
  const TARGET_MAX_BYTES = 10 * 1024 * 1024; // Cloudinary account limit (10MB)
  const MAX_CLIENT_MB = 20; // client-side hard limit
  const MAX_CLIENT_BYTES = MAX_CLIENT_MB * 1024 * 1024;

  const handleImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        if (file.size > MAX_CLIENT_BYTES) {
          alert(`File "${file.name}" is too large. Max ${MAX_CLIENT_MB}MB allowed.`);
          continue; // skip this file
        }

        let fileToUpload = file;

        if (file.size > TARGET_MAX_BYTES) {
          // compress to fit under Cloudinary account limit (10MB)
          try {
            fileToUpload = await compressImageFile(file, TARGET_MAX_BYTES, 1600, 1600);
          } catch (err) {
            console.warn('Compression failed, uploading original file', err);
            fileToUpload = file;
          }
        }

        const uploaded = await uploadFileToServer(fileToUpload, 'image');
        // Use returned CDN url
        setMedia((m) => ({ ...m, images: [...m.images, uploaded.url] }));
      }
    } catch (err) {
      console.error('Image upload error', err);
      alert('Image upload failed');
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const MAX_VIDEO_MB = Number(process.env.NEXT_PUBLIC_MAX_VIDEO_MB || 200);
  const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;

  const handleVideosChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        if (file.size > MAX_VIDEO_BYTES) {
          alert(`Video "${file.name}" is too large. Max ${MAX_VIDEO_MB}MB allowed.`);
          continue;
        }

        const uploaded = await uploadFileToServer(file, 'video');
        setMedia((m) => ({ ...m, videos: [...m.videos, uploaded.url] }));
      }
    } catch (err) {
      console.error('Video upload error', err);
      alert('Video upload failed');
    } finally {
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  /* -------------- Insert image into Tiptap editor (from file input) -------------- */
  const insertImageToEditor = async (file?: File) => {
    if (!editor) return;

    if (!file) {
      // fallback to last image url in media.images
      const last = media.images[media.images.length - 1];
      if (last) {
        editor.chain().focus().setImage({ src: last }).run();
      }
      return;
    }

    // Upload file (binary) to server -> Cloudinary and insert returned URL
    try {
      // compress if needed
      const fileToUpload = file.size > TARGET_MAX_BYTES ? await compressImageFile(file, TARGET_MAX_BYTES, 1600, 1600) : file;
      const uploaded = await uploadFileToServer(fileToUpload, 'image');
      editor.chain().focus().setImage({ src: uploaded.url }).run();
      setMedia((m) => ({ ...m, images: [...m.images, uploaded.url] }));
    } catch (err) {
      console.error('Insert image upload failed', err);
      alert('Failed to upload image');
    }
  };

  /* ----------------------- Save blog (POST) ----------------------- */
  const saveBlog = async () => {
    try {
      if (!editor) return alert('Editor not ready');

      const html = editor.getHTML(); // HTML content from Tiptap

      // Ensure all images are URLs; if any data URI remains, upload it
      const finalImages: string[] = [];
      for (const img of media.images) {
        if (typeof img === 'string' && img.startsWith('http')) {
          finalImages.push(img);
        } else if (typeof img === 'string' && img.startsWith('data:')) {
          // Convert data URI to blob and upload
          try {
            const res = await fetch(img);
            const blob = await res.blob();
            const file = new File([blob], 'upload.png', { type: blob.type });
            const uploaded = await uploadFileToServer(file, 'image');
            finalImages.push(uploaded.url);
          } catch (e) {
            console.error('Failed to convert/upload data URI image', e);
          }
        }
      }

      const blogData = {
        title,
        content: html,
        author,
        date: date || new Date().toISOString(),
        category,
        images: finalImages,
        videos: media.videos,
      };

      const token = localStorage.getItem('token');
      if (!token) return alert('⚠️ Admin login required.');

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(blogData),
      });

      const data: Record<string, unknown> = await res.json();

      if (res.ok) {
        const newPost: Post = {
          _id: (data._id as string) ?? (data.id as string),
          title: (data.title as string) ?? title,
          content: (data.content as string) ?? html,
          author: (data.author as string) ?? author,
          date: (data.date as string) ?? (date || new Date().toISOString()),

          category: (data.category as string) ?? category,
          images: Array.isArray(data.images) ? (data.images as string[]) : finalImages,
          videos: Array.isArray(data.videos) ? (data.videos as string[]) : media.videos,
          media: {
            images: Array.isArray(data.images) ? (data.images as string[]) : finalImages,
            videos: Array.isArray(data.videos) ? (data.videos as string[]) : media.videos,
          },
        };

        setSavedPosts((prev) => [...prev, newPost]);

        setTitle('');
        setAuthor('');
        setDate('');
        setCategory('');
        setMedia({ images: [], videos: [] });
        editor.commands.setContent(''); // clear editor

        alert('✅ Blog saved!');
      } else {
        alert('❌ Failed to save blog');
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('❌ Failed to save blog.');
    }
  };

  /* ------------------------ Admin Login ------------------------ */
  const handleLogin = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: Record<string, unknown> = await res.json();

      if (res.ok && typeof data.token === 'string') {
        localStorage.setItem('token', data.token);
        setAuthorized(true);
        alert('Admin login successful');
      } else {
        alert((data.message as string) ?? 'Login failed');
      }
    } catch (err) {
      console.error('Login error', err);
      alert('Login failed');
    }
  };

  /* ------------------------ Delete Blog ------------------------ */
  const handleDelete = async (id?: string) => {
    if (!id) return alert('❌ Invalid blog ID.');

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Unauthorized.');

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed');

      setSavedPosts((prev) => prev.filter((post) => post._id !== id));
      alert('🗑️ Blog deleted!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete blog');
    }
  };

  /* ------------------------ Edit / Update Blog ------------------------ */
  const startEditing = (idx: number, post: Post) => {
    setEditingIdx(idx);
    setEditingId(post._id ?? null);

    setTitle(post.title);
    setAuthor(post.author);
    setDate(post.date ? new Date(post.date).toISOString().slice(0, 10) : '');
    setCategory(post.category ?? '');
    setMedia({
      images: post.media?.images ?? post.images ?? [],
      videos: post.media?.videos ?? post.videos ?? [],
    });

    // set HTML content into editor
    setTimeout(() => {
      editor?.commands.setContent(post.content ?? '');
    }, 50);

    setActiveTab('new');
  };

  const updateBlog = async (id: string, payload: Partial<Post>) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      if (!token) return alert('Unauthorized.');

      const res = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const updated: Record<string, unknown> = await res.json();
      if (!res.ok) return alert('Failed to update blog');

      setSavedPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                _id: (updated._id as string) ?? (updated.id as string) ?? id,
                title: (updated.title as string) ?? p.title,
                content: (updated.content as string) ?? p.content,
                author: (updated.author as string) ?? p.author,
                date: (updated.date as string) ?? p.date,
                category: (updated.category as string) ?? p.category,
                images:
                  Array.isArray(updated.images) ? (updated.images as string[]) : p.images ?? [],
                videos:
                  Array.isArray(updated.videos) ? (updated.videos as string[]) : p.videos ?? [],
                media: {
                  images:
                    Array.isArray(updated.images)
                      ? (updated.images as string[])
                      : p.media?.images ?? [],
                  videos:
                    Array.isArray(updated.videos)
                      ? (updated.videos as string[])
                      : p.media?.videos ?? [],
                },
              }
            : p
        )
      );

      alert('✏️ Blog updated!');
      setEditingIdx(null);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update blog');
    }
  };

  /* -------------------------- Filters -------------------------- */
  const categories = Array.from(new Set(savedPosts.map((post) => post.category))).sort();
  const categoriesWithAll = ['All', ...categories];

  const filteredPosts =
    (filterCategory === 'All' ? savedPosts : savedPosts.filter((post) => post.category === filterCategory))
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getContentToShow = (content: string, idx: number) =>
    expandedPostIdx === idx ? content : truncateWords(content, MAX_WORDS_PREVIEW);

  const toggleExpand = (idx: number) => setExpandedPostIdx((prev) => (prev === idx ? null : idx));

  /* ------------------- Render login screen ------------------- */
  if (!authorized)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-sm text-black"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border mb-4 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border mb-4 text-black"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>
      </main>
    );

  /* ------------------- MAIN UI ------------------- */
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <nav className="flex flex-col gap-2">
          {(['new', 'saved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-3 rounded-lg ${activeTab === tab ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {tab === 'new' ? 'New Post' : 'Saved Posts'}
            </button>
          ))}
        </nav>

        <button
          className="mt-auto p-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700"
          onClick={() => setAuthorized(false)}
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'new' ? (
            <motion.div key="new" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-semibold mb-6">{editingIdx !== null ? 'Edit Blog' : 'Create New Blog'}</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const html = editor?.getHTML() ?? '';
                  const payload = {
                    title,
                    content: html,
                    author,
                    date: date || new Date().toISOString(),
                    category,
                    images: media.images,
                    videos: media.videos,
                  };

                  if (editingId) {
                    updateBlog(editingId, payload);
                  } else {
                    saveBlog();
                  }
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4"
              >
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 rounded-lg border" />

                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full p-3 rounded-lg border" />

                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 rounded-lg border" />

                <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-3 rounded-lg border">
                  <option value="" disabled>
                    Choose Category
                  </option>

                  {[
                    'Agency Updates',
                    'Analytics & Tools',
                    'Artificial Intelligence',
                    'Branding & Design',
                    'Business Growth',
                    'Case Studies',
                    'Content Marketing',
                    'Digital Marketing',
                    'Google Ads',
                    'Performance Marketing',
                    'SEO',
                    'Social Media Marketing',
                    'Tips & Guides',
                    'Trends & Innovations',
                    'Website Development',
                  ].map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>

                {/* ========== Split: Tiptap Editor (left) + Live Preview (right) ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Editor column */}
                  <div>
                    <label className="block font-medium mb-2">Rich Content Editor</label>

                    {/* Toolbar */}
                    <div className="mb-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="px-3 py-1 rounded bg-gray-100">Bold</button>
                      <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-3 py-1 rounded bg-gray-100">Italic</button>
                      <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className="px-3 py-1 rounded bg-gray-100">Strike</button>
                      <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-3 py-1 rounded bg-gray-100">H2</button>
                      <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className="px-3 py-1 rounded bg-gray-100">H3</button>
                      <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-3 py-1 rounded bg-gray-100">• List</button>
                      <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-3 py-1 rounded bg-gray-100">1. List</button>
                      <button type="button" onClick={() => editor?.chain().focus().undo().run()} className="px-3 py-1 rounded bg-gray-100">Undo</button>
                      <button type="button" onClick={() => editor?.chain().focus().redo().run()} className="px-3 py-1 rounded bg-gray-100">Redo</button>

                      {/* Insert image to editor: open file input */}
                      <button
  type="button"
  onClick={() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (ev: any) => {
      const f: File | undefined = ev.target.files?.[0];
      if (!f) return;

      try {
        // Upload file to your backend -> Cloudinary
        const fileToUpload = f.size > TARGET_MAX_BYTES ? await compressImageFile(f, TARGET_MAX_BYTES, 1600, 1600) : f;
        const uploaded = await uploadFileToServer(fileToUpload, 'image');

        // Insert Cloudinary URL into the editor
        editor?.chain().focus().setImage({ src: uploaded.url }).run();

        // Store it in post-level images as well
        setMedia((m) => ({ ...m, images: [...m.images, uploaded.url] }));
      } catch (err) {
        console.error("Inline image upload failed", err);
        alert("Failed to upload image");
      }
    };

    input.click();
  }}
  className="px-3 py-1 rounded bg-gray-100"
>
  Insert Image
</button>

                      {/* Insert link */}
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter URL');
                          if (!url) return;
                          editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                        }}
                        className="px-3 py-1 rounded bg-gray-100"
                      >
                        Link
                      </button>
                    </div>

                    {/* Editor */}
                    <div className="border rounded-lg p-2 min-h-[300px]">
                      <EditorContent editor={editor} />
                    </div>
                  </div>

                  {/* Preview column */}
                  <div>
                    <label className="block font-medium mb-2">Live Preview</label>

                    <div
                      className="p-4 rounded-lg border bg-white text-gray-900 prose max-w-none"
                      // sanitize to be safe
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(editor?.getHTML() ?? ''),
                      }}
                    />
                  </div>
                </div>

                {/* -------------- Images + Videos Upload Panel (post-level) -------------- */}
                <div>
                  <label className="block font-medium mb-2">Images (post-level)</label>
                  <div className="flex flex-wrap gap-3 p-3 border-2 border-dashed rounded-lg">
                    {media.images.map((img) => (
                      <div key={img} className="relative w-28 h-28 rounded-lg overflow-hidden shadow-sm">
                        <Image src={img} alt={`img-preview`} fill className="object-cover" unoptimized />
                        <button
                          onClick={() => setMedia((m) => ({ ...m, images: m.images.filter((x) => x !== img) }))}
                          className="absolute top-1 right-1 bg-red-600 text-white px-1 rounded-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <div className="w-28 h-28 flex items-center justify-center rounded-lg bg-gray-100 cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                      + Add
                    </div>
                  </div>

                  <input ref={imageInputRef} id="image-input" type="file" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
                </div>

                <div>
                  <label className="block font-medium mb-2">Videos (post-level)</label>
                  <div className="flex flex-wrap gap-3 p-3 border-2 border-dashed rounded-lg">
                    {media.videos.map((vid) => (
                      <div key={vid} className="relative w-40 h-24 rounded-lg overflow-hidden shadow-sm">
                        <video src={vid} controls className="w-full h-full object-cover" />
                        <button onClick={() => setMedia((m) => ({ ...m, videos: m.videos.filter((x) => x !== vid) }))} className="absolute top-1 right-1 bg-red-600 text-white px-1 rounded-lg">
                          ×
                        </button>
                      </div>
                    ))}

                    <div className="w-40 h-24 flex items-center justify-center rounded-lg bg-gray-100 cursor-pointer" onClick={() => videoInputRef.current?.click()}>
                      + Add
                    </div>
                  </div>

                  <input ref={videoInputRef} id="video-input" type="file" accept="video/*" multiple className="hidden" onChange={handleVideosChange} />
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                  {editingIdx !== null ? 'Update Blog' : 'Save Blog'}
                </button>
              </form>
            </motion.div>
          ) : (
            /* ------------------------ SAVED POSTS LIST ------------------------ */
            <motion.div key="saved" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-semibold mb-4">Saved Posts</h2>

              {savedPosts.length > 0 && (
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Filter by Category:</label>

                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setExpandedPostIdx(null);
                    }}
                    className="p-2 rounded-lg border"
                  >
                    {categoriesWithAll.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {filteredPosts.length === 0 ? (
                <p className="text-center mt-6 text-gray-500">No blogs found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, idx) => {
                    const contentToShow = getContentToShow(post.content, idx);
                    const isExpanded = expandedPostIdx === idx;

                    return (
                      <motion.div key={post._id ?? idx} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border">
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">By {post.author}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Category: {post.category}</p>
                        <p className="text-sm text-gray-500">{post.date ? new Date(post.date).toLocaleDateString() : ''}</p>

                        <div className="flex flex-wrap gap-2 my-3">
                          {(post.media?.images ?? []).map(
                            (img) =>
                              img && (
                                <div key={img} className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm">
                                  <Image src={img} alt="preview" fill className="object-cover" unoptimized />
                                </div>
                              )
                          )}

                          {(post.media?.videos ?? []).map((vid) => (
                            <video key={vid} src={vid} controls className="w-full max-h-40 rounded-lg" />
                          ))}
                        </div>

                        {/* show sanitized HTML preview (short) */}
                        <div className="text-gray-700 dark:text-gray-300 prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentToShow || '') }} />

                        <button onClick={() => toggleExpand(idx)} className="text-blue-600 mt-2 text-sm">
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </button>

                        <div className="flex justify-end gap-3 mt-4">
                          <button onClick={() => startEditing(idx, post)} className="text-blue-600">
                            Edit
                          </button>

                          <button onClick={() => handleDelete(post._id)} className="text-red-600">
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