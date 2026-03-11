"use client";
import { useState, useRef } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email) return;

    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong.");
      setStatus("success");
      setMessage(data.message);
      setFile(null);
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 text-3xl">
            📊
          </div>
          <h1 className="text-4xl font-bold text-white">Sales Insight Automator</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Upload your sales file → AI generates a report → Delivered to your inbox
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <span className="text-xs bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full">Powered by Groq Llama 3</span>
            <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full">Rabbitt AI</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Drag & Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${dragOver ? "border-indigo-400 bg-indigo-950" : "border-gray-700 hover:border-indigo-500 hover:bg-gray-800"}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file ? (
                <div>
                  <div className="text-3xl mb-2">📁</div>
                  <p className="text-indigo-400 font-semibold text-sm">{file.name}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {(file.size / 1024).toFixed(1)} KB — Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">⬆️</div>
                  <p className="text-gray-300 font-medium text-sm">
                    Drag & drop your file here, or click to browse
                  </p>
                  <p className="text-gray-500 text-xs mt-1">.csv or .xlsx — max 5MB</p>
                </div>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📧 Recipient Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exec@company.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2
                           focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || !file || !email}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700
                         disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl
                         transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analyzing & Sending...
                </>
              ) : (
                <> 🚀 Generate & Send Summary </>
              )}
            </button>
          </form>

          {/* Feedback */}
          {status === "success" && (
            <div className="mt-5 p-4 bg-green-900/40 border border-green-700 rounded-xl text-green-300 text-sm flex gap-3 items-start">
              <span className="text-lg">✅</span>
              <span>{message}</span>
            </div>
          )}
          {status === "error" && (
            <div className="mt-5 p-4 bg-red-900/40 border border-red-700 rounded-xl text-red-300 text-sm flex gap-3 items-start">
              <span className="text-lg">❌</span>
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Your data is processed securely and never stored.
        </p>
      </div>
    </main>
  );
}