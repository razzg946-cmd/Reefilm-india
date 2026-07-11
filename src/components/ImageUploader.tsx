import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, Trash2, RefreshCw, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
}

export default function ImageUploader({ value, onChange, label, bucket = "products" }: ImageUploaderProps) {
  const [supabaseConfig, setSupabaseConfig] = useState<{
    connected: boolean;
    supabaseUrl: string;
    supabaseAnonKey: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Supabase configuration from server dynamically
  useEffect(() => {
    let active = true;
    fetch("/api/supabase-config")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setSupabaseConfig(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load Supabase config:", err);
        if (active) {
          setSupabaseConfig({ connected: false, supabaseUrl: "", supabaseAnonKey: "" });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setErrorMsg("");
    if (!supabaseConfig || !supabaseConfig.connected) {
      setErrorMsg("Supabase is not connected. Please configure the project URL and Anon Key to enable uploads.");
      return;
    }

    const url = (supabaseConfig.supabaseUrl || "").trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setErrorMsg("Please connect a valid Supabase Storage URL starting with http:// or https://");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);
      
      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000000)}.${fileExt}`;
      const bucketName = bucket; // Use specific configured bucket (e.g. products, gallery, logos, etc.)

      setUploadProgress(30);

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        // Fallback to "media" or retry
        console.warn(`Upload to '${bucketName}' bucket failed. Attempting upload directly to 'media' fallback...`, uploadError);
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from("media")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (fallbackError) {
          throw new Error(`Upload failed on both '${bucketName}' and 'media' buckets. Please ensure buckets exist and are public. Error: ${uploadError.message}`);
        }
        
        setUploadProgress(70);
        
        // Retrieve public URL
        const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(fileName);
        
        setUploadProgress(85);

        // Save URL in Supabase Database safely
        await saveToSupabaseDb(supabase, publicUrl, fileName);

        setUploadProgress(100);
        onChange(publicUrl);
      } else {
        setUploadProgress(70);
        
        // Retrieve public URL
        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        
        setUploadProgress(85);

        // Save URL in Supabase Database safely
        await saveToSupabaseDb(supabase, publicUrl, fileName);

        setUploadProgress(100);
        onChange(publicUrl);
      }
    } catch (err: any) {
      console.error("Supabase Upload Error:", err);
      setErrorMsg(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const saveToSupabaseDb = async (supabase: any, url: string, fileName: string) => {
    try {
      // Attempt to save URL and metadata into 'uploaded_images' or 'images' table
      const { error: dbError } = await supabase
        .from("uploaded_images")
        .insert([{ url, filename: fileName, created_at: new Date().toISOString() }]);

      if (dbError) {
        // Fallback table name 'images'
        const { error: dbErrorFallback } = await supabase
          .from("images")
          .insert([{ url, created_at: new Date().toISOString() }]);
        
        if (dbErrorFallback) {
          console.warn("Could not save to Supabase tables 'uploaded_images' or 'images'. Please verify database permissions and schema.", dbErrorFallback);
        }
      }
    } catch (e) {
      console.error("Database save exception ignored for resilience:", e);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (supabaseConfig === null) {
    return (
      <div className="h-28 flex items-center justify-center bg-neutral-950 border border-white/10 rounded-lg">
        <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!supabaseConfig.connected) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-neutral-950/80 border border-amber-500/20 rounded-xl space-y-2">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-[11px] font-mono text-amber-400 text-center leading-relaxed font-bold">
          Supabase is not connected. Please configure the project URL and Anon Key to enable uploads.
        </p>
        {value && (
          <div className="w-full mt-2">
            <p className="text-[9px] text-gray-500 mb-1">Current Image URL (Read Only):</p>
            <input
              type="text"
              readOnly
              value={value}
              className="w-full bg-black/60 border border-white/5 rounded px-2.5 py-1.5 text-[10px] text-gray-400 focus:outline-none font-mono"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-mono text-gray-400 uppercase font-bold block">{label}</label>}
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer ${
          isDragActive
            ? "border-red-600 bg-red-600/5"
            : value
            ? "border-emerald-500/20 bg-neutral-950"
            : "border-white/10 bg-neutral-950 hover:border-white/20"
        }`}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="w-full flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-6 h-6 text-red-500 animate-spin" />
            <div className="w-2/3 bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Uploading Image... {uploadProgress}%</span>
          </div>
        ) : value ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 group">
              <img
                src={value}
                alt="Uploaded asset"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center justify-center sm:justify-start gap-1 font-mono">
                ✓ Image Publicly Hosted
              </p>
              <p className="text-[10px] text-gray-500 truncate font-mono max-w-[280px]">
                {value}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-500/25 text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Drag & Drop Image Here</p>
              <p className="text-[10px] text-gray-500 font-mono mt-1">or Click to Browse Files</p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-[10px] font-mono text-red-500 flex items-center gap-1">
          ⚠️ {errorMsg}
        </p>
      )}
    </div>
  );
}
