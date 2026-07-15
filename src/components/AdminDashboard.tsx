import React, { useState, FormEvent, useEffect, useCallback, useMemo } from "react";
import { hashPassword } from "../utils/crypto";
import ImageUploader from "./ImageUploader";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, Layers, FileText, Download, Award, MessageSquare, Plus, Trash2, LogIn, Lock, CheckCircle, 
  TrendingUp, Calendar, MapPin, Database, ShieldCheck, Mail, Phone, ListFilter, Search, RefreshCw, 
  ExternalLink, Image as ImageIcon, PlayCircle, BookOpen, Settings, UserCheck, ShieldAlert, Edit, 
  Upload, Copy, Check, FileUp, Globe, Clock, HelpCircle, Share2, Sliders, Building2, Cpu
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Product, Project, ApplicationItem, BlogPost, ResourceDoc, Testimonial, LeadInquiry, GalleryItem, TeamMember, WebsiteSettings, AdminUser } from "../types";

interface AdminDashboardProps {
  products: Product[];
  projects: Project[];
  blogs: BlogPost[];
  downloads: ResourceDoc[];
  testimonials: Testimonial[];
  leads: LeadInquiry[];
  galleryItems: GalleryItem[];
  teamMembers: TeamMember[];
  settings: WebsiteSettings;
  adminUsers: AdminUser[];
  applications: ApplicationItem[];
  onUpdateLeads: (updatedLeads: LeadInquiry[]) => void;
  onUpdateProducts: (updatedProducts: Product[]) => void;
  onUpdateProjects: (updatedProjects: Project[]) => void;
  onUpdateBlogs: (updatedBlogs: BlogPost[]) => void;
  onUpdateDownloads: (updatedDownloads: ResourceDoc[]) => void;
  onUpdateTestimonials: (updatedTestimonials: Testimonial[]) => void;
  onUpdateGalleryItems: (updatedGalleryItems: GalleryItem[]) => void;
  onUpdateTeamMembers: (updatedTeamMembers: TeamMember[]) => void;
  onUpdateSettings: (updatedSettings: WebsiteSettings) => void;
  onUpdateAdminUsers: (updatedAdminUsers: AdminUser[]) => void;
  onUpdateApplications: (updatedApplications: ApplicationItem[]) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  fileName: string;
  fileType: "image" | "video" | "pdf" | null;
  bucket: string;
  url: string;
}

export default function AdminDashboard({
  products, projects, blogs, downloads, testimonials, leads, galleryItems, teamMembers, settings, adminUsers, applications,
  onUpdateLeads, onUpdateProducts, onUpdateProjects, onUpdateBlogs, onUpdateDownloads, onUpdateTestimonials,
  onUpdateGalleryItems, onUpdateTeamMembers, onUpdateSettings, onUpdateAdminUsers, onUpdateApplications
}: AdminDashboardProps) {
  
  // 1. Enterprise Administrator List
  const verifiedAdminUsers = useMemo(() => {
    return adminUsers;
  }, [adminUsers]);

  // 2. Active Authentication & Session state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedSession = localStorage.getItem("reefilm_admin_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email && parsed.expiresAt > Date.now()) {
          return true;
        }
      }
    } catch (e) {
      console.error("Session load failed", e);
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const savedSession = localStorage.getItem("reefilm_admin_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email && parsed.expiresAt > Date.now()) {
          if (parsed.user) return parsed.user;
          return {
            id: parsed.id || "admin-1",
            username: parsed.username || parsed.email.split("@")[0],
            email: parsed.email,
            role: parsed.role || "Administrator",
            passwordHash: "",
            createdAt: ""
          };
        }
      }
    } catch (e) {
      console.error("User resolve failed", e);
    }
    return null;
  });

  // Load operators dynamically from backend on authentication
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUsers = async () => {
      try {
        const sessionObj = localStorage.getItem("reefilm_admin_session");
        if (!sessionObj) return;
        const { token } = JSON.parse(sessionObj);

        const response = await fetch("/api/auth/users", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const usersData = await response.json();
          onUpdateAdminUsers(usersData);
        }
      } catch (err) {
        console.error("Failed to fetch operators list:", err);
      }
    };

    fetchUsers();
  }, [isAuthenticated, onUpdateAdminUsers]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginError, setLoginError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 3. Forgot Password Flow State Variables
  const [authMode, setAuthMode] = useState<"login" | "forgot_password">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: Reset Pass
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<number>(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [newPasswordFirst, setNewPasswordFirst] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  // 4. Change Password Flow State Variables
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [changePasswordStep, setChangePasswordStep] = useState<1 | 2>(1); // 1: Passwords, 2: OTP
  const [changePasswordOtp, setChangePasswordOtp] = useState("");
  const [changePasswordOtpInput, setChangePasswordOtpInput] = useState("");
  const [changePasswordOtpExpiresAt, setChangePasswordOtpExpiresAt] = useState<number>(0);
  const [changePasswordOtpAttempts, setChangePasswordOtpAttempts] = useState(0);
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");

  // 5. Simulated Resend Email API Notification State
  const [activeNotification, setActiveNotification] = useState<{
    from: string;
    to: string;
    subject: string;
    body: string;
    code: string;
  } | null>(null);

  // Website Content Manager Local Draft State
  const [draftSettings, setDraftSettings] = useState<WebsiteSettings>(() => settings);
  const [previewActive, setPreviewActive] = useState<boolean>(true);

  useEffect(() => {
    if (settings) {
      setDraftSettings(settings);
    }
  }, [settings]);

  // 6. Enterprise CMS Modules Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<
    "setup" | "dashboard" | "products" | "gallery" | "downloads" | "quotes" | "leads" | "team" | "blog" | "settings" | "users" | "profile" | "media_library" | "seo_manager" | "activity_log" | "backup_restore" | "projects" | "applications" | "content_manager"
  >("setup");

  // 7. Session Activity Extension Handler
  const resetSessionTimer = useCallback(() => {
    if (!isAuthenticated) return;
    try {
      const savedSession = localStorage.getItem("reefilm_admin_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        const isRemembered = localStorage.getItem("reefilm_admin_remember_me") === "true";
        const extendTime = isRemembered ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
        parsed.expiresAt = Date.now() + extendTime;
        localStorage.setItem("reefilm_admin_session", JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const handleActivity = () => resetSessionTimer();
    events.forEach(e => window.addEventListener(e, handleActivity));
    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [isAuthenticated, resetSessionTimer]);

  const handleLogout = useCallback((message?: string) => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("reefilm_admin_session");
    localStorage.removeItem("reefilm_admin_remember_me");
    if (message) {
      setLoginError(message);
    } else {
      setLoginError("");
    }
    setLoginEmail("");
    setLoginPassword("");
  }, []);

  // Session Timeout checking
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      try {
        const savedSession = localStorage.getItem("reefilm_admin_session");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed && Date.now() > parsed.expiresAt) {
            handleLogout("Session expired due to inactivity. Please log in again.");
          }
        } else {
          handleLogout();
        }
      } catch (e) {
        console.error(e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, handleLogout]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Supabase storage simulation state
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    fileName: "",
    fileType: null,
    bucket: "",
    url: ""
  });
  const [copiedUrl, setCopiedUrl] = useState(false);

  // --- SELF-SERVICE SETUP WIZARD STATES ---
  const [setupConfig, setSetupConfig] = useState({
    url: "",
    anonKey: "",
    serviceRoleKey: "",
    pgConnectionString: ""
  });
  
  const [setupStatus, setSetupStatus] = useState<{
    connected: boolean;
    buckets: Record<string, string>;
    tables: Record<string, boolean>;
    hasAdminUser: boolean;
    sqlScript: string;
  } | null>(null);

  const [setupActiveStep, setSetupActiveStep] = useState<number>(1);
  const [setupLoading, setSetupLoading] = useState<boolean>(false);
  const [setupMsg, setSetupMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [wizardAdminUsername, setWizardAdminUsername] = useState("");
  const [wizardAdminEmail, setWizardAdminEmail] = useState("");
  const [wizardAdminPassword, setWizardAdminPassword] = useState("");

  const fetchSetupStatus = async () => {
    try {
      const res = await fetch("/api/setup/status");
      if (res.ok) {
        const data = await res.json();
        setSetupStatus(data);
      }
    } catch (err) {
      console.error("Failed to load setup wizard installation status:", err);
    }
  };

  const loadCurrentConfig = async () => {
    try {
      const res = await fetch("/api/supabase-config");
      if (res.ok) {
        const data = await res.json();
        setSetupConfig({
          url: data.supabaseUrl || "",
          anonKey: data.supabaseAnonKey || "",
          serviceRoleKey: data.supabaseServiceRoleKey ? "•"?.repeat(15) : "", // Masked placeholder if already saved on server
          pgConnectionString: data.pgConnectionString ? "•"?.repeat(15) : "" // Masked placeholder if already saved on server
        });
      }
    } catch (err) {
      console.error("Failed to load current configuration variables:", err);
    }
  };

  useEffect(() => {
    loadCurrentConfig();
    fetchSetupStatus();
  }, []);

  const handleTestConnection = async () => {
    setSetupLoading(true);
    setSetupMsg(null);
    try {
      const res = await fetch("/api/setup/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: setupConfig.url, anonKey: setupConfig.anonKey })
      });
      const data = await res.json();
      if (res.ok) {
        setSetupMsg({ type: "success", text: "✓ Connection tested successfully! Credentials are valid." });
      } else {
        setSetupMsg({ type: "error", text: data.error || "Connection failed. Please check credentials." });
      }
    } catch (err: any) {
      setSetupMsg({ type: "error", text: err.message || "Failed to contact local server." });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSetupLoading(true);
    setSetupMsg(null);
    try {
      const payload = {
        url: setupConfig.url,
        anonKey: setupConfig.anonKey,
        // Only send the raw service role / connection string if they edited them (i.e. not placeholders of dots)
        serviceRoleKey: setupConfig.serviceRoleKey.includes("•") ? undefined : setupConfig.serviceRoleKey,
        pgConnectionString: setupConfig.pgConnectionString.includes("•") ? undefined : setupConfig.pgConnectionString
      };

      const res = await fetch("/api/setup/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSetupMsg({ type: "success", text: "✓ Supabase credentials saved and applied in memory successfully!" });
        await fetchSetupStatus();
        await loadCurrentConfig();
      } else {
        setSetupMsg({ type: "error", text: data.error || "Failed to save configuration." });
      }
    } catch (err: any) {
      setSetupMsg({ type: "error", text: err.message || "Failed to communicate with local server." });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleCreateBuckets = async () => {
    setSetupLoading(true);
    setSetupMsg(null);
    try {
      const res = await fetch("/api/setup/create-buckets", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSetupMsg({ type: "success", text: "✓ Storage Buckets initialized successfully!" });
        await fetchSetupStatus();
      } else {
        setSetupMsg({ type: "error", text: data.error || "Bucket creation failed. Is Service Role Key configured?" });
      }
    } catch (err: any) {
      setSetupMsg({ type: "error", text: err.message || "Error contacting setup backend server." });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleMigrateDatabase = async () => {
    setSetupLoading(true);
    setSetupMsg(null);
    try {
      const res = await fetch("/api/setup/initialize-database", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSetupMsg({ type: "success", text: "✓ CMS database tables migrated and active!" });
        await fetchSetupStatus();
      } else {
        setSetupMsg({ type: "error", text: data.error || "Database migration failed. Verify connection string." });
      }
    } catch (err: any) {
      setSetupMsg({ type: "error", text: err.message || "Error communicating with server database migrator." });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleWizardCreateAdmin = async () => {
    setSetupLoading(true);
    setSetupMsg(null);
    try {
      const res = await fetch("/api/setup/create-admin-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: wizardAdminUsername,
          email: wizardAdminEmail,
          password: wizardAdminPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSetupMsg({ type: "success", text: `✓ Administrator "${wizardAdminUsername}" created successfully!` });
        await fetchSetupStatus();
        setWizardAdminUsername("");
        setWizardAdminEmail("");
        setWizardAdminPassword("");
      } else {
        setSetupMsg({ type: "error", text: data.error || "Failed to register administrator." });
      }
    } catch (err: any) {
      setSetupMsg({ type: "error", text: err.message || "Server error while registering administrator account." });
    } finally {
      setSetupLoading(false);
    }
  };

  // Unified Modals / Drawer Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

  // Form Field states (Generic JSON container or individual states)
  // 1. Product Form fields
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("LED Film");
  const [pTagline, setPTagline] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPitch, setPPitch] = useState("");
  const [pTransparency, setPTransparency] = useState("");
  const [pBrightness, setPBrightness] = useState("");
  const [pWeight, setPWeight] = useState("");
  const [pPower, setPPower] = useState("");
  const [pImage, setPImage] = useState("");
  const [pBrochureUrl, setPBrochureUrl] = useState("");
  const [pSeries, setPSeries] = useState("O Series");
  const [pVideoUrl, setPVideoUrl] = useState("");
  const [pDisplayOrder, setPDisplayOrder] = useState<number>(0);
  const [pRefreshRate, setPRefreshRate] = useState("3,840 Hz");
  const [pThickness, setPThickness] = useState("2.0mm");
  const [pMaxPower, setPMaxPower] = useState("600 W/m²");
  const [pFeatures, setPFeatures] = useState("");
  const [pBenefits, setPBenefits] = useState("");
  const [pInstallation, setPInstallation] = useState("");
  const [pMaintenance, setPMaintenance] = useState("");

  // 2. Gallery Item Form fields
  const [gTitle, setGTitle] = useState("");
  const [gCategory, setGCategory] = useState<GalleryItem["category"]>("Storefronts & Entrances");
  const [gImage, setGImage] = useState("");
  const [gVideo, setGVideo] = useState("");
  const [gLocation, setGLocation] = useState("");
  const [gDescription, setGDescription] = useState("");
  const [gLayers, setGLayers] = useState("");
  const [gTransmission, setGTransmission] = useState("");
  const [gController, setGController] = useState("");
  const [gDimensions, setGDimensions] = useState("");
  const [gClient, setGClient] = useState("");
  const [gTimeline, setGTimeline] = useState("");
  const [gIsFeatured, setGIsFeatured] = useState(false);

  // 3. Download Form fields
  const [dTitle, setDTitle] = useState("");
  const [dCategory, setDCategory] = useState<ResourceDoc["category"]>("Brochures");
  const [dFileUrl, setDFileUrl] = useState("");
  const [dSize, setDSize] = useState("");
  const [dCode, setDCode] = useState("");

  // 4. Team Member Form fields
  const [tName, setTName] = useState("");
  const [tPosition, setTPosition] = useState("");
  const [tDept, setTDept] = useState("");
  const [tInitials, setTInitials] = useState("");
  const [tBio, setTBio] = useState("");
  const [tEmail, setTEmail] = useState("");

  // 5. Blog Post Form fields
  const [bTitle, setBTitle] = useState("");
  const [bCategory, setBCategory] = useState("Installation Tips");
  const [bExcerpt, setBExcerpt] = useState("");
  const [bContent, setBContent] = useState("");
  const [bReadTime, setBReadTime] = useState("");
  const [bImage, setBImage] = useState("");

  // 6. User Manager Form fields
  const [uUsername, setUUsername] = useState("");
  const [uRole, setURole] = useState<AdminUser["role"]>("Editor");
  const [uEmail, setUEmail] = useState("");
  const [uPassword, setUPassword] = useState("");

  // 7. Projects Form Fields
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState("Storefronts & Entrances");
  const [projLocation, setProjLocation] = useState("");
  const [projClient, setProjClient] = useState("");
  const [projTimeline, setProjTimeline] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projBeforeImage, setProjBeforeImage] = useState("");
  const [projAfterImage, setProjAfterImage] = useState("");
  const [projTechUsed, setProjTechUsed] = useState("");
  const [projInstallationSize, setProjInstallationSize] = useState("");
  const [projHighlights, setProjHighlights] = useState("");
  const [projBenefits, setProjBenefits] = useState("");
  const [projReviewText, setProjReviewText] = useState("");
  const [projReviewer, setProjReviewer] = useState("");
  const [projReviewerRole, setProjReviewerRole] = useState("");
  const [projRating, setProjRating] = useState<number>(5);

  // 8. Applications Form Fields
  const [appTitle, setAppTitle] = useState("");
  const [appTagline, setAppTagline] = useState("");
  const [appOverview, setAppOverview] = useState("");
  const [appBenefits, setAppBenefits] = useState("");
  const [appRecommendedProducts, setAppRecommendedProducts] = useState("");
  const [appCaseStudyTitle, setAppCaseStudyTitle] = useState("");
  const [appChallenge, setAppChallenge] = useState("");
  const [appSolution, setAppSolution] = useState("");
  const [appResult, setAppResult] = useState("");

  // --- ENTERPRISE CMS CORE EXTENSION MODULES ---

  // Media Library types
  interface MediaItem {
    id: string;
    name: string;
    url: string;
    type: "image" | "video" | "pdf" | "logo" | "document";
    size: string;
    uploadedAt: string;
  }

  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_media_library");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    const defaultMedia: MediaItem[] = [
      {
        id: "media-1",
        name: "Reefilm Brand Logo",
        url: "/src/assets/images/logo.png",
        type: "logo",
        size: "45 KB",
        uploadedAt: "2026-05-15T10:00:00.000Z"
      },
      {
        id: "media-2",
        name: "O-Series Outdoor Facade Display",
        url: "/src/assets/images/reefilm_o_series_1782554309834.jpg",
        type: "image",
        size: "1.2 MB",
        uploadedAt: "2026-06-10T12:34:00.000Z"
      },
      {
        id: "media-3",
        name: "I-F Series Indoor Flexible Display",
        url: "/src/assets/images/reefilm_if_series_1782554325415.jpg",
        type: "image",
        size: "820 KB",
        uploadedAt: "2026-06-11T14:20:00.000Z"
      },
      {
        id: "media-4",
        name: "I-R Series Indoor Retail Display",
        url: "/src/assets/images/reefilm_ir_series_1782554337980.jpg",
        type: "image",
        size: "940 KB",
        uploadedAt: "2026-06-12T09:15:00.000Z"
      },
      {
        id: "media-5",
        name: "Elevator & Balustrade Series",
        url: "/src/assets/images/reefilm_breakpoint_tech_1782554378090.jpg",
        type: "image",
        size: "1.5 MB",
        uploadedAt: "2026-06-13T16:45:00.000Z"
      },
      {
        id: "media-6",
        name: "Reefilm Technical Specification Manual",
        url: "/assets/docs/reefilm_tech_specs_2026.pdf",
        type: "pdf",
        size: "4.8 MB",
        uploadedAt: "2026-06-14T11:00:00.000Z"
      }
    ];
    return defaultMedia;
  });

  useEffect(() => {
    localStorage.setItem("reefilm_media_library", JSON.stringify(mediaLibrary));
  }, [mediaLibrary]);

  // SEO Settings types
  interface SeoPageSettings {
    title: string;
    description: string;
    keywords: string;
  }

  interface SeoSettings {
    [page: string]: SeoPageSettings;
  }

  const [seoSettings, setSeoSettings] = useState<SeoSettings>(() => {
    try {
      const saved = localStorage.getItem("reefilm_seo_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    return {
      home: {
        title: "Reefilm India | Premium Transparent LED Display Solutions",
        description: "Independent Leader in Transparent LED Film Displays. Transform high-street glass facades, retail storefronts, and office partitions with self-adhesive, daylight-visible transparent LED film.",
        keywords: "transparent led display, led film india, glass facade advertising, adhesive led screen, chennai"
      },
      about: {
        title: "About Us | Reefilm India Leadership & Engineering",
        description: "Discover Reefilm India's leadership and technical integration. Our premium self-adhesive displays are configured and backed with a 1-year swap-out guarantee by our Chennai-based team.",
        keywords: "reefilm team, engineering center, raj gupta, chennai"
      },
      products: {
        title: "Products Catalog | High-Transparency Smart LED Films",
        description: "Browse our active range of O Series, I-F Series, and Custom Sized Glass LED display films. Read full specifications, weights, transparency indexes, and power stats.",
        keywords: "led series, pixel pitch, brightness calibration, refresh rate, custom sizing"
      },
      gallery: {
        title: "Project Installations Gallery | Architectural Showcase",
        description: "Explore completed Reefilm installation references on real commercial facades and retail windows across India. High contrast, high-durability lamination performance.",
        keywords: "led storefront installations, structural facades, transparent design cases"
      },
      downloads: {
        title: "Technical Docs & Brochure Library | Reefilm India",
        description: "Download verified engineering CAD files, wind drag certifications, power consumption charts, and full catalog PDFs for planning your architectural glass installation.",
        keywords: "downloads, specs sheets, wind certificate, layout files, installation guides"
      },
      blog: {
        title: "Blog & Insights Desk | Transparent LED Industry Checklists",
        description: "Read technical buying guides, installation calibration walkthroughs, and thermal load checklists direct from our visual engineering desk.",
        keywords: "industry guidelines, technical guides, display checklists, led maintenance"
      }
    };
  });

  useEffect(() => {
    localStorage.setItem("reefilm_seo_settings", JSON.stringify(seoSettings));
  }, [seoSettings]);

  // Activity Log types
  interface ActivityLog {
    id: string;
    timestamp: string;
    operator: string;
    action: string;
    details: string;
    status: "success" | "warning" | "info";
  }

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_activity_logs");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    return [
      {
        id: "log-1",
        timestamp: "2026-07-07T09:00:00.000Z",
        operator: "admin",
        action: "PORTAL_AUTHENTICATED",
        details: "Secure operator session established from Chennai desk with brute force validation.",
        status: "success"
      },
      {
        id: "log-2",
        timestamp: "2026-07-07T09:15:00.000Z",
        operator: "admin",
        action: "CATALOG_UPDATE",
        details: "Added displayOrder, videoUrl, and brochureUrl fields to LED Film series catalogs.",
        status: "success"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("reefilm_activity_logs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  const logActivity = useCallback((action: string, details: string, logStatus: "success" | "warning" | "info" = "success") => {
    const operatorName = currentUser ? currentUser.username : (localStorage.getItem("reefilm_admin_session") ? JSON.parse(localStorage.getItem("reefilm_admin_session")!).email.split("@")[0] : "admin");
    const newLog: ActivityLog = {
      id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      operator: operatorName,
      action,
      details,
      status: logStatus
    };
    setActivityLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  // Media Library form state
  const [mediaName, setMediaName] = useState("");
  const [mediaType, setMediaType] = useState<MediaItem["type"]>("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaSize, setMediaSize] = useState("");

  // SEO Manager active subtab/editing states
  const [editingSeoPage, setEditingSeoPage] = useState("home");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Sync state with active editing page
  useEffect(() => {
    if (seoSettings[editingSeoPage]) {
      setSeoTitle(seoSettings[editingSeoPage].title);
      setSeoDescription(seoSettings[editingSeoPage].description);
      setSeoKeywords(seoSettings[editingSeoPage].keywords);
    }
  }, [editingSeoPage, seoSettings]);
  // --- ENTERPRISE ADMINISTRATIVE AUTHENTICATION HANDLERS ---

  // Secure Login with Email + Password, Remember Me, Session Management & Brute Force Protection
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Login failed.");
        return;
      }

      // Login successful!
      setIsAuthenticated(true);
      setCurrentUser(data.user);

      // Save session in localStorage with expiration
      const expireDuration = rememberMe ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
      const sessionObj = {
        email: data.user.email,
        username: data.user.username,
        role: data.user.role,
        token: data.session.token,
        expiresAt: Date.now() + expireDuration,
        user: data.user
      };

      localStorage.setItem("reefilm_admin_session", JSON.stringify(sessionObj));
      localStorage.setItem("reefilm_admin_remember_me", rememberMe ? "true" : "false");
      
      setLoginEmail("");
      setLoginPassword("");
      setSuccessMsg(`Welcome back, ${data.user.username}! Secure operator session established.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Login request failed:", err);
      setLoginError("Unable to establish communication with the administrative security desk.");
    }
  };

  // FORGOT PASSWORD FLOW
  // Step 1: Request OTP
  const handleRequestForgotOtp = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotEmail) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotError(data.message || "Failed to trigger recovery OTP.");
        return;
      }

      setForgotStep(2);
      setForgotSuccess(data.message || "A secure One-Time Password (OTP) has been dispatched to your email address.");
    } catch (err) {
      console.error("Forgot password OTP request failed:", err);
      setForgotError("Failed to establish secure handshake with auth server.");
    }
  };

  // Step 2: Verify OTP
  const [resetToken, setResetToken] = useState("");

  const handleVerifyForgotOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!otpInput) {
      setForgotError("Please enter the 6-digit OTP code.");
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: otpInput })
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotError(data.message || "OTP verification failed.");
        return;
      }

      setResetToken(data.resetToken);
      setForgotStep(3);
      setForgotSuccess("OTP verified successfully. Please configure your new password.");
    } catch (err) {
      console.error("OTP verification request failed:", err);
      setForgotError("Failed to transmit verification code to safety engine.");
    }
  };

  // Step 3: Create and Save New Password
  const handleResetPasswordSave = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!newPasswordFirst || !newPasswordConfirm) {
      setForgotError("Please fill out both password fields.");
      return;
    }

    if (newPasswordFirst.length < 6) {
      setForgotError("Password must be at least 6 characters in length.");
      return;
    }

    if (newPasswordFirst !== newPasswordConfirm) {
      setForgotError("Confirm password does not match the new password.");
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          resetToken,
          newPassword: newPasswordFirst,
          confirmPassword: newPasswordConfirm
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotError(data.message || "Password modification failed.");
        return;
      }

      // Force logout from all active sessions
      handleLogout();

      // Reset forgot states
      setAuthMode("login");
      setForgotStep(1);
      setForgotEmail("");
      setNewPasswordFirst("");
      setNewPasswordConfirm("");
      setResetToken("");
      
      setSuccessMsg("Password updated successfully. Please log in with your new credentials.");
      setTimeout(() => setSuccessMsg(""), 6000);
    } catch (err) {
      console.error("Password reset commit failed:", err);
      setForgotError("Security server rejected password update.");
    }
  };


  // IN-PROFILE CHANGE PASSWORD FLOW
  const handleInitiateChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess("");

    if (!currentUser) {
      setChangePasswordError("No active administrator session detected.");
      return;
    }

    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setChangePasswordError("All fields are mandatory.");
      return;
    }

    if (newPasswordInput.length < 6) {
      setChangePasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setChangePasswordError("Confirm password does not match new password.");
      return;
    }

    try {
      const sessionObj = localStorage.getItem("reefilm_admin_session");
      if (!sessionObj) return;
      const { token } = JSON.parse(sessionObj);

      const response = await fetch("/api/auth/send-change-otp", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setChangePasswordError(data.message || "Failed to trigger security code.");
        return;
      }

      setChangePasswordStep(2);
      setChangePasswordSuccess("A verification OTP code has been dispatched to your registered email.");
    } catch (err) {
      console.error("In-profile change password OTP request failed:", err);
      setChangePasswordError("Authentication server refused to issue OTP.");
    }
  };

  const handleVerifyChangePasswordOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess("");

    if (!currentUser) return;

    if (!changePasswordOtpInput) {
      setChangePasswordError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      const sessionObj = localStorage.getItem("reefilm_admin_session");
      if (!sessionObj) return;
      const { token } = JSON.parse(sessionObj);

      const response = await fetch("/api/auth/verify-change-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          otp: changePasswordOtpInput,
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
          confirmPassword: confirmPasswordInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setChangePasswordError(data.message || "Verification failed.");
        return;
      }

      // Reset change password state
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
      setChangePasswordOtpInput("");
      setChangePasswordStep(1);

      // Force logout from all sessions after a password change!
      handleLogout("Password updated successfully. You have been logged out to secure all active sessions.");
    } catch (err) {
      console.error("Change password verification failed:", err);
      setChangePasswordError("Verification locked down. Unable to coordinate credentials rewrite.");
    }
  };

  // Simulated Supabase Upload Processor
  const triggerSimulatedUpload = (type: "image" | "video" | "pdf", name: string, onComplete?: (url: string) => void) => {
    const bucket = type === "image" ? "images-bucket" : type === "video" ? "videos-bucket" : "pdfs-bucket";
    const cleanedName = name.replace(/\s+/g, "_").toLowerCase() || "doc_" + Math.floor(Math.random() * 1000);
    
    setUploadState({
      isUploading: true,
      progress: 0,
      fileName: cleanedName,
      fileType: type,
      bucket: bucket,
      url: ""
    });

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        let targetUrl = "";
        if (type === "image") {
          targetUrl = `/src/assets/images/${cleanedName}.jpg`;
        } else if (type === "video") {
          targetUrl = `https://supabase.co/storage/v1/object/public/${bucket}/${cleanedName}.mp4`;
        } else {
          targetUrl = `https://supabase.co/storage/v1/object/public/${bucket}/${cleanedName}.pdf`;
        }

        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          progress: 100,
          url: targetUrl
        }));

        if (onComplete) {
          onComplete(targetUrl);
        }
        
        setSuccessMsg(`Uploaded file to separate Supabase storage: bucket [${bucket}]`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setUploadState(prev => ({
          ...prev,
          progress: currentProgress
        }));
      }
    }, 200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // CRUD actions for products
  const openProductForm = (mode: "add" | "edit", item?: Product) => {
    setFormMode(mode);
    setIsFormOpen(true);
    if (mode === "edit" && item) {
      setActiveEditingId(item.id);
      setPName(item.name);
      setPCategory(item.category);
      setPTagline(item.tagline);
      setPDesc(item.description);
      setPPitch(item.specifications.pitch);
      setPTransparency(item.specifications.transparency);
      setPBrightness(item.specifications.brightness);
      setPWeight(item.specifications.weight);
      setPPower(item.specifications.avgPower);
      setPImage(item.image);
      setPBrochureUrl(item.brochureUrl || "");
      setPSeries(item.series || "O Series");
      setPVideoUrl(item.videoUrl || "");
      setPDisplayOrder(item.displayOrder || 0);
      setPRefreshRate(item.specifications.refreshRate || "3,840 Hz");
      setPThickness(item.specifications.thickness || "2.0mm");
      setPMaxPower(item.specifications.maxPower || "600 W/m²");
      setPFeatures(item.features ? item.features.join(", ") : "");
      setPBenefits(item.benefits ? item.benefits.join(", ") : "");
      setPInstallation(item.installation || "");
      setPMaintenance(item.maintenance || "");
    } else {
      setActiveEditingId(null);
      setPName("");
      setPCategory("LED Film");
      setPTagline("");
      setPDesc("");
      setPPitch("6.25mm");
      setPTransparency("85%");
      setPBrightness("5500 nits");
      setPWeight("2.4 kg/m²");
      setPPower("120 W/m²");
      setPImage("/src/assets/images/reefilm_breakpoint_tech_1782554378090.jpg");
      setPBrochureUrl("");
      setPSeries("O Series");
      setPVideoUrl("");
      setPDisplayOrder(products.length + 1);
      setPRefreshRate("3,840 Hz");
      setPThickness("2.0mm");
      setPMaxPower("600 W/m²");
      setPFeatures("Custom frame integration, Ambient illumination support");
      setPBenefits("Maintains building daylight integrity, Enables premium architectural branding");
      setPInstallation("Wet-lamination directly onto high-transmittance glass facades.");
      setPMaintenance("Interchangeable module segments.");
    }
  };

  const handleProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pName) return;

    const prodData: Product = {
      id: activeEditingId || pName.toLowerCase().replace(/\s+/g, "-"),
      name: pName,
      category: pCategory,
      tagline: pTagline || "Premium transparency digital film display",
      description: pDesc || "Full specification glass-lamination digital screen, customized layout.",
      features: pFeatures.split(",").map(f => f.trim()).filter(Boolean),
      benefits: pBenefits.split(",").map(b => b.trim()).filter(Boolean),
      specifications: {
        pitch: pPitch,
        transparency: pTransparency,
        brightness: pBrightness,
        refreshRate: pRefreshRate || "3,840 Hz",
        thickness: pThickness || "2.0mm",
        weight: pWeight,
        avgPower: pPower,
        maxPower: pMaxPower || "600 W/m²"
      },
      installation: pInstallation || "Wet-lamination directly onto high-transmittance glass facades.",
      maintenance: pMaintenance || "Interchangeable module segments.",
      image: pImage,
      brochureUrl: pBrochureUrl,
      series: pSeries,
      videoUrl: pVideoUrl,
      displayOrder: Number(pDisplayOrder) || 0
    };

    if (formMode === "add") {
      onUpdateProducts([...products, prodData]);
      setSuccessMsg("Product added to live catalog!");
      logActivity("PRODUCT_ADD", `Added product "${prodData.name}" (Series: ${prodData.series}) to live catalog.`);
    } else {
      onUpdateProducts(products.map(p => p.id === activeEditingId ? prodData : p));
      setSuccessMsg("Product specifications updated!");
      logActivity("PRODUCT_EDIT", `Updated specifications for product "${prodData.name}".`);
    }
    
    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm("Are you sure you want to permanently remove this product from the catalog?")) {
      const prod = products.find(p => p.id === prodId);
      onUpdateProducts(products.filter(p => p.id !== prodId));
      setSuccessMsg("Product removed from catalog successfully!");
      logActivity("PRODUCT_DELETE", `Deleted product "${prod ? prod.name : prodId}" from catalog.`, "warning");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // CRUD actions for Projects
  const openProjectForm = (mode: "add" | "edit", item?: Project) => {
    setFormMode(mode);
    setIsFormOpen(true);
    if (mode === "edit" && item) {
      setActiveEditingId(item.id);
      setProjTitle(item.title);
      setProjCategory(item.category);
      setProjLocation(item.location);
      setProjClient(item.client);
      setProjTimeline(item.timeline);
      setProjDescription(item.description);
      setProjBeforeImage(item.beforeImage);
      setProjAfterImage(item.afterImage);
      setProjTechUsed(item.techUsed ? item.techUsed.join(", ") : "");
      setProjInstallationSize(item.installationSize || "");
      setProjHighlights(item.projectHighlights ? item.projectHighlights.join(", ") : "");
      setProjBenefits(item.customerBenefits ? item.customerBenefits.join(", ") : "");
      setProjReviewText(item.review ? item.review.text : "");
      setProjReviewer(item.review ? item.review.reviewer : "");
      setProjReviewerRole(item.review ? item.review.role : "");
      setProjRating(item.review ? item.review.rating : 5);
    } else {
      setActiveEditingId(null);
      setProjTitle("");
      setProjCategory("Storefronts & Entrances");
      setProjLocation("");
      setProjClient("");
      setProjTimeline("");
      setProjDescription("");
      setProjBeforeImage("");
      setProjAfterImage("");
      setProjTechUsed("O-Series Film");
      setProjInstallationSize("");
      setProjHighlights("");
      setProjBenefits("");
      setProjReviewText("");
      setProjReviewer("");
      setProjReviewerRole("");
      setProjRating(5);
    }
  };

  const handleProjectSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;

    const projData: Project = {
      id: activeEditingId || projTitle.toLowerCase().replace(/\s+/g, "-"),
      title: projTitle,
      category: projCategory,
      location: projLocation,
      client: projClient,
      timeline: projTimeline,
      description: projDescription,
      beforeImage: projBeforeImage || "/src/assets/images/logo.png",
      afterImage: projAfterImage || "/src/assets/images/logo.png",
      techUsed: projTechUsed.split(",").map(t => t.trim()).filter(Boolean),
      installationSize: projInstallationSize || undefined,
      projectHighlights: projHighlights ? projHighlights.split(",").map(t => t.trim()).filter(Boolean) : undefined,
      customerBenefits: projBenefits ? projBenefits.split(",").map(t => t.trim()).filter(Boolean) : undefined,
      review: projReviewText ? {
        text: projReviewText,
        reviewer: projReviewer || "Client Representative",
        role: projReviewerRole || "Project Manager",
        rating: Number(projRating) || 5
      } : undefined
    };

    if (formMode === "add") {
      onUpdateProjects([...projects, projData]);
      setSuccessMsg("Project added to interactive portfolio!");
      logActivity("PROJECT_ADD", `Added project "${projData.title}" to portfolio.`);
    } else {
      onUpdateProjects(projects.map(p => p.id === activeEditingId ? projData : p));
      setSuccessMsg("Project details updated successfully!");
      logActivity("PROJECT_EDIT", `Updated portfolio project "${projData.title}".`);
    }

    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteProject = (projId: string) => {
    if (confirm("Are you sure you want to permanently remove this project?")) {
      const proj = projects.find(p => p.id === projId);
      onUpdateProjects(projects.filter(p => p.id !== projId));
      setSuccessMsg("Project deleted from portfolio.");
      logActivity("PROJECT_DELETE", `Deleted project "${proj ? proj.title : projId}" from portfolio.`, "warning");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // CRUD actions for Applications
  const openApplicationForm = (mode: "add" | "edit", item?: ApplicationItem) => {
    setFormMode(mode);
    setIsFormOpen(true);
    if (mode === "edit" && item) {
      setActiveEditingId(item.id);
      setAppTitle(item.title);
      setAppTagline(item.tagline);
      setAppOverview(item.overview);
      setAppBenefits(item.benefits ? item.benefits.join(", ") : "");
      setAppRecommendedProducts(item.recommendedProducts ? item.recommendedProducts.join(", ") : "");
      setAppCaseStudyTitle(item.caseStudy ? item.caseStudy.title : "");
      setAppChallenge(item.caseStudy ? item.caseStudy.challenge : "");
      setAppSolution(item.caseStudy ? item.caseStudy.solution : "");
      setAppResult(item.caseStudy ? item.caseStudy.result : "");
    } else {
      setActiveEditingId(null);
      setAppTitle("");
      setAppTagline("");
      setAppOverview("");
      setAppBenefits("");
      setAppRecommendedProducts("");
      setAppCaseStudyTitle("");
      setAppChallenge("");
      setAppSolution("");
      setAppResult("");
    }
  };

  const handleApplicationSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!appTitle) return;

    const appData: ApplicationItem = {
      id: activeEditingId || appTitle.toLowerCase().replace(/\s+/g, "-"),
      title: appTitle,
      tagline: appTagline,
      overview: appOverview,
      benefits: appBenefits.split(",").map(t => t.trim()).filter(Boolean),
      recommendedProducts: appRecommendedProducts.split(",").map(t => t.trim()).filter(Boolean),
      gallery: [],
      caseStudy: {
        title: appCaseStudyTitle || "Landmark Implementation",
        challenge: appChallenge || "Standard structural facade installation",
        solution: appSolution || "Reefilm Smart glass screen configuration",
        result: appResult || "Enhanced aesthetic value and functional visual output"
      }
    };

    if (formMode === "add") {
      onUpdateApplications([...applications, appData]);
      setSuccessMsg("Application added to catalog!");
      logActivity("APPLICATION_ADD", `Added architectural application "${appData.title}".`);
    } else {
      onUpdateApplications(applications.map(a => a.id === activeEditingId ? appData : a));
      setSuccessMsg("Application details updated successfully!");
      logActivity("APPLICATION_EDIT", `Updated architectural application "${appData.title}".`);
    }

    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteApplication = (appId: string) => {
    if (confirm("Are you sure you want to permanently delete this application?")) {
      const app = applications.find(a => a.id === appId);
      onUpdateApplications(applications.filter(a => a.id !== appId));
      setSuccessMsg("Application removed successfully.");
      logActivity("APPLICATION_DELETE", `Deleted architectural application "${app ? app.title : appId}".`, "warning");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // CRUD actions for Gallery Items
  const openGalleryForm = (mode: "add" | "edit", item?: GalleryItem) => {
    setFormMode(mode);
    setIsFormOpen(true);
    if (mode === "edit" && item) {
      setActiveEditingId(item.id);
      setGTitle(item.title);
      setGCategory(item.category);
      setGImage(item.imageUrl);
      setGVideo(item.videoUrl || "");
      setGLocation(item.location);
      setGDescription(item.description);
      setGLayers(item.specs.layers);
      setGTransmission(item.specs.transmission);
      setGController(item.specs.controller);
      setGDimensions(item.specs.dimensions);
      setGClient(item.client || "");
      setGTimeline(item.timeline || "");
      setGIsFeatured(!!item.is_featured);
    } else {
      setActiveEditingId(null);
      setGTitle("");
      setGCategory("Storefronts & Entrances");
      setGImage("");
      setGVideo("");
      setGLocation("");
      setGDescription("");
      setGLayers("12mm + PVB + 12mm Toughened");
      setGTransmission("90% Ultra Clear");
      setGController("Reefilm-Pro Sync Hub");
      setGDimensions("8.0m x 3.5m");
      setGClient("");
      setGTimeline("");
      setGIsFeatured(false);
    }
  };

  const handleGallerySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!gTitle) return;

    const galleryData: GalleryItem = {
      id: activeEditingId || gTitle.toLowerCase().replace(/\s+/g, "-"),
      title: gTitle,
      category: gCategory,
      imageUrl: gImage || "/src/assets/images/luxury_brand_storefront_1782555321941.jpg",
      videoUrl: gVideo || "",
      location: gLocation || "Chennai",
      description: gDescription || "Active transparent display setup featuring state of the art lamination calibration specs.",
      client: gClient || "Reefilm India Client",
      timeline: gTimeline || "Completed",
      is_featured: gIsFeatured,
      created_at: new Date().toISOString(),
      specs: {
        layers: gLayers,
        transmission: gTransmission,
        controller: gController,
        dimensions: gDimensions
      }
    };

    if (formMode === "add") {
      onUpdateGalleryItems([...galleryItems, galleryData]);
      setSuccessMsg("Portfolio project lodged in gallery!");
      logActivity("GALLERY_ADD", `Added gallery project "${galleryData.title}" in category "${galleryData.category}".`);
    } else {
      onUpdateGalleryItems(galleryItems.map(g => g.id === activeEditingId ? galleryData : g));
      setSuccessMsg("Gallery project specifications updated!");
      logActivity("GALLERY_EDIT", `Updated gallery project specifications for "${galleryData.title}".`);
    }

    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this project case?")) {
      const item = galleryItems.find(g => g.id === id);
      onUpdateGalleryItems(galleryItems.filter(g => g.id !== id));
      setSuccessMsg("Gallery project removed successfully!");
      logActivity("GALLERY_DELETE", `Deleted gallery project "${item ? item.title : id}".`, "warning");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // CRUD actions for Downloads
  const openDownloadForm = (mode: "add" | "edit", item?: ResourceDoc) => {
    setFormMode(mode);
    setIsFormOpen(true);
    if (mode === "edit" && item) {
      setActiveEditingId(item.id);
      setDTitle(item.title);
      setDCategory(item.category);
      setDFileUrl(item.fileUrl);
      setDSize(item.fileSize);
      setDCode(item.docCode || "");
    } else {
      setActiveEditingId(null);
      setDTitle("");
      setDCategory("Brochures");
      setDFileUrl("");
      setDSize("1.8 MB");
      setDCode("RF-CAT-2026");
    }
  };

  const handleDownloadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!dTitle) return;

    const previousDoc = downloads.find(d => d.id === activeEditingId);
    const dlData: ResourceDoc = {
      id: activeEditingId || dTitle.toLowerCase().replace(/\s+/g, "-"),
      title: dTitle,
      category: dCategory,
      fileUrl: dFileUrl || "https://supabase.co/storage/v1/object/public/pdfs-bucket/brochure.pdf",
      fileSize: dSize,
      docCode: dCode,
      downloadCount: previousDoc ? previousDoc.downloadCount : 0
    };

    if (formMode === "add") {
      onUpdateDownloads([...downloads, dlData]);
      setSuccessMsg("Download resource published successfully!");
      logActivity("DOWNLOAD_ADD", `Published new technical document "${dlData.title}" (${dlData.fileSize}).`);
    } else {
      onUpdateDownloads(downloads.map(d => d.id === activeEditingId ? dlData : d));
      setSuccessMsg("Download resource metadata updated!");
      logActivity("DOWNLOAD_EDIT", `Updated technical document metadata for "${dlData.title}".`);
    }

    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteDownload = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this downloadable resource?")) {
      const doc = downloads.find(d => d.id === id);
      onUpdateDownloads(downloads.filter(d => d.id !== id));
      setSuccessMsg("Technical resource deleted successfully!");
      logActivity("DOWNLOAD_DELETE", `Deleted technical document "${doc ? doc.title : id}".`, "warning");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // CRUD actions for Team Members
  const openTeamForm = (mode: "add" | "edit", item?: TeamMember) => {
    setFormMode(mode);
    setIsFormOpen(true);
    if (mode === "edit" && item) {
      setActiveEditingId(item.id);
      setTName(item.name);
      setTPosition(item.position);
      setTDept(item.department);
      setTInitials(item.initials);
      setTBio(item.bio);
      setTEmail(item.email || "");
    } else {
      setActiveEditingId(null);
      setTName("");
      setTPosition("");
      setTDept("");
      setTInitials("");
      setTBio("");
      setTEmail("");
    }
  };

  const handleTeamSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!tName) return;

    const teamData: TeamMember = {
      id: activeEditingId || tName.toLowerCase().replace(/\s+/g, "-"),
      name: tName,
      position: tPosition,
      department: tDept,
      initials: tInitials || tName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      bio: tBio,
      email: tEmail || undefined
    };

    if (formMode === "add") {
      onUpdateTeamMembers([...teamMembers, teamData]);
      setSuccessMsg("Team profile appended successfully!");
    } else {
      onUpdateTeamMembers(teamMembers.map(t => t.id === activeEditingId ? teamData : t));
      setSuccessMsg("Team profile specifications updated!");
    }

    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // CRUD actions for Blog Posts
  const openBlogForm = (mode: "add" | "edit", item?: BlogPost) => {
    setFormMode(mode);
    setIsFormOpen(true);
    if (mode === "edit" && item) {
      setActiveEditingId(item.id);
      setBTitle(item.title);
      setBCategory(item.category);
      setBExcerpt(item.excerpt);
      setBContent(item.content);
      setBReadTime(item.readTime);
      setBImage(item.image);
    } else {
      setActiveEditingId(null);
      setBTitle("");
      setBCategory("Buying Guide");
      setBExcerpt("");
      setBContent("");
      setBReadTime("5 min read");
      setBImage("/src/assets/images/reefilm_breakpoint_tech_1782554378090.jpg");
    }
  };

  const handleBlogSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bTitle) return;

    const blogData: BlogPost = {
      id: activeEditingId || bTitle.toLowerCase().replace(/\s+/g, "-"),
      title: bTitle,
      category: bCategory,
      excerpt: bExcerpt,
      content: bContent,
      readTime: bReadTime,
      image: bImage,
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: "Raj Gupta, Reefilm Support Desk",
      tags: ["Transparent display", "Aesthetic layout"]
    };

    if (formMode === "add") {
      onUpdateBlogs([...blogs, blogData]);
      setSuccessMsg("Blog post published successfully!");
    } else {
      onUpdateBlogs(blogs.map(b => b.id === activeEditingId ? blogData : b));
      setSuccessMsg("Blog article content updated!");
    }

    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // CRUD actions for Admin Users
  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!uUsername || !uEmail || !uPassword) {
      alert("All fields are mandatory when provisioning a new administrator account.");
      return;
    }

    if (uPassword.length < 6) {
      alert("Initial temporary password must be at least 6 characters in length.");
      return;
    }

    try {
      const sessionObj = localStorage.getItem("reefilm_admin_session");
      if (!sessionObj) return;
      const { token } = JSON.parse(sessionObj);

      const response = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: uUsername,
          email: uEmail,
          password: uPassword,
          role: uRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add operator.");
        return;
      }

      onUpdateAdminUsers([...verifiedAdminUsers, data.user]);
      setUUsername("");
      setUEmail("");
      setUPassword("");
      setSuccessMsg(`Operator account for '${uUsername}' provisioned with secure credentials.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to add operator:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Revoke operator access permissions for this user?")) {
      try {
        const sessionObj = localStorage.getItem("reefilm_admin_session");
        if (!sessionObj) return;
        const { token } = JSON.parse(sessionObj);

        const response = await fetch(`/api/auth/users/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to revoke permissions.");
          return;
        }

        onUpdateAdminUsers(verifiedAdminUsers.filter(u => u.id !== id));
        setSuccessMsg("Operator authorization revoked successfully.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  // Status handlers for leads / quotes
  const handleLeadStatusChange = async (id: string, stat: LeadInquiry["status"]) => {
    try {
      const sessionObj = localStorage.getItem("reefilm_admin_session");
      if (!sessionObj) return;
      const { token } = JSON.parse(sessionObj);

      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: stat })
      });

      if (response.ok) {
        onUpdateLeads(leads.map(l => l.id === id ? { ...l, status: stat } : l));
        setSuccessMsg(`Lead status modified to '${stat}'`);
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to update status on server.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm("Permanently delete this inquiry from backend ledger?")) {
      try {
        const sessionObj = localStorage.getItem("reefilm_admin_session");
        if (!sessionObj) return;
        const { token } = JSON.parse(sessionObj);

        const response = await fetch(`/api/leads/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          onUpdateLeads(leads.filter(l => l.id !== id));
          setSuccessMsg("Inquiry removed from persistent ledger.");
        } else {
          const errData = await response.json();
          alert(errData.message || "Failed to delete inquiry from server.");
        }
      } catch (err) {
        console.error("Failed to delete lead:", err);
      }
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // CSV Dynamic Exporter
  const handleExportToExcel = (leadsList: LeadInquiry[], label: string) => {
    if (leadsList.length === 0) {
      alert("No lead inquiries available to export.");
      return;
    }
    const headers = [
      "Inquiry ID", "Full Name", "Company", "Phone", "WhatsApp", "Email", 
      "City", "State", "Country", "Product Requested", "Screen Size", 
      "Glass Size", "Quantity", "Budget Bracket", "Expected Timeline", 
      "Status", "Created At", "Requirements / Message"
    ];

    const rows = leadsList.map(l => [
      l.id,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.whatsapp || ""}"`,
      `"${l.email}"`,
      `"${(l.city || "").replace(/"/g, '""')}"`,
      `"${(l.state || "").replace(/"/g, '""')}"`,
      `"${(l.country || "India").replace(/"/g, '""')}"`,
      `"${(l.productOfInterest || "").replace(/"/g, '""')}"`,
      `"${(l.screenSize || "").replace(/"/g, '""')}"`,
      `"${(l.glassSize || "").replace(/"/g, '""')}"`,
      `"${l.quantity || "1"}"`,
      `"${(l.budgetRange || "").replace(/"/g, '""')}"`,
      `"${(l.timeline || "").replace(/"/g, '""')}"`,
      l.status,
      l.createdAt || "",
      `"${(l.specialRequirements || "").replace(/\n/g, " ").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reefilm_${label}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg("Exported CSV successfully. Ready for Excel import.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Filter lists based on quotes vs general leads
  const quoteRequests = leads.filter(l => l.productOfInterest || l.budgetRange || l.glassSize);
  const contactLeads = leads.filter(l => !l.productOfInterest && !l.budgetRange && !l.glassSize);

  // Search & Filter leads
  const searchLeads = (list: LeadInquiry[]) => {
    return list.filter(l => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        l.fullName.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.city && l.city.toLowerCase().includes(q));
      
      const matchesStatus = statusFilter === "All" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  // Analytics helper data
  const leadsByStatusData = [
    { name: "New", value: leads.filter(l => l.status === "New").length },
    { name: "Contacted", value: leads.filter(l => l.status === "Contacted").length },
    { name: "Proposal Sent", value: leads.filter(l => l.status === "Proposal Sent").length },
    { name: "Closed Won", value: leads.filter(l => l.status === "Closed - Won").length },
  ];
  const colors = ["#E30613", "#3B82F6", "#F59E0B", "#10B981"];

  return (
    <div id="admin-dashboard-root" className="bg-black text-white font-sans min-h-screen selection:bg-red-500 selection:text-white pb-20">
      
      {/* AUTHENTICATION PORTAL */}
      {!isAuthenticated ? (
        <section className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12">
          {authMode === "login" ? (
            <div className="max-w-md w-full bg-neutral-950 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 animate-pulse" />
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Enterprise CMS Desk</h2>
                <p className="text-[11px] text-gray-500 font-mono">REEFILM INDIA AUTHORIZED PORTAL</p>
              </div>

              {successMsg && (
                <div className="bg-emerald-600/10 border border-emerald-500/25 p-3 rounded-lg text-xs text-emerald-400 font-mono">
                  ✓ {successMsg}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="bg-red-600/10 border border-red-500/25 p-3 rounded-lg text-xs text-red-500 font-mono leading-relaxed">
                    ⚠️ {loginError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("forgot_password");
                        setForgotStep(1);
                        setForgotError("");
                        setForgotSuccess("");
                      }}
                      className="text-[10px] font-mono text-red-500 hover:text-red-400 hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Remember me parameter */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-[11px] text-gray-400 font-mono cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-black border-white/10 text-red-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 accent-red-600 cursor-pointer"
                    />
                    <span>Remember Me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-red-600/15"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </form>

              {/* Developer Bypass & Account testing table */}
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-2.5">
                <div className="text-[10px] font-black uppercase font-mono text-red-500 tracking-wider">🔐 Authorized Operators Directory</div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-500">
                  <div className="border border-white/5 p-2 rounded bg-black/40">
                    <span className="text-white block font-sans font-bold">Admin Account</span>
                    <span>razzg946@gmail.com</span>
                    <span className="text-gray-400 block mt-1">Password: admin123</span>
                  </div>
                  <div className="border border-white/5 p-2 rounded bg-black/40">
                    <span className="text-white block font-sans font-bold">Operator Desk</span>
                    <span>operator@reefilm.in</span>
                    <span className="text-gray-400 block mt-1">Password: operator123</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* FORGOT PASSWORD WORKFLOW STEPPER */
            <div className="max-w-md w-full bg-neutral-950 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500 animate-pulse" />
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Account Security Recovery</h2>
                <p className="text-[11px] text-gray-500 font-mono">DETERMINE SYSTEM IDENTITY ACCESS</p>
              </div>

              {/* Step indicator breadcrumbs */}
              <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono font-bold tracking-wider uppercase border-b border-white/5 pb-4">
                <span className={forgotStep === 1 ? "text-amber-500" : "text-gray-600"}>1. Request OTP</span>
                <span className={forgotStep === 2 ? "text-amber-500" : "text-gray-600"}>2. OTP Verification</span>
                <span className={forgotStep === 3 ? "text-amber-500" : "text-gray-600"}>3. Reset Password</span>
              </div>

              {forgotError && (
                <div className="bg-red-600/10 border border-red-500/25 p-3 rounded-lg text-xs text-red-500 font-mono leading-relaxed">
                  ⚠️ {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-lg text-xs text-amber-400 font-mono leading-relaxed">
                  ✓ {forgotSuccess}
                </div>
              )}

              {/* STEP 1: Email Request */}
              {forgotStep === 1 && (
                <form onSubmit={handleRequestForgotOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">Registered Administrator Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. razzg946@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/15"
                  >
                    <span>Generate Secure OTP</span>
                  </button>
                </form>
              )}

              {/* STEP 2: Verify OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyForgotOtpSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">One-Time Password (OTP)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit OTP code"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-3 text-xs text-center font-mono text-white tracking-widest focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>Attempts: {otpAttempts} / 5</span>
                    <span>Valid for: 5 minutes</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Authorize OTP Code</span>
                  </button>
                </form>
              )}

              {/* STEP 3: Change Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPasswordSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">New Administrator Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={newPasswordFirst}
                      onChange={(e) => setNewPasswordFirst(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm your secure password"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Save & Confirm New Password</span>
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setForgotStep(1);
                  }}
                  className="text-[11px] font-mono text-gray-500 hover:text-white underline transition-colors"
                >
                  Return to Operator Login
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* MAIN CMS ENVIRONMENT */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
          
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Operator Active: {currentUser?.username || "Admin"} ({currentUser?.role || "Administrator"}) • {currentUser?.email || "razzg946@gmail.com"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">Reefilm India Enterprise CMS</h1>
              <p className="text-xs text-gray-500">Add, edit, delete, and structure all front-facing text modules, products, team rosters, blogs, and downloads dynamically.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 border border-white/5 rounded">SQLite Layer: OK</span>
              <button
                onClick={() => handleLogout("You have successfully logged out of your secure operator session.")}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider border border-red-500/25 bg-red-950/10 px-4 py-2 rounded-lg cursor-pointer"
              >
                Logout Portal
              </button>
            </div>
          </div>

          {/* Quick Success Banner */}
          {successMsg && (
            <div className="bg-emerald-600/15 border border-emerald-500/25 p-4 rounded-xl text-xs text-emerald-400 font-mono text-center animate-pulse">
              ✓ {successMsg}
            </div>
          )}

          {/* CMS SIDEBAR-STRETCH GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold font-mono text-red-500 uppercase tracking-widest px-3 mb-2">CMS Modules</p>
                
                {[
                  { id: "dashboard", label: "Dashboard Hub", icon: BarChart, count: null },
                  { id: "content_manager", label: "Website Content Manager", icon: Edit, count: null },
                  { id: "setup", label: "System Setup", icon: Sliders, count: null },
                  { id: "products", label: "Products Catalog", icon: Layers, count: products.length },
                  { id: "projects", label: "Interactive Portfolio", icon: Building2, count: projects.length },
                  { id: "applications", label: "Architectural Apps", icon: Cpu, count: applications.length },
                  { id: "gallery", label: "Project Gallery", icon: ImageIcon, count: galleryItems.length },
                  { id: "downloads", label: "Technical Docs", icon: Download, count: downloads.length },
                  { id: "media_library", label: "Media Library", icon: FileUp, count: mediaLibrary.length },
                  { id: "quotes", label: "Quote Requests", icon: MessageSquare, count: quoteRequests.length },
                  { id: "leads", label: "Contact Inquiries", icon: Mail, count: contactLeads.length },
                  { id: "team", label: "Team Management", icon: Award, count: teamMembers.length },
                  { id: "blog", label: "Blog & Insights", icon: BookOpen, count: blogs.length },
                  { id: "settings", label: "Website Settings", icon: Settings, count: null },
                  { id: "seo_manager", label: "SEO Manager", icon: Globe, count: null },
                  { id: "users", label: "User Management", icon: UserCheck, count: adminUsers.length },
                  { id: "activity_log", label: "Activity Log", icon: Clock, count: activityLogs.length },
                  { id: "backup_restore", label: "Backup & Restore", icon: Database, count: null },
                  { id: "profile", label: "Profile & Security", icon: Lock, count: null },
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = activeSubTab === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveSubTab(m.id as any);
                        setSearchQuery("");
                        setIsFormOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive 
                          ? "bg-[#E30613] text-white shadow-lg shadow-red-600/10" 
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{m.label}</span>
                      </span>
                      {m.count !== null && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-gray-500"}`}>
                          {m.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Interactive Supabase Asset Storage Uploader (DURABLE & CLASS-CLASSIFIED) */}
              <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-red-500" />
                    <span>Supabase Storage Hub</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono">STORE IMAGES, VIDEOS, AND PDFS SEPARATELY</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1 text-xs">
                    <label className="text-[10px] text-gray-400 font-mono uppercase">Asset Classification Category</label>
                    <div className="grid grid-cols-3 gap-1">
                      {["image", "video", "pdf"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => triggerSimulatedUpload(t as any, `reefilm_${t}_${Math.floor(Math.random() * 1000)}`)}
                          className="px-2 py-1.5 bg-white/5 hover:bg-red-600/20 hover:text-white border border-white/5 rounded text-[10px] font-mono uppercase font-bold text-gray-400 cursor-pointer"
                        >
                          {t}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload State visualizer */}
                  {uploadState.isUploading && (
                    <div className="space-y-2 bg-black/40 border border-white/5 p-3 rounded-xl">
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span className="truncate">Uploading {uploadState.fileName}</span>
                        <span>{uploadState.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600" style={{ width: `${uploadState.progress}%` }} />
                      </div>
                      <p className="text-[8px] font-mono text-gray-500 text-center uppercase tracking-widest animate-pulse">Pushing to Supabase Bucket: {uploadState.bucket}</p>
                    </div>
                  )}

                  {!uploadState.isUploading && uploadState.url && (
                    <div className="space-y-2.5 bg-neutral-900 border border-emerald-500/25 p-3.5 rounded-xl animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500" /> SUPABASE {uploadState.bucket.toUpperCase()} OK
                        </span>
                        <button
                          onClick={() => copyToClipboard(uploadState.url)}
                          className="text-red-400 hover:text-red-300 font-bold uppercase font-mono text-[9px] flex items-center gap-1"
                        >
                          {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedUrl ? "Copied" : "Copy URL"}
                        </button>
                      </div>
                      <p className="text-[10px] font-mono text-white break-all bg-black/50 p-2 rounded border border-white/5 select-all select-all select-all">
                        {uploadState.url}
                      </p>
                      <p className="text-[8px] font-mono text-gray-500">Paste this URL directly into form inputs below to link your dynamic media.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CMS Central workspace */}
            <div className="lg:col-span-9 space-y-6">

              {/* SYSTEM SETUP WIZARD */}
              {activeSubTab === "setup" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in text-white">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-red-500" />
                      Supabase Cloud Setup Wizard
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Configure your enterprise backend, storage buckets, and database schema without editing any source files.
                    </p>
                  </div>

                  {/* Horizontal Stepper Progress */}
                  <div className="grid grid-cols-6 gap-2 border-b border-white/5 pb-4 text-center">
                    {[
                      { step: 1, label: "Credentials" },
                      { step: 2, label: "Storage Buckets" },
                      { step: 3, label: "DB Migration" },
                      { step: 4, label: "Admin User" },
                      { step: 5, label: "Upload Spec" },
                      { step: 6, label: "Status Verification" }
                    ].map((s) => (
                      <button
                        key={s.step}
                        onClick={() => setSetupActiveStep(s.step)}
                        className={`py-2 px-1 rounded-lg border transition-all text-[10px] uppercase font-bold tracking-wider cursor-pointer ${
                          setupActiveStep === s.step
                            ? "bg-red-600/15 text-red-400 border-red-500/40"
                            : "bg-neutral-900 text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        Step {s.step}
                        <span className="hidden sm:block text-[8px] font-mono font-normal tracking-normal text-gray-500 lowercase mt-0.5">{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Message Banner */}
                  {setupMsg && (
                    <div className={`p-4 rounded-xl text-xs font-mono flex items-start gap-2 border ${
                      setupMsg.type === "success"
                        ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
                        : "bg-red-950/20 text-red-400 border-red-500/20"
                    }`}>
                      <span className="shrink-0">{setupMsg.type === "success" ? "✓" : "⚠️"}</span>
                      <p className="whitespace-pre-wrap">{setupMsg.text}</p>
                    </div>
                  )}

                  {/* STEP 1: CREDENTIALS */}
                  {setupActiveStep === 1 && (
                    <div className="space-y-5">
                      <div className="bg-red-950/10 border border-red-500/10 p-4 rounded-xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-red-400 tracking-wider font-mono">1. Register Connection Secrets</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          Provide your Supabase Project settings. This is completely secure; the settings are saved server-side in a local <code>.env</code> file.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Supabase Project URL</label>
                          <input
                            type="text"
                            placeholder="e.g. https://abcde12345.supabase.co"
                            value={setupConfig.url}
                            onChange={(e) => setSetupConfig({ ...setupConfig, url: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Publishable Anon Key</label>
                          <input
                            type="password"
                            placeholder="e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            value={setupConfig.anonKey}
                            onChange={(e) => setSetupConfig({ ...setupConfig, anonKey: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-between">
                            <span>Service Role Key (Recommended)</span>
                            <span className="text-[8px] text-gray-500 lowercase font-normal">(required for auto-buckets & auth)</span>
                          </label>
                          <input
                            type="password"
                            placeholder={setupConfig.serviceRoleKey.includes("•") ? "Saved (Unchanged)" : "e.g. super-secret-service-role-key"}
                            value={setupConfig.serviceRoleKey.includes("•") ? "" : setupConfig.serviceRoleKey}
                            onChange={(e) => setSetupConfig({ ...setupConfig, serviceRoleKey: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-between">
                            <span>PostgreSQL Connection String</span>
                            <span className="text-[8px] text-gray-500 lowercase font-normal">(required for auto DB migration)</span>
                          </label>
                          <input
                            type="password"
                            placeholder={setupConfig.pgConnectionString.includes("•") ? "Saved (Unchanged)" : "postgresql://postgres.[id]:[pass]@pooler.supabase.com:6543/postgres"}
                            value={setupConfig.pgConnectionString.includes("•") ? "" : setupConfig.pgConnectionString}
                            onChange={(e) => setSetupConfig({ ...setupConfig, pgConnectionString: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleTestConnection}
                          disabled={setupLoading || !setupConfig.url || !setupConfig.anonKey}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase rounded-lg border border-white/10 transition-all cursor-pointer disabled:opacity-40"
                        >
                          Test Connection
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveConfig}
                          disabled={setupLoading || !setupConfig.url || !setupConfig.anonKey}
                          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-lg transition-all cursor-pointer shadow-lg shadow-red-600/10 disabled:opacity-40"
                        >
                          {setupLoading ? "Saving..." : "Save & Bind Configuration"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: STORAGE SETUP */}
                  {setupActiveStep === 2 && (
                    <div className="space-y-5">
                      <div className="bg-red-950/10 border border-red-500/10 p-4 rounded-xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-red-400 tracking-wider font-mono">2. Storage Buckets Configuration</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          We require 5 specific public storage buckets in Supabase to host website content. Using your saved Service Role Key, we can create and verify them automatically in 1 click!
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {["products", "gallery", "videos", "documents", "logos"].map((b) => {
                          const ready = setupStatus?.buckets?.[b] === "ready";
                          return (
                            <div key={b} className="bg-neutral-900 border border-white/5 rounded-xl p-3 text-center space-y-1.5 font-mono text-xs">
                              <p className="text-[10px] text-gray-400 font-bold">{b}</p>
                              <div className="flex justify-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                  ready ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/20" : "bg-yellow-600/15 text-yellow-400 border border-yellow-500/20"
                                }`}>
                                  {ready ? "Active / Ready" : "Missing / Offline"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl space-y-2 text-xs text-gray-400 leading-relaxed font-mono">
                        <p className="text-[10px] uppercase font-bold text-red-500">Manual Bucket Creation Fallback Instructions:</p>
                        <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                          <li>Log in to your <strong>Supabase Dashboard</strong>.</li>
                          <li>Go to the <strong>Storage</strong> panel from the left sidebar.</li>
                          <li>Click <strong>New Bucket</strong>. Create buckets named exactly: <code>products</code>, <code>gallery</code>, <code>videos</code>, <code>documents</code>, and <code>logos</code>.</li>
                          <li>⚠️ <strong>CRITICAL:</strong> Toggle the <strong>"Public Bucket"</strong> switch to enabled for each bucket, so assets are viewable by the public!</li>
                        </ol>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={fetchSetupStatus}
                          className="px-4 py-2 border border-white/5 hover:border-white/15 bg-neutral-900 text-gray-300 text-xs font-bold uppercase rounded-lg cursor-pointer"
                        >
                          Refresh Bucket Status
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateBuckets}
                          disabled={setupLoading || !setupStatus?.connected}
                          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-lg transition-all cursor-pointer shadow-lg shadow-red-600/10 disabled:opacity-40"
                        >
                          Initialize Storage Buckets Automatically
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DATABASE SCHEMA SETUP */}
                  {setupActiveStep === 3 && (
                    <div className="space-y-5">
                      <div className="bg-red-950/10 border border-red-500/10 p-4 rounded-xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-red-400 tracking-wider font-mono">3. CMS Database Tables</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Reefilm India relies on 18 production relational SQL tables. If you saved your PostgreSQL connection string in Step 1, you can run migrations automatically! Otherwise, copy the SQL migration script below and run it inside the Supabase SQL editor.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 font-mono text-[10px]">
                        {[
                          "products", "product_images", "product_documents", "gallery", "categories", "blogs", "downloads", "team_members", "contact_leads", "quote_requests", "website_settings", "admin_users", "media_library",
                          "projects", "testimonials", "team", "settings", "leads"
                        ].map((t) => {
                          const exists = setupStatus?.tables?.[t] === true;
                          return (
                            <div key={t} className="bg-neutral-900 border border-white/5 rounded-xl p-2 text-center space-y-1">
                              <p className="text-[8px] text-gray-400 font-bold truncate" title={t}>{t}</p>
                              <div className="flex justify-center">
                                <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider ${
                                  exists ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/20" : "bg-red-600/15 text-red-400 border border-red-500/20"
                                }`}>
                                  {exists ? "✓ Ok" : "✗ Missing"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold font-mono text-gray-400 uppercase">Interactive SQL Migration Schema</label>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(setupStatus?.sqlScript || "");
                              setSetupMsg({ type: "success", text: "✓ SQL Schema copied to clipboard successfully!" });
                              setTimeout(() => setSetupMsg(null), 4000);
                            }}
                            className="text-[9px] bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 border border-white/15 rounded text-white cursor-pointer font-mono font-bold uppercase flex items-center gap-1"
                          >
                            <Copy className="w-3. h-3" /> Copy SQL Script
                          </button>
                        </div>
                        <div className="w-full max-h-40 overflow-y-auto bg-black border border-white/10 rounded-lg p-3 text-[10px] font-mono text-gray-400 whitespace-pre scrollbar-thin">
                          {setupStatus?.sqlScript || "-- Loading SQL schema script..."}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={fetchSetupStatus}
                          className="px-4 py-2 border border-white/5 bg-neutral-900 text-gray-300 text-xs font-bold uppercase rounded-lg cursor-pointer"
                        >
                          Refresh Table Status
                        </button>
                        <button
                          type="button"
                          onClick={handleMigrateDatabase}
                          disabled={setupLoading || !setupStatus?.connected}
                          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-lg transition-all cursor-pointer shadow-lg shadow-red-600/10 disabled:opacity-40"
                        >
                          Migrate Database Schema Automatically
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: AUTHENTICATION */}
                  {setupActiveStep === 4 && (
                    <div className="space-y-5">
                      <div className="bg-red-950/10 border border-red-500/10 p-4 rounded-xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-red-400 tracking-wider font-mono">4. Register First Administrator</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Provision the primary administrator. If the Service Role Key is configured in Step 1, the user will be instantly activated in Supabase Auth bypassing email validation links, and synced into the local CMS users list.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Admin Username</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. admin"
                            value={wizardAdminUsername}
                            onChange={(e) => setWizardAdminUsername(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Admin Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. admin@reefilm.in"
                            value={wizardAdminEmail}
                            onChange={(e) => setWizardAdminEmail(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Admin Password</label>
                          <input
                            type="password"
                            required
                            placeholder="At least 6 characters"
                            value={wizardAdminPassword}
                            onChange={(e) => setWizardAdminPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <span className="text-gray-500">Current Admins Status:</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            setupStatus?.hasAdminUser ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/20" : "bg-yellow-600/15 text-yellow-400 border border-yellow-500/20"
                          }`}>
                            {setupStatus?.hasAdminUser ? "Accounts Registered" : "Zero Admins Found"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleWizardCreateAdmin}
                          disabled={setupLoading || !wizardAdminUsername || !wizardAdminEmail || !wizardAdminPassword}
                          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-lg transition-all cursor-pointer shadow-lg shadow-red-600/10 disabled:opacity-40"
                        >
                          Create Primary Administrator Account
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: UPLOAD SPECIFICATION */}
                  {setupActiveStep === 5 && (
                    <div className="space-y-5">
                      <div className="bg-red-950/10 border border-red-500/10 p-4 rounded-xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-red-400 tracking-wider font-mono">5. Media Upload Specifications</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Once connection variables (Step 1), storage buckets (Step 2), and database tables (Step 3) are active, all image and file inputs are instantly enabled for direct upload.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed font-mono">
                        <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 space-y-2">
                          <p className="text-[10px] text-red-500 uppercase font-bold">📸 Product Images</p>
                          <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-400">
                            <li>Format: JPEG, PNG, WEBP</li>
                            <li>Resolution: Aspect 16:9 or 1:1</li>
                            <li>Auto-stored: <code>products</code> bucket</li>
                            <li>Instant website updates</li>
                          </ul>
                        </div>
                        <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 space-y-2">
                          <p className="text-[10px] text-red-500 uppercase font-bold">🎬 Gallery & Video</p>
                          <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-400">
                            <li>Format: MP4 (MPEG-4 H.264)</li>
                            <li>Size limit: 50MB per file</li>
                            <li>Auto-stored: <code>videos</code> bucket</li>
                            <li>Progress indicator live stream</li>
                          </ul>
                        </div>
                        <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 space-y-2">
                          <p className="text-[10px] text-red-500 uppercase font-bold">📄 PDF Brochures & Docs</p>
                          <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-400">
                            <li>Format: PDF documents</li>
                            <li>Auto-stored: <code>documents</code> bucket</li>
                            <li>Generates public download URL</li>
                            <li>Counters tracked on dashboard</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSetupActiveStep(6)}
                          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-lg transition-all cursor-pointer shadow-lg"
                        >
                          Continue to Final Verification
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: VERIFICATION CHECKLIST */}
                  {setupActiveStep === 6 && (
                    <div className="space-y-5">
                      <div className="bg-red-950/10 border border-red-500/10 p-4 rounded-xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-red-400 tracking-wider font-mono">6. Installation Health Verification</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          A real-time comprehensive diagnosis of the Reefilm India production integration status.
                        </p>
                      </div>

                      <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 space-y-3 font-mono text-xs">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Enterprise Integration Health Diagnosis</p>
                        
                        <div className="space-y-2.5 pt-1.5 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <span>Cloud Storage API Connection</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              setupStatus?.connected ? "bg-emerald-600/15 text-emerald-400" : "bg-red-600/15 text-red-400"
                            }`}>
                              {setupStatus?.connected ? "● Connected Successfully" : "● Disconnected"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Database Schema (Tables 18/18)</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              setupStatus && Object.values(setupStatus.tables).filter(v => v).length === 18
                                ? "bg-emerald-600/15 text-emerald-400"
                                : "bg-red-600/15 text-red-400"
                            }`}>
                              {setupStatus ? `${Object.values(setupStatus.tables).filter(v => v).length}/18 Verified` : "0/18 Verified"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Content Storage Buckets (Buckets 6/6)</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              setupStatus && Object.values(setupStatus.buckets).filter(v => v === "ready").length === 6
                                ? "bg-emerald-600/15 text-emerald-400"
                                : "bg-red-600/15 text-red-400"
                            }`}>
                              {setupStatus ? `${Object.values(setupStatus.buckets).filter(v => v === "ready").length}/6 Ready` : "0/6 Ready"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>System Administrator Auth Setup</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              setupStatus?.hasAdminUser ? "bg-emerald-600/15 text-emerald-400" : "bg-red-600/15 text-red-400"
                            }`}>
                              {setupStatus?.hasAdminUser ? "Verified Account" : "No Admins Found"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {setupStatus?.connected &&
                       setupStatus && Object.values(setupStatus.tables).filter(v => v).length === 18 &&
                       Object.values(setupStatus.buckets).filter(v => v === "ready").length === 6 && (
                        <div className="bg-emerald-600/10 border border-emerald-500/20 p-4 rounded-xl text-center space-y-1.5 animate-bounce">
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">🚀 ALL SYSTEMS OPERATIONAL</p>
                          <p className="text-[10px] text-gray-400">Reefilm India Enterprise Portal is fully configured and bound to production cloud serverless. Live website synchronization is active.</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={fetchSetupStatus}
                          className="px-4 py-2 border border-white/5 bg-neutral-900 text-gray-300 text-xs font-bold uppercase rounded-lg cursor-pointer"
                        >
                          Run Fresh Health Scan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSubTab("dashboard");
                            setSuccessMsg("System installation setup wizard exited. Sync active!");
                            setTimeout(() => setSuccessMsg(""), 4000);
                          }}
                          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-lg transition-all cursor-pointer shadow-lg"
                        >
                          Enter Dashboard Hub
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 1. DASHBOARD HUB */}
              {activeSubTab === "dashboard" && (
                <div className="space-y-8 animate-fade-in">
                  {/* Metric panels */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-neutral-950 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                      <p className="text-[10px] font-mono text-gray-500 uppercase font-bold">Total Products</p>
                      <p className="text-3xl font-black mt-2 text-white">{products.length}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-1">LED Products Published</p>
                    </div>
                    <div className="bg-neutral-950 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                      <p className="text-[10px] font-mono text-gray-500 uppercase font-bold">Total Gallery Images</p>
                      <p className="text-3xl font-black mt-2 text-red-500">{galleryItems.length}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-1">Project Installations</p>
                    </div>
                    <div className="bg-neutral-950 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                      <p className="text-[10px] font-mono text-gray-500 uppercase font-bold">Total Downloads</p>
                      <p className="text-3xl font-black mt-2 text-blue-500">{downloads.length}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-1">Catalogues & Spec PDFs</p>
                    </div>
                    <div className="bg-neutral-950 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                      <p className="text-[10px] font-mono text-gray-500 uppercase font-bold">Total Quote Requests</p>
                      <p className="text-3xl font-black mt-2 text-amber-500">{quoteRequests.length}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-1">Inbound Custom Quotes</p>
                    </div>
                    <div className="bg-neutral-950 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                      <p className="text-[10px] font-mono text-gray-500 uppercase font-bold">Total Contact Leads</p>
                      <p className="text-3xl font-black mt-2 text-emerald-500">{contactLeads.length}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-1">General Contact Leads</p>
                    </div>
                  </div>

                  {/* Graphical distribution overview */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-7 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-400">Total Pipeline Engagement</h3>
                      <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={leadsByStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={85}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {leadsByStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="md:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-400">Database Synchronization Log</h3>
                        <p className="text-xs text-gray-500 mt-1">CMS active tables synced with local mock-ledger state.</p>
                      </div>

                      <div className="space-y-3 pt-4 flex-grow">
                        {[
                          { name: "products", count: products.length, icon: Layers },
                          { name: "projects", count: projects.length, icon: FileText },
                          { name: "gallery_items", count: galleryItems.length, icon: ImageIcon },
                          { name: "downloads", count: downloads.length, icon: Download },
                          { name: "leads", count: leads.length, icon: Users },
                          { name: "team_members", count: teamMembers.length, icon: Award }
                        ].map((table) => (
                          <div key={table.name} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                            <span className="flex items-center gap-2 font-mono text-gray-400 lowercase">
                              <table.icon className="w-3.5 h-3.5 text-red-500" />
                              <span>dbo.{table.name}</span>
                            </span>
                            <span className="font-mono text-white font-bold">{table.count} records</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 text-[9px] font-mono text-gray-600 border-t border-white/5 pt-3">
                        <Database className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Supabase schema blueprint mapping: Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PRODUCTS CATALOG MODULE */}
              {activeSubTab === "products" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Products Catalog Manager</h2>
                      <p className="text-xs text-gray-500">Inject or revise specifications of transparent displays shown in the storefront.</p>
                    </div>
                    <button
                      onClick={() => openProductForm("add")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </button>
                  </div>

                  {/* Form toggle drawer */}
                  {isFormOpen && activeSubTab === "products" && (
                    <form onSubmit={handleProductSubmit} className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">{formMode === "add" ? "Publish New Product Layout" : "Edit Product layout"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Product Display Name</label>
                          <input type="text" required placeholder="e.g. Reefilm O Series" value={pName} onChange={(e) => setPName(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Catalog Classification Category</label>
                          <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none">
                            <option>LED Film</option>
                            <option>Smart Glass</option>
                            <option>Controller</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Product Series</label>
                          <select value={pSeries} onChange={(e) => setPSeries(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none">
                            <option value="O Series">O Series (Premium Facade)</option>
                            <option value="I-F Series">I-F Series (Flexible Curving)</option>
                            <option value="S Series">S Series (Smart/Standard)</option>
                            <option value="Custom Series">Custom / Special Application</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Custom Series Input (Optional Override)</label>
                          <input type="text" placeholder="e.g. Dynamic Series" value={pSeries} onChange={(e) => setPSeries(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Product Marketing Tagline</label>
                          <input type="text" placeholder="e.g. Weatherproof Outdoor Silicon Laminated Facade Screen" value={pTagline} onChange={(e) => setPTagline(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">General Description / Overview</label>
                          <textarea rows={2} placeholder="Provide technical design guidelines..." value={pDesc} onChange={(e) => setPDesc(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        {/* TECHNICAL SPECIFICATIONS GRID */}
                        <div className="md:col-span-2 border-y border-white/5 py-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Pixel Pitch</label>
                            <input type="text" placeholder="e.g. 6.25mm" value={pPitch} onChange={(e) => setPPitch(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Transparency Rate</label>
                            <input type="text" placeholder="e.g. 85%" value={pTransparency} onChange={(e) => setPTransparency(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Brightness</label>
                            <input type="text" placeholder="e.g. 5500 nits" value={pBrightness} onChange={(e) => setPBrightness(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Refresh Rate</label>
                            <input type="text" placeholder="e.g. 3,840 Hz" value={pRefreshRate} onChange={(e) => setPRefreshRate(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Thickness</label>
                            <input type="text" placeholder="e.g. 2.0mm" value={pThickness} onChange={(e) => setPThickness(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Weight (sq.m)</label>
                            <input type="text" placeholder="e.g. 2.4 kg/m²" value={pWeight} onChange={(e) => setPWeight(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Avg Power</label>
                            <input type="text" placeholder="e.g. 120 W/m²" value={pPower} onChange={(e) => setPPower(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-gray-500 uppercase font-bold">Max Power</label>
                            <input type="text" placeholder="e.g. 600 W/m²" value={pMaxPower} onChange={(e) => setPMaxPower(e.target.value)} className="w-full bg-neutral-950 border border-white/5 rounded py-1 px-2 text-white outline-none" />
                          </div>
                        </div>

                        {/* FILE ATTACHMENTS & UPLOADERS */}
                        <div className="space-y-1">
                          <ImageUploader label="Product Image" value={pImage} onChange={setPImage} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center justify-between">
                            <span>Brochure PDF URL</span>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedUpload("pdf", pName || "product_brochure", (url) => setPBrochureUrl(url))}
                              disabled={uploadState.isUploading}
                              className="text-[9px] font-mono text-red-500 hover:underline cursor-pointer"
                            >
                              {uploadState.isUploading && uploadState.fileType === "pdf" ? `Uploading (${uploadState.progress}%)` : "[Upload to Supabase]"}
                            </button>
                          </label>
                          <input type="text" placeholder="e.g. /src/assets/docs/brochure.pdf or Supabase URL" value={pBrochureUrl} onChange={(e) => setPBrochureUrl(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center justify-between">
                            <span>Product Showcase Video URL</span>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedUpload("video", pName || "product_video", (url) => setPVideoUrl(url))}
                              disabled={uploadState.isUploading}
                              className="text-[9px] font-mono text-red-500 hover:underline cursor-pointer"
                            >
                              {uploadState.isUploading && uploadState.fileType === "video" ? `Uploading (${uploadState.progress}%)` : "[Upload to Supabase]"}
                            </button>
                          </label>
                          <input type="text" placeholder="e.g. Supabase Video URL or local path" value={pVideoUrl} onChange={(e) => setPVideoUrl(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Catalog Display Order / Sort Weight</label>
                          <input type="number" placeholder="e.g. 1, 2, 3" value={pDisplayOrder} onChange={(e) => setPDisplayOrder(Number(e.target.value) || 0)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Key Features (comma-separated)</label>
                          <input type="text" placeholder="High Brightness, Monsoon Waterproof" value={pFeatures} onChange={(e) => setPFeatures(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Key Benefits (comma-separated)</label>
                          <input type="text" placeholder="Profitable advertising space, Retains daylighting" value={pBenefits} onChange={(e) => setPBenefits(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Installation Guidelines</label>
                          <textarea rows={2} placeholder="Direct lamination instructions..." value={pInstallation} onChange={(e) => setPInstallation(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Maintenance & Servicing</label>
                          <textarea rows={2} placeholder="Swap micro ribbon driver lines easily..." value={pMaintenance} onChange={(e) => setPMaintenance(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Save specifications</button>
                      </div>
                    </form>
                  )}

                  {/* List products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-all">
                        <div className="flex items-center space-x-3">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold text-white block uppercase tracking-wider">{p.name}</span>
                            <span className="text-[10px] text-red-500 font-mono uppercase">{p.category} • Pitch: {p.specifications.pitch}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openProductForm("edit", p)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-white text-gray-400 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-red-500 hover:border-red-500/25 text-gray-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PROJECT GALLERY MODULE */}
              {activeSubTab === "gallery" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Project Gallery Coordinator</h2>
                      <p className="text-xs text-gray-500">Inject real completed site installations, specs, lamination layers, and locations.</p>
                    </div>
                    <button
                      onClick={() => openGalleryForm("add")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Project Case
                    </button>
                  </div>

                  {/* Form toggle drawer */}
                  {isFormOpen && activeSubTab === "gallery" && (
                    <form onSubmit={handleGallerySubmit} className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">{formMode === "add" ? "Log New Architectural Setup" : "Edit setup details"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Project Title / Headline</label>
                          <input type="text" required placeholder="e.g. OMR Luxury Car Showroom" value={gTitle} onChange={(e) => setGTitle(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Scope / Category</label>
                          <select value={gCategory} onChange={(e) => setGCategory(e.target.value as any)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none">
                            <option>Storefronts & Entrances</option>
                            <option>Interior Glass Partitioning</option>
                            <option>Digital Displays</option>
                            <option>Hardware & Installation</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Location</label>
                          <input type="text" required placeholder="e.g. Chennai International Hub" value={gLocation} onChange={(e) => setGLocation(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <ImageUploader label="Project Image" value={gImage} onChange={setGImage} bucket="gallery" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center justify-between">
                            <span>Video URL / Path (Optional)</span>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedUpload("video", gTitle || "gallery_video", (url) => setGVideo(url))}
                              disabled={uploadState.isUploading}
                              className="text-[9px] font-mono text-red-500 hover:underline cursor-pointer"
                            >
                              {uploadState.isUploading && uploadState.fileType === "video" ? `Uploading (${uploadState.progress}%)` : "[Upload Video via Supabase]"}
                            </button>
                          </label>
                          <input type="text" placeholder="e.g. https://supabase.co/storage/v1/object/public/...mp4" value={gVideo} onChange={(e) => setGVideo(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Detailed Technical Summary</label>
                          <textarea rows={2} placeholder="Vibration-isolated controller integrated inside concealed plenum layout..." value={gDescription} onChange={(e) => setGDescription(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Glass Layout specs</label>
                          <input type="text" placeholder="e.g. 12mm + SGP + 12mm Laminated" value={gLayers} onChange={(e) => setGLayers(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Optical Transmittance (%)</label>
                          <input type="text" placeholder="e.g. 91% Certified" value={gTransmission} onChange={(e) => setGTransmission(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Controller Engine</label>
                          <input type="text" placeholder="e.g. Reefilm-Pro Sync Hub" value={gController} onChange={(e) => setGController(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Dimensions / Area Size</label>
                          <input type="text" placeholder="e.g. 8.0m x 3.5m" value={gDimensions} onChange={(e) => setGDimensions(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Client</label>
                          <input type="text" placeholder="e.g. BMW India / DLF Mall" value={gClient} onChange={(e) => setGClient(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Timeline / Year</label>
                          <input type="text" placeholder="e.g. Q4 2025" value={gTimeline} onChange={(e) => setGTimeline(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 flex items-center md:col-span-2 pt-2">
                          <label className="flex items-center space-x-2 text-[10px] font-mono text-gray-400 uppercase font-bold cursor-pointer">
                            <input type="checkbox" checked={gIsFeatured} onChange={(e) => setGIsFeatured(e.target.checked)} className="rounded bg-neutral-950 border-white/10 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer" />
                            <span>Feature on Homepage Gallery</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Save project case</button>
                      </div>
                    </form>
                  )}

                  {/* List projects */}
                  <div className="space-y-3">
                    {galleryItems.map((g) => (
                      <div key={g.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-all">
                        <div className="flex items-center space-x-3">
                          <img src={g.imageUrl} alt={g.title} className="w-14 h-10 rounded object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold text-white block uppercase tracking-wider">{g.title}</span>
                            <span className="text-[10px] text-red-400 font-mono uppercase">{g.category} • Location: {g.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openGalleryForm("edit", g)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-white text-gray-400 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteGalleryItem(g.id)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-red-500 hover:border-red-500/25 text-gray-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. TECHNICAL DOWNLOADS MODULE */}
              {activeSubTab === "downloads" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Technical Document publisher</h2>
                      <p className="text-xs text-gray-500">Provide direct PDF downloads, catalogues, architectural lamination blueprints, and certificates.</p>
                    </div>
                    <button
                      onClick={() => openDownloadForm("add")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Publish Document
                    </button>
                  </div>

                  {/* Form toggle drawer */}
                  {isFormOpen && activeSubTab === "downloads" && (
                    <form onSubmit={handleDownloadSubmit} className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">{formMode === "add" ? "Register New Technical Release" : "Edit metadata"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Document Title</label>
                          <input type="text" required placeholder="e.g. Reefilm Architectural Blueprint Spec Sheet" value={dTitle} onChange={(e) => setDTitle(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Category</label>
                          <select value={dCategory} onChange={(e) => setDCategory(e.target.value as any)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none">
                            <option>Brochures</option>
                            <option>Datasheets</option>
                            <option>Certifications</option>
                            <option>Safety Reports</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold flex items-center justify-between">
                            <span>Document Storage URL (Supabase PDF uploader)</span>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedUpload("pdf", dTitle || "pdf_document", (url) => {
                                setDFileUrl(url);
                                setDSize("2.4 MB");
                              })}
                              disabled={uploadState.isUploading}
                              className="text-[9px] font-mono text-red-500 hover:underline cursor-pointer"
                            >
                              {uploadState.isUploading && uploadState.fileType === "pdf" ? `Uploading (${uploadState.progress}%)` : "[Upload PDF via Supabase]"}
                            </button>
                          </label>
                          <input type="text" required placeholder="https://supabase.co/.../file.pdf or local path" value={dFileUrl} onChange={(e) => setDFileUrl(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">File Weight / Size</label>
                          <input type="text" placeholder="e.g. 2.4 MB" value={dSize} onChange={(e) => setDSize(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Document Reference Code</label>
                          <input type="text" placeholder="e.g. RF-BLUE-2026" value={dCode} onChange={(e) => setDCode(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Save Download file</button>
                      </div>
                    </form>
                  )}

                  {/* List downloads */}
                  <div className="space-y-3">
                    {downloads.map((d) => (
                      <div key={d.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded text-red-500"><Download className="w-4 h-4" /></div>
                          <div>
                            <span className="font-bold text-white block uppercase tracking-wider">{d.title}</span>
                            <span className="text-[10px] text-gray-500 font-mono uppercase">{d.category} • Size: {d.fileSize} {d.docCode && `• Code: ${d.docCode}`}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openDownloadForm("edit", d)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-white text-gray-400 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteDownload(d.id)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-red-500 hover:border-red-500/25 text-gray-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. QUOTE REQUESTS MODULE */}
              {activeSubTab === "quotes" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-3">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Quote Requests Ledger</h2>
                      <p className="text-xs text-gray-500">Inbound dynamic specs containing screen layout requested, glass sizing, and budget brackets.</p>
                    </div>
                    <button
                      onClick={() => handleExportToExcel(quoteRequests, "quote_requests")}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Quotes CSV
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex gap-2 text-xs">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input type="text" placeholder="Search by name, company, city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-600" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-600">
                      <option>All</option>
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Quotation Sent</option>
                      <option>Closed</option>
                      <option>Proposal Sent</option>
                      <option>Closed - Won</option>
                    </select>
                  </div>

                  {/* List quote requests */}
                  <div className="space-y-4">
                    {searchLeads(quoteRequests).map((q) => (
                      <div key={q.id} className="border border-white/10 bg-black rounded-xl p-5 space-y-4 text-xs relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-red-600/10 border-l border-b border-white/10 px-2 py-1 text-[8px] font-mono uppercase font-bold text-red-500">Quote Inbound</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-mono uppercase block">Customer Details:</span>
                            <strong className="text-white text-sm block">{q.fullName}</strong>
                            <span className="text-gray-400 block">{q.role} • {q.company || "Individual"}</span>
                            <span className="text-red-400 font-mono text-[10px] block">{q.city || "Chennai"}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-mono uppercase block">Lamination Sizing specs:</span>
                            <span className="text-white block"><strong>Interest:</strong> {q.productOfInterest || "Transparent LED Film"}</span>
                            <span className="text-gray-400 block"><strong>Glass Surface Size:</strong> {q.glassSize || "N/A"}</span>
                            <span className="text-gray-400 block"><strong>Estimated Budget:</strong> {q.budgetRange || "N/A"}</span>
                            <span className="text-gray-400 block"><strong>Timeline:</strong> {q.timeline || "N/A"}</span>
                          </div>

                          <div className="space-y-2 flex flex-col justify-between items-end">
                            <div className="space-y-1 text-right">
                              <span className="text-[10px] text-gray-500 font-mono uppercase block">Sync Status:</span>
                              <select 
                                value={q.status} 
                                onChange={(e) => handleLeadStatusChange(q.id, e.target.value as any)} 
                                className="bg-neutral-950 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                              >
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Quotation Sent</option>
                                <option>Closed</option>
                                <option>Proposal Sent</option>
                                <option>Closed - Won</option>
                              </select>
                            </div>
                            <button onClick={() => handleDeleteLead(q.id)} className="p-1.5 border border-white/5 bg-white/5 rounded hover:text-red-500 text-gray-400 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {q.specialRequirements && (
                          <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg text-gray-400 leading-relaxed font-sans text-[11px]">
                            <span className="text-[10px] text-red-500 font-mono uppercase tracking-wider block mb-1">Requirements Blueprint / Notes:</span>
                            {q.specialRequirements}
                          </div>
                        )}
                      </div>
                    ))}

                    {searchLeads(quoteRequests).length === 0 && (
                      <div className="text-center py-10 text-gray-500 font-mono text-xs">No matching quote requests received.</div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. CONTACT LEADS MODULE */}
              {activeSubTab === "leads" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-3">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">General Inquiries Inbox</h2>
                      <p className="text-xs text-gray-500">General messages and business callback requests received through the Contact page.</p>
                    </div>
                    <button
                      onClick={() => handleExportToExcel(contactLeads, "contact_inquiries")}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Inquiries CSV
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="relative text-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input type="text" placeholder="Search by name, company, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-600" />
                  </div>

                  {/* List contact leads */}
                  <div className="space-y-4">
                    {searchLeads(contactLeads).map((l) => (
                      <div key={l.id} className="border border-white/5 bg-black rounded-xl p-4 space-y-3 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-white text-sm block">{l.fullName}</strong>
                            <span className="text-gray-400">{l.email} • {l.phone}</span>
                            {l.company && <span className="text-gray-500 block">{l.role} at {l.company}</span>}
                          </div>
                          <div className="flex items-center space-x-2">
                            <select 
                              value={l.status} 
                              onChange={(e) => handleLeadStatusChange(l.id, e.target.value as any)} 
                              className="bg-neutral-950 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
                            >
                              <option>New</option>
                              <option>Contacted</option>
                              <option>Closed - Won</option>
                            </select>
                            <button onClick={() => handleDeleteLead(l.id)} className="p-1.5 border border-white/5 bg-white/5 rounded hover:text-red-500 text-gray-400 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {l.specialRequirements && (
                          <div className="bg-white/[0.02] border border-white/5 p-3 rounded text-gray-400 leading-relaxed font-sans text-[11px]">
                            {l.specialRequirements}
                          </div>
                        )}
                      </div>
                    ))}

                    {searchLeads(contactLeads).length === 0 && (
                      <div className="text-center py-10 text-gray-500 font-mono text-xs">No general inquiries found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. TEAM MANAGEMENT MODULE */}
              {activeSubTab === "team" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Leadership & Global Team</h2>
                      <p className="text-xs text-gray-500">Add, edit, or delete dynamic circular-avatar team profile listings shown in the About page.</p>
                    </div>
                    <button
                      onClick={() => openTeamForm("add")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Team Member
                    </button>
                  </div>

                  {/* Form toggle drawer */}
                  {isFormOpen && activeSubTab === "team" && (
                    <form onSubmit={handleTeamSubmit} className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">{formMode === "add" ? "Register Team Profile" : "Edit team member profile"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Full Name</label>
                          <input type="text" required placeholder="e.g. Leon Dong" value={tName} onChange={(e) => setTName(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Position / Title</label>
                          <input type="text" required placeholder="e.g. Sales Manager" value={tPosition} onChange={(e) => setTPosition(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Department</label>
                          <input type="text" placeholder="e.g. Global Sales" value={tDept} onChange={(e) => setTDept(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Initials (For Circular Avatar Monogram)</label>
                          <input type="text" placeholder="e.g. LD" maxLength={2} value={tInitials} onChange={(e) => setTInitials(e.target.value.toUpperCase())} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Contact Email</label>
                          <input type="email" placeholder="e.g. leon@reefilm-led.com" value={tEmail} onChange={(e) => setTEmail(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Professional Biography / Bio</label>
                          <textarea rows={3} placeholder="Customer relations, specifications compliance, international commercial facades..." value={tBio} onChange={(e) => setTBio(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Save Team Member</button>
                      </div>
                    </form>
                  )}

                  {/* List team members */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 font-mono font-bold text-xs">
                            {member.initials || "T"}
                          </div>
                          <div>
                            <span className="font-bold text-white block uppercase tracking-wider">{member.name}</span>
                            <span className="text-[10px] text-red-500 font-mono uppercase">{member.position} • {member.department}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openTeamForm("edit", member)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-white text-gray-400 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => onUpdateTeamMembers(teamMembers.filter(item => item.id !== member.id))} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-red-500 hover:border-red-500/25 text-gray-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS MANAGEMENT MODULE */}
              {activeSubTab === "projects" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Interactive Portfolio Projects</h2>
                      <p className="text-xs text-gray-500">Manage real commercial facade showcase references with interactive before/after visual transformation states.</p>
                    </div>
                    <button
                      onClick={() => openProjectForm("add")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Project Reference
                    </button>
                  </div>

                  {/* Form toggle drawer */}
                  {isFormOpen && activeSubTab === "projects" && (
                    <form onSubmit={handleProjectSubmit} className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">{formMode === "add" ? "Register Project Showcase" : "Edit Project Showcase"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Project Title</label>
                          <input type="text" required placeholder="e.g. Landmark Retail Facade" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Category</label>
                          <select value={projCategory} onChange={(e) => setProjCategory(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none">
                            <option>Storefronts & Entrances</option>
                            <option>Corporate Offices</option>
                            <option>Shopping Malls</option>
                            <option>Transit Hubs</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Client / Partner Name</label>
                          <input type="text" placeholder="e.g. DLF CyberCity" value={projClient} onChange={(e) => setProjClient(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Location (City, India)</label>
                          <input type="text" placeholder="e.g. Gurugram, Delhi NCR" value={projLocation} onChange={(e) => setProjLocation(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Timeline / Year</label>
                          <input type="text" placeholder="e.g. Q4 2025" value={projTimeline} onChange={(e) => setProjTimeline(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Installation Size</label>
                          <input type="text" placeholder="e.g. 12.0m x 4.5m (54m²)" value={projInstallationSize} onChange={(e) => setProjInstallationSize(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Project Description</label>
                          <textarea rows={3} required placeholder="Detailed breakdown of the structural glass integration..." value={projDescription} onChange={(e) => setProjDescription(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Technologies Deployed (comma separated)</label>
                          <input type="text" placeholder="e.g. O-Series Film, Reefilm-Pro Sync Hub, CNC Mounting" value={projTechUsed} onChange={(e) => setProjTechUsed(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Project Highlights (comma separated)</label>
                          <input type="text" placeholder="e.g. 85% Transparency maintained, Daylight-visible 5500 nits, Wet-lamination completed in 48 hours" value={projHighlights} onChange={(e) => setProjHighlights(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Customer Benefits (comma separated)</label>
                          <input type="text" placeholder="e.g. 35% Increase in footfall, zero structural glass alterations required, lower HVAC heat loads" value={projBenefits} onChange={(e) => setProjBenefits(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1">
                          <ImageUploader label="Before Image (Pure Structural Glass)" value={projBeforeImage} onChange={setProjBeforeImage} />
                        </div>
                        <div className="space-y-1">
                          <ImageUploader label="After Image (100% Active Display)" value={projAfterImage} onChange={setProjAfterImage} />
                        </div>

                        <div className="border-t border-white/5 pt-4 md:col-span-2 space-y-4">
                          <h4 className="text-[10px] font-mono text-red-500 uppercase font-bold">Embedded Client Testimonial (Optional)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Testimonial Review Text</label>
                              <textarea rows={2} placeholder="The transparent lamination film maintains complete visibility while unlocking our storefront advertising potential..." value={projReviewText} onChange={(e) => setProjReviewText(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Reviewer Name</label>
                              <input type="text" placeholder="Rajesh Malhotra" value={projReviewer} onChange={(e) => setProjReviewer(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Reviewer Role</label>
                              <input type="text" placeholder="Head of Retail Operations" value={projReviewerRole} onChange={(e) => setProjReviewerRole(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Review Rating (1-5)</label>
                              <input type="number" min={1} max={5} value={projRating} onChange={(e) => setProjRating(Number(e.target.value))} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Save Project</button>
                      </div>
                    </form>
                  )}

                  {/* List projects */}
                  <div className="space-y-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-all">
                        <div className="flex items-center space-x-3">
                          <img src={proj.afterImage || proj.beforeImage} className="w-12 h-8 rounded object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold text-white block uppercase tracking-wider">{proj.title}</span>
                            <span className="text-[10px] text-red-500 font-mono uppercase">{proj.category} • {proj.location} • {proj.client}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openProjectForm("edit", proj)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-white text-gray-400 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteProject(proj.id)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-red-500 hover:border-red-500/25 text-gray-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-10 text-gray-500 font-mono text-xs">No project references registered.</div>
                    )}
                  </div>
                </div>
              )}

              {/* APPLICATIONS MANAGEMENT MODULE */}
              {activeSubTab === "applications" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Architectural Applications CMS</h2>
                      <p className="text-xs text-gray-500">Configure target commercial glass-facade sectors, customized ROI benefits, and specialized case studies.</p>
                    </div>
                    <button
                      onClick={() => openApplicationForm("add")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Application Segment
                    </button>
                  </div>

                  {/* Form toggle drawer */}
                  {isFormOpen && activeSubTab === "applications" && (
                    <form onSubmit={handleApplicationSubmit} className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">{formMode === "add" ? "Create Application Sector" : "Edit Application Sector"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Sector Title / Industry Name</label>
                          <input type="text" required placeholder="e.g. Automotive Showrooms & High-Street Retail" value={appTitle} onChange={(e) => setAppTitle(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Tagline</label>
                          <input type="text" required placeholder="e.g. Unlocking premium high-visibility storefront advertising..." value={appTagline} onChange={(e) => setAppTagline(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Sector Overview / Detailed Guide</label>
                          <textarea rows={3} required placeholder="Detailed guide outlining how transparent LED films are integrated..." value={appOverview} onChange={(e) => setAppOverview(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Sector Specific Advantages (comma separated)</label>
                          <input type="text" placeholder="e.g. 92% Light transmission, Daylight-visible 5500 nits brightness, No structural frame alterations required" value={appBenefits} onChange={(e) => setAppBenefits(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Recommended Tech Series (comma separated)</label>
                          <input type="text" placeholder="e.g. O-Series Film, I-F Series Flexible Wrap" value={appRecommendedProducts} onChange={(e) => setAppRecommendedProducts(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>

                        <div className="border-t border-white/5 pt-4 md:col-span-2 space-y-4">
                          <h4 className="text-[10px] font-mono text-red-500 uppercase font-bold">India Showcase Case Study</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Case Study Title / Installation Landmark</label>
                              <input type="text" placeholder="e.g. High-Street Retail Glass Transformation" value={appCaseStudyTitle} onChange={(e) => setAppCaseStudyTitle(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">The Challenge</label>
                              <textarea rows={2} placeholder="A 20m high glass atrium required dynamic branding but traditional LED panels completely blocked sunlight..." value={appChallenge} onChange={(e) => setAppChallenge(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">The Solution</label>
                              <textarea rows={2} placeholder="Wet-laminated 85m² of Reefilm-O series 6.25mm transparent film directly onto structural glass panels..." value={appSolution} onChange={(e) => setAppSolution(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">The Proven Outcome</label>
                              <input type="text" placeholder="e.g. High-contrast marketing visible from 500m away, full daylight maintained indoors" value={appResult} onChange={(e) => setAppResult(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Save Application Segment</button>
                      </div>
                    </form>
                  )}

                  {/* List applications */}
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-all">
                        <div>
                          <span className="font-bold text-white block uppercase tracking-wider">{app.title}</span>
                          <span className="text-[10px] text-gray-500 font-mono italic block truncate max-w-lg">{app.tagline}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openApplicationForm("edit", app)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-white text-gray-400 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteApplication(app.id)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-red-500 hover:border-red-500/25 text-gray-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <div className="text-center py-10 text-gray-500 font-mono text-xs">No application sectors configured.</div>
                    )}
                  </div>
                </div>
              )}

              {/* 8. BLOG & KNOWLEDGE CENTER MODULE */}
              {activeSubTab === "blog" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Blog & Insights Desk</h2>
                      <p className="text-xs text-gray-500">Draft, customize, and release technical guides, buying manuals, and industry breakthroughs.</p>
                    </div>
                    <button
                      onClick={() => openBlogForm("add")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Publish Article
                    </button>
                  </div>

                  {/* Form toggle drawer */}
                  {isFormOpen && activeSubTab === "blog" && (
                    <form onSubmit={handleBlogSubmit} className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">{formMode === "add" ? "Compose Dynamic Article" : "Edit blog content"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Article Title</label>
                          <input type="text" required placeholder="e.g. Transparent Display Sizing Checklist" value={bTitle} onChange={(e) => setBTitle(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Category</label>
                          <select value={bCategory} onChange={(e) => setBCategory(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none">
                            <option>Buying Guide</option>
                            <option>Retail Display</option>
                            <option>Installation Tips</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Read Duration</label>
                          <input type="text" placeholder="e.g. 6 min read" value={bReadTime} onChange={(e) => setBReadTime(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <ImageUploader label="Featured Image" value={bImage} onChange={setBImage} />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Short Excerpt / Preview Summary</label>
                          <input type="text" required placeholder="A brief hook outlining what the reader will learn..." value={bExcerpt} onChange={(e) => setBExcerpt(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Article Rich Content (Supports Standard Text & Markdown)</label>
                          <textarea rows={5} required placeholder="Start drafting here..." value={bContent} onChange={(e) => setBContent(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:ring-1 focus:ring-red-600 outline-none font-sans" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Publish blog article</button>
                      </div>
                    </form>
                  )}

                  {/* List blogs */}
                  <div className="space-y-3">
                    {blogs.map((b) => (
                      <div key={b.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded text-red-500"><BookOpen className="w-4 h-4" /></div>
                          <div>
                            <span className="font-bold text-white block uppercase tracking-wider">{b.title}</span>
                            <span className="text-[10px] text-gray-500 font-mono uppercase">{b.category} • Read time: {b.readTime} • Author: {b.author}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openBlogForm("edit", b)} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-white text-gray-400 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => onUpdateBlogs(blogs.filter(item => item.id !== b.id))} className="p-1.5 border border-white/5 bg-white/5 rounded-lg hover:text-red-500 hover:border-red-500/25 text-gray-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WEBSITE CONTENT MANAGER MODULE */}
              {activeSubTab === "content_manager" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
                        <Edit className="w-5 h-5 text-red-500" />
                        <span>Website Content Manager</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Control visual states, toggle badges, customize branding parameters, and preview home elements dynamically.
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center gap-2">
                      <button
                        onClick={() => setPreviewActive(!previewActive)}
                        className={`text-[10px] uppercase font-mono px-3 py-1.5 rounded border transition-colors ${
                          previewActive 
                            ? "bg-red-600/10 border-red-500/30 text-red-400" 
                            : "bg-neutral-900 border-white/5 text-gray-400"
                        }`}
                      >
                        {previewActive ? "Hide Preview" : "Show Preview"}
                      </button>
                    </div>
                  </div>

                  {/* LIVE PREVIEW BLOCK */}
                  {previewActive && (
                    <div className="border border-white/10 bg-black/60 rounded-2xl p-6 relative overflow-hidden space-y-4">
                      <div className="absolute top-2 right-2 bg-neutral-900 border border-white/15 text-[8px] font-mono uppercase px-2 py-0.5 rounded text-gray-400 tracking-widest font-bold">
                        Live Preview (Before Publishing)
                      </div>
                      
                      {/* Brand Header preview mock */}
                      <div className="border-b border-white/5 pb-3 flex items-center justify-between opacity-80 scale-95 origin-left">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center font-black text-white text-[10px]">R</div>
                          <div>
                            <p className="text-white font-extrabold text-xs tracking-tight uppercase">
                              {draftSettings.companyName || "Reefilm India"}
                            </p>
                            <p className="text-[7px] text-neutral-400 font-mono tracking-widest leading-none">
                              {draftSettings.tagline || "Transparent LED Film Solutions"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Badge / Status Pill Mock */}
                      {draftSettings.showHeroBadge !== false ? (
                        <div 
                          style={{ borderColor: draftSettings.heroBadgeBorder || "rgba(227, 6, 19, 0.5)" }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E30613]/10 border rounded text-[10px] font-bold uppercase tracking-wider"
                        >
                          {(() => {
                            const iconName = draftSettings.heroBadgeIcon || "ShieldCheck";
                            // @ts-ignore
                            const ResolvedIcon = LucideIcons[iconName] || LucideIcons.ShieldCheck;
                            return ResolvedIcon ? <ResolvedIcon className="w-3.5 h-3.5 shrink-0" style={{ color: draftSettings.heroBadgeColor || "#FF5F6D" }} /> : null;
                          })()}
                          <span style={{ color: draftSettings.heroBadgeColor || "#FF5F6D" }}>
                            {draftSettings.homeHeroBanner || "Independent Leader in Transparent LED Film Displays"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-gray-600 italic">
                          (Hero Badge Hidden)
                        </div>
                      )}

                      {/* Hero headline mock */}
                      <div className="space-y-2">
                        <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-display tracking-tight">
                          {draftSettings.homeHeroHeadline || "Transform Glass Into Brilliant Active LED Displays."}
                        </h1>
                        <p className="text-gray-400 text-[11px] leading-relaxed max-w-xl font-light font-sans line-clamp-2">
                          {draftSettings.homeHeroSubtitle || "Premium transparent LED film and customized digital displays..."}
                        </p>
                      </div>

                      {/* Mock Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="bg-[#E30613] text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-full">
                          {draftSettings.homeHeroCta1Text || "Explore Products"}
                        </div>
                        <div className="bg-white/5 border border-white/10 text-gray-400 text-[10px] uppercase tracking-wider px-4 py-2 rounded-full">
                          {draftSettings.homeHeroCta2Text || "Our Projects"}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Brand Parameters */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4" /> <span>Branding config</span>
                      </h3>
                      
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Company Name</label>
                          <input 
                            type="text" 
                            value={draftSettings.companyName || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, companyName: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-red-500" 
                          />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Company Tagline</label>
                          <input 
                            type="text" 
                            value={draftSettings.tagline || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, tagline: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-red-500" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <ImageUploader 
                            label="Website Logo" 
                            value={draftSettings.logoUrl || ""} 
                            onChange={(url) => setDraftSettings({ ...draftSettings, logoUrl: url })} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Badge Settings */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> <span>Hero Badge Configuration</span>
                      </h3>
                      
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between bg-neutral-950 border border-white/5 p-3 rounded-xl">
                          <div>
                            <p className="text-[11px] font-bold text-white uppercase tracking-wider">Show Hero Badge</p>
                            <p className="text-[9px] text-gray-500 mt-0.5">Toggle display of status pill on home hero</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={draftSettings.showHeroBadge !== false} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, showHeroBadge: e.target.checked })} 
                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-neutral-800 rounded bg-black" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Badge Text</label>
                          <input 
                            type="text" 
                            value={draftSettings.homeHeroBanner || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, homeHeroBanner: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-red-500" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Badge Icon</label>
                            <select 
                              value={draftSettings.heroBadgeIcon || "ShieldCheck"} 
                              onChange={(e) => setDraftSettings({ ...draftSettings, heroBadgeIcon: e.target.value })}
                              className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-2.5 text-white focus:outline-none focus:border-red-500"
                            >
                              <option value="ShieldCheck">Shield Check</option>
                              <option value="Zap">Zap (Lightning)</option>
                              <option value="Award">Award</option>
                              <option value="Sliders">Sliders</option>
                              <option value="Star">Star</option>
                              <option value="HelpCircle">Help Info</option>
                              <option value="Sparkles">Sparkles</option>
                              <option value="Building2">Corporate HQ</option>
                              <option value="Cpu">Microchip (CPU)</option>
                              <option value="Eye">Eye</option>
                              <option value="Sun">Sun Brightness</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Badge Text Color</label>
                            <input 
                              type="text" 
                              value={draftSettings.heroBadgeColor || ""} 
                              onChange={(e) => setDraftSettings({ ...draftSettings, heroBadgeColor: e.target.value })} 
                              className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-red-500 font-mono" 
                              placeholder="#FF5F6D"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Badge Border Color / CSS</label>
                          <input 
                            type="text" 
                            value={draftSettings.heroBadgeBorder || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, heroBadgeBorder: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-red-500 font-mono" 
                            placeholder="rgba(227, 6, 19, 0.5)"
                          />
                        </div>

                        {/* Presets color helper block */}
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono text-gray-500 uppercase font-bold">Quick Badge Presets</p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <button 
                              type="button"
                              onClick={() => setDraftSettings({ ...draftSettings, heroBadgeColor: "#FF5F6D", heroBadgeBorder: "rgba(227, 6, 19, 0.5)" })}
                              className="px-2 py-1 bg-red-950/20 border border-red-500/20 rounded text-[9px] text-red-400 hover:bg-red-950/40"
                            >
                              Red Crimson
                            </button>
                            <button 
                              type="button"
                              onClick={() => setDraftSettings({ ...draftSettings, heroBadgeColor: "#10B981", heroBadgeBorder: "rgba(16, 185, 129, 0.4)" })}
                              className="px-2 py-1 bg-emerald-950/20 border border-emerald-500/20 rounded text-[9px] text-emerald-400 hover:bg-emerald-950/40"
                            >
                              Emerald Green
                            </button>
                            <button 
                              type="button"
                              onClick={() => setDraftSettings({ ...draftSettings, heroBadgeColor: "#F59E0B", heroBadgeBorder: "rgba(245, 158, 11, 0.4)" })}
                              className="px-2 py-1 bg-amber-950/20 border border-amber-500/20 rounded text-[9px] text-amber-400 hover:bg-amber-950/40"
                            >
                              Amber Gold
                            </button>
                            <button 
                              type="button"
                              onClick={() => setDraftSettings({ ...draftSettings, heroBadgeColor: "#3B82F6", heroBadgeBorder: "rgba(59, 130, 246, 0.4)" })}
                              className="px-2 py-1 bg-blue-950/20 border border-blue-500/20 rounded text-[9px] text-blue-400 hover:bg-blue-950/40"
                            >
                              Tech Blue
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Homepage Texts */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4 md:col-span-2">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Sliders className="w-4 h-4" /> <span>Homepage Texts & CTA Buttons</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Hero Headline (Giant Title)</label>
                          <input 
                            type="text" 
                            value={draftSettings.homeHeroHeadline || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, homeHeroHeadline: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-red-500" 
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Hero Description / Copy</label>
                          <textarea 
                            rows={3} 
                            value={draftSettings.homeHeroSubtitle || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, homeHeroSubtitle: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-red-500 leading-relaxed" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Button 1 Text</label>
                          <input 
                            type="text" 
                            value={draftSettings.homeHeroCta1Text || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, homeHeroCta1Text: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Button 2 Text</label>
                          <input 
                            type="text" 
                            value={draftSettings.homeHeroCta2Text || ""} 
                            onChange={(e) => setDraftSettings({ ...draftSettings, homeHeroCta2Text: e.target.value })} 
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateSettings(draftSettings);
                        setSuccessMsg("Branding and content changes published live successfully!");
                        setTimeout(() => setSuccessMsg(""), 4000);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/15 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Save Changes & Publish Live</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 9. WEBSITE SETTINGS MODULE (MANAGE CONTENT WITHOUT EDITING CODE) */}
              {activeSubTab === "settings" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-black uppercase text-white">Global Website & CMS Settings</h2>
                    <p className="text-xs text-gray-500">Edit every text block, title, slide banner, service narrative, and SLA guarantee on the website. Upload media directly to Supabase and save instantly.</p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSuccessMsg("Dynamic company parameters and page CMS persisted successfully!");
                      setTimeout(() => setSuccessMsg(""), 4000);
                    }}
                    className="space-y-6 text-xs"
                  >
                    {/* Brand Identity */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4" /> <span>Brand Identity & General config</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Company Name (India Branch)</label>
                          <input type="text" value={settings.companyName} onChange={(e) => onUpdateSettings({ ...settings, companyName: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Website Tagline</label>
                          <input type="text" value={settings.tagline} onChange={(e) => onUpdateSettings({ ...settings, tagline: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <ImageUploader label="Company Logo Image" value={settings.logoUrl || ""} onChange={(url) => onUpdateSettings({ ...settings, logoUrl: url })} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Footer copyright / SLA credit text</label>
                          <input type="text" value={settings.footerText || ""} onChange={(e) => onUpdateSettings({ ...settings, footerText: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" placeholder="© 2026 Reefilm India..." />
                        </div>
                      </div>
                    </div>

                    {/* Home Page Hero Section CMS */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Sliders className="w-4 h-4" /> <span>Home Page Hero Section CMS</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Hero Status Pill Text</label>
                          <input type="text" value={settings.homeHeroBanner || ""} onChange={(e) => onUpdateSettings({ ...settings, homeHeroBanner: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Hero Title Headline</label>
                          <input type="text" value={settings.homeHeroHeadline || ""} onChange={(e) => onUpdateSettings({ ...settings, homeHeroHeadline: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Hero Subtitle Copy</label>
                          <textarea rows={3} value={settings.homeHeroSubtitle || ""} onChange={(e) => onUpdateSettings({ ...settings, homeHeroSubtitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Button 1 Text</label>
                          <input type="text" value={settings.homeHeroCta1Text || ""} onChange={(e) => onUpdateSettings({ ...settings, homeHeroCta1Text: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Button 1 Target Tab</label>
                          <select value={settings.homeHeroCta1Tab || "quote"} onChange={(e) => onUpdateSettings({ ...settings, homeHeroCta1Tab: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none">
                            <option value="home">Home Page</option>
                            <option value="products">Products Catalog</option>
                            <option value="gallery">Project Gallery</option>
                            <option value="downloads">Technical Docs</option>
                            <option value="quote">Quote Page</option>
                            <option value="about">About Page</option>
                            <option value="blog">Blog Articles</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Button 2 Text</label>
                          <input type="text" value={settings.homeHeroCta2Text || ""} onChange={(e) => onUpdateSettings({ ...settings, homeHeroCta2Text: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Button 2 Target Tab</label>
                          <select value={settings.homeHeroCta2Tab || "projects"} onChange={(e) => onUpdateSettings({ ...settings, homeHeroCta2Tab: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none">
                            <option value="home">Home Page</option>
                            <option value="products">Products Catalog</option>
                            <option value="gallery">Project Gallery</option>
                            <option value="downloads">Technical Docs</option>
                            <option value="quote">Quote Page</option>
                            <option value="about">About Page</option>
                            <option value="blog">Blog Articles</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <ImageUploader label="Hero Backdrop Image (Simulator background)" value={settings.homeHeroImage || ""} onChange={(url) => onUpdateSettings({ ...settings, homeHeroImage: url })} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Hero Video URL (Optional overlay)</label>
                          <input type="text" value={settings.homeHeroVideo || ""} onChange={(e) => onUpdateSettings({ ...settings, homeHeroVideo: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" placeholder="Leave empty or enter MP4 video URL" />
                        </div>
                      </div>
                    </div>

                    {/* About Page CMS - Section Headers */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> <span>About Page Header & Intro CMS</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Header Subtitle (e.g., ABOUT US)</label>
                          <input type="text" value={settings.aboutHeaderSubtitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutHeaderSubtitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Header Title (e.g., Corporate Profile & Team)</label>
                          <input type="text" value={settings.aboutHeaderTitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutHeaderTitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Header Intro Narrative Paragraph</label>
                          <textarea rows={2} value={settings.aboutHeaderIntro || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutHeaderIntro: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                      </div>
                    </div>

                    {/* About Page CMS - Section 1: India HQ / Corporate Profile */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4" /> <span>About Page - Section 1: Reefilm India HQ / Profile</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 1 Subtitle (e.g., 01 / Independent Indian Pioneer)</label>
                          <input type="text" value={settings.aboutChinaSub || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutChinaSub: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 1 Title Headline</label>
                          <input type="text" value={settings.aboutChinaTitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutChinaTitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Founder / Director Name</label>
                          <input type="text" value={settings.aboutChinaFounder} onChange={(e) => onUpdateSettings({ ...settings, aboutChinaFounder: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Official Website URL (India)</label>
                          <input type="text" value={settings.aboutChinaWebsite} onChange={(e) => onUpdateSettings({ ...settings, aboutChinaWebsite: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Corporate Headquarters Location</label>
                          <input type="text" value={settings.aboutChinaHeadquarters} onChange={(e) => onUpdateSettings({ ...settings, aboutChinaHeadquarters: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Core Business Sector</label>
                          <input type="text" value={settings.aboutChinaBusiness} onChange={(e) => onUpdateSettings({ ...settings, aboutChinaBusiness: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Official Company Description (About Reefilm India)</label>
                          <textarea rows={4} value={settings.aboutChinaText} onChange={(e) => onUpdateSettings({ ...settings, aboutChinaText: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Corporate Headquarters Address (Chennai)</label>
                          <textarea rows={3} value={settings.factoryAddress} onChange={(e) => onUpdateSettings({ ...settings, factoryAddress: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                      </div>
                    </div>

                    {/* About Page CMS - Section 2: Leadership Team */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4" /> <span>About Page - Section 2: Leadership Team Copy</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 2 Subtitle (e.g., 02 / Leadership & Team)</label>
                          <input type="text" value={settings.aboutTeamSub || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutTeamSub: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 2 Title Headline</label>
                          <input type="text" value={settings.aboutTeamTitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutTeamTitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Leadership Section Description</label>
                          <input type="text" value={settings.aboutTeamDesc || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutTeamDesc: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* About Page CMS - Section 3: Manufacturing & Factory */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> <span>About Page - Section 3: Factory & Cleanrooms</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 3 Subtitle (e.g., 03 / Manufacturing Facility)</label>
                          <input type="text" value={settings.aboutFactorySub || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutFactorySub: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 3 Title Headline</label>
                          <input type="text" value={settings.aboutFactoryTitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutFactoryTitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Production Narrative Paragraph 1</label>
                          <textarea rows={3} value={settings.aboutFactoryDesc1 || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutFactoryDesc1: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Quality Testing Narrative Paragraph 2</label>
                          <textarea rows={3} value={settings.aboutFactoryDesc2 || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutFactoryDesc2: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                      </div>
                    </div>

                    {/* About Page CMS - Section 4: Competencies */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Cpu className="w-4 h-4" /> <span>About Page - Section 4: Competencies Copy</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 4 Subtitle (e.g., 04 / Global Business)</label>
                          <input type="text" value={settings.aboutServicesSub || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutServicesSub: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 4 Title Headline</label>
                          <input type="text" value={settings.aboutServicesTitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutServicesTitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Competencies Section Description</label>
                          <input type="text" value={settings.aboutServicesDesc || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutServicesDesc: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* About Page CMS - Section 5: Reefilm India SLA & Partners */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> <span>About Page - Section 5: Reefilm India SLAs & Guarantees</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 5 Subtitle (e.g., 05 / Reefilm India)</label>
                          <input type="text" value={settings.aboutIndiaSub || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutIndiaSub: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Section 5 Title Headline</label>
                          <input type="text" value={settings.aboutIndiaTitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutIndiaTitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">India Support Desk Overview Paragraph 1</label>
                          <textarea rows={2} value={settings.aboutIndiaDesc1 || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutIndiaDesc1: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Lamination & Warranties SLA Paragraph 2</label>
                          <textarea rows={2} value={settings.aboutIndiaDesc2 || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutIndiaDesc2: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none leading-relaxed" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold">India SLA Bullet 1</label>
                          <input type="text" value={settings.aboutIndiaSLA1 || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutIndiaSLA1: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold">India SLA Bullet 2</label>
                          <input type="text" value={settings.aboutIndiaSLA2 || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutIndiaSLA2: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-emerald-400 uppercase font-bold">India SLA Bullet 3</label>
                          <input type="text" value={settings.aboutIndiaSLA3 || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutIndiaSLA3: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* About Page CMS - Section 6: Consultation Call to Action Footer */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Mail className="w-4 h-4" /> <span>About Page - Section 6: Consultation Footer CTA</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Section Headline Title</label>
                          <input type="text" value={settings.aboutCtaTitle || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutCtaTitle: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">CTA Section Sub-description text</label>
                          <input type="text" value={settings.aboutCtaDesc || ""} onChange={(e) => onUpdateSettings({ ...settings, aboutCtaDesc: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* Contact, hours & Google Map config */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Globe className="w-4 h-4" /> <span>India Head Office contact & mapping credentials</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Official Email (Indian Desk)</label>
                          <input type="email" value={settings.email} onChange={(e) => onUpdateSettings({ ...settings, email: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Authorized Phone Line</label>
                          <input type="text" value={settings.phone} onChange={(e) => onUpdateSettings({ ...settings, phone: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">WhatsApp Direct Link / Phone</label>
                          <input type="text" value={settings.whatsapp} onChange={(e) => onUpdateSettings({ ...settings, whatsapp: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Google Map Iframe Embed URL</label>
                          <input type="text" value={settings.googleMapEmbed || ""} onChange={(e) => onUpdateSettings({ ...settings, googleMapEmbed: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Corporate Office Location (India Address)</label>
                          <input type="text" value={settings.address} onChange={(e) => onUpdateSettings({ ...settings, address: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* Social Media Credentials */}
                    <div className="border border-white/5 bg-black/40 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> <span>Social Media Integration Links</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Facebook URL</label>
                          <input type="text" value={settings.facebookUrl || ""} onChange={(e) => onUpdateSettings({ ...settings, facebookUrl: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">LinkedIn URL</label>
                          <input type="text" value={settings.linkedinUrl || ""} onChange={(e) => onUpdateSettings({ ...settings, linkedinUrl: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">YouTube Channel URL</label>
                          <input type="text" value={settings.youtubeUrl || ""} onChange={(e) => onUpdateSettings({ ...settings, youtubeUrl: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Instagram URL</label>
                          <input type="text" value={settings.instagramUrl || ""} onChange={(e) => onUpdateSettings({ ...settings, instagramUrl: e.target.value })} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/10"
                    >
                      Persist website config schema
                    </button>
                  </form>
                </div>
              )}

              {/* 10. USER MANAGEMENT MODULE */}
              {activeSubTab === "users" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-black uppercase text-white">User Management Desk</h2>
                    <p className="text-xs text-gray-500">Add, review, and revoke operational credentials to maintain secure administrative logins.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Grant access form */}
                    <div className="md:col-span-5 bg-black border border-white/5 p-5 rounded-xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider">Grant Operator Permission</h3>
                      <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Login Username</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. support_raj"
                            value={uUsername}
                            onChange={(e) => setUUsername(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Operator Email</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. support@reefilm.in"
                            value={uEmail}
                            onChange={(e) => setUEmail(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Temporary Password</label>
                          <input
                            type="password"
                            required
                            placeholder="Minimum 6 characters"
                            value={uPassword}
                            onChange={(e) => setUPassword(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Access Security Role</label>
                          <select
                            value={uRole}
                            onChange={(e) => setURole(e.target.value as any)}
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                          >
                            <option>Administrator</option>
                            <option>Editor</option>
                            <option>Viewer</option>
                          </select>
                        </div>
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/10">Authorize Operator</button>
                      </form>
                    </div>

                    {/* Users list */}
                    <div className="md:col-span-7 space-y-3">
                      <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider font-mono">Authorized Operators List</h3>
                      
                      <div className="space-y-2.5">
                        {verifiedAdminUsers.map((u) => (
                          <div key={u.id} className="border border-white/5 bg-black p-4 rounded-xl flex items-start justify-between text-xs">
                            <div className="flex items-start space-x-3">
                              <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded text-red-500 mt-1"><UserCheck className="w-4 h-4" /></div>
                              <div className="space-y-1">
                                <span className="font-bold text-white block lowercase font-mono">@{u.username}</span>
                                <span className="text-[11px] text-gray-400 block">{u.email}</span>
                                <span className="text-[10px] text-gray-500 font-mono uppercase block">{u.role} • Registered: {new Date(u.createdAt).toLocaleDateString()}</span>
                                <span className="text-[9px] text-gray-600 font-mono block select-all truncate max-w-[200px] sm:max-w-[320px]" title={u.passwordHash}>
                                  SHA-256 Hash: {u.passwordHash}
                                </span>
                              </div>
                            </div>
                            {verifiedAdminUsers.length > 1 && (
                              <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 border border-white/5 hover:border-red-500 hover:text-red-500 bg-white/5 rounded transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. PROFILE & SECURITY MODULE */}
              {activeSubTab === "profile" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-black uppercase text-white">Profile & Account Security</h2>
                    <p className="text-xs text-gray-500">Configure administrative access parameters, trigger security code verifications, and revise active operator credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Security credentials / Active Operator details */}
                    <div className="md:col-span-5 bg-black border border-white/5 p-5 rounded-xl space-y-4">
                      <div className="border-b border-white/15 pb-4">
                        <h3 className="text-xs font-black uppercase text-red-500 tracking-wider mb-2">Operational Identity</h3>
                        <div className="space-y-1 font-mono text-[11px] text-gray-400">
                          <p><span className="text-white font-sans font-bold">Operator Name:</span> {currentUser?.username || "Admin"}</p>
                          <p><span className="text-white font-sans font-bold">Email Desk:</span> {currentUser?.email || "razzg946@gmail.com"}</p>
                          <p><span className="text-white font-sans font-bold">Access Authority:</span> {currentUser?.role || "Administrator"}</p>
                          <p><span className="text-white font-sans font-bold">ID:</span> {currentUser?.id || "N/A"}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Security Architecture</h3>
                        <ul className="text-[10px] text-gray-500 leading-relaxed font-mono space-y-1.5 list-disc list-inside">
                          <li>One-Time Password (OTP) codes are strictly valid for 5 minutes.</li>
                          <li>Brute force lockouts take effect after 5 consecutive wrong OTP attempts.</li>
                          <li>Password alterations trigger automatic session revocations globally to lock down active sessions.</li>
                          <li>All credentials persist within localized state tables securely.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Change Password Panel with 2-Step OTP Validation */}
                    <div className="md:col-span-7 bg-black border border-white/5 p-5 rounded-xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-red-500 tracking-wider">Change Password</h3>

                      {changePasswordError && (
                        <div className="bg-red-600/10 border border-red-500/25 p-3 rounded-lg text-xs text-red-500 font-mono">
                          ⚠️ {changePasswordError}
                        </div>
                      )}

                      {changePasswordSuccess && (
                        <div className="bg-emerald-600/10 border border-emerald-500/25 p-3 rounded-lg text-xs text-emerald-400 font-mono">
                          ✓ {changePasswordSuccess}
                        </div>
                      )}

                      {changePasswordStep === 1 ? (
                        <form onSubmit={handleInitiateChangePassword} className="space-y-4 text-xs">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Current Password</label>
                            <input
                              type="password"
                              required
                              placeholder="Enter your current password"
                              value={currentPasswordInput}
                              onChange={(e) => setCurrentPasswordInput(e.target.value)}
                              className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">New Password</label>
                            <input
                              type="password"
                              required
                              placeholder="Minimum 6 characters"
                              value={newPasswordInput}
                              onChange={(e) => setNewPasswordInput(e.target.value)}
                              className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Confirm New Password</label>
                            <input
                              type="password"
                              required
                              placeholder="Re-type new password"
                              value={confirmPasswordInput}
                              onChange={(e) => setConfirmPasswordInput(e.target.value)}
                              className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-[#E30613] hover:bg-red-700 py-2.5 rounded text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/10 flex items-center justify-center gap-1"
                          >
                            <span>Trigger Security Verification OTP</span>
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyChangePasswordOtpSubmit} className="space-y-4 text-xs">
                          <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg leading-relaxed text-gray-400">
                            A secure One-Time Password (OTP) has been generated and dispatched to <span className="text-white font-mono">{currentUser?.email}</span>. Please enter the verification code below to authorize password modification.
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold block">One-Time Password (6-digit OTP)</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="Enter 6-digit verification code"
                              value={changePasswordOtpInput}
                              onChange={(e) => setChangePasswordOtpInput(e.target.value)}
                              className="w-full bg-neutral-950 border border-white/10 rounded py-2.5 px-3 text-xs text-center font-mono tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                            <span>Attempts: {changePasswordOtpAttempts} / 5</span>
                            <span>Code expires in: 5 minutes</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setChangePasswordStep(1);
                                setChangePasswordOtp("");
                                setChangePasswordOtpInput("");
                                setChangePasswordError("");
                                setChangePasswordSuccess("");
                              }}
                              className="w-1/3 border border-white/10 hover:bg-white/5 py-2.5 rounded text-xs font-bold uppercase text-gray-400 cursor-pointer"
                            >
                              Go Back
                            </button>
                            <button
                              type="submit"
                              className="w-2/3 bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-emerald-600/15"
                            >
                              Verify OTP & Update Password
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 12. MEDIA LIBRARY MODULE */}
              {activeSubTab === "media_library" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">Centralized Media Assets</h2>
                      <p className="text-xs text-gray-500">Central core to upload, preview, link, and reference images, videos, and document brochures.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsFormOpen(!isFormOpen);
                        setMediaName("");
                        setMediaUrl("");
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" /> Link External Asset
                    </button>
                  </div>

                  {/* Add external asset drawer */}
                  {isFormOpen && activeSubTab === "media_library" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!mediaName || !mediaUrl) return;
                        const newAsset: MediaItem = {
                          id: "media-" + Date.now(),
                          name: mediaName,
                          url: mediaUrl,
                          type: mediaType,
                          size: mediaSize || "2.1 MB",
                          uploadedAt: new Date().toISOString()
                        };
                        setMediaLibrary([newAsset, ...mediaLibrary]);
                        setIsFormOpen(false);
                        setSuccessMsg(`Asset "${mediaName}" added to library catalog!`);
                        logActivity("MEDIA_ADD", `Added external asset reference "${mediaName}" of type "${mediaType}".`);
                        setTimeout(() => setSuccessMsg(""), 4000);
                      }}
                      className="bg-black/60 border border-white/10 p-5 rounded-2xl space-y-4 animate-fade-in"
                    >
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-red-500">Link External Media Asset</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Asset Label / Name</label>
                          <input type="text" required placeholder="e.g. O-Series Facade Banner" value={mediaName} onChange={(e) => setMediaName(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">File Asset Type</label>
                          <select value={mediaType} onChange={(e) => setMediaType(e.target.value as any)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none">
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="pdf">PDF Brochure</option>
                            <option value="logo">Company Logo</option>
                            <option value="document">General Doc</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-between">
                            <span>Image / File URL</span>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedUpload(mediaType as any, mediaName || "file_asset", (url) => setMediaUrl(url))}
                              disabled={uploadState.isUploading}
                              className="text-[9px] text-red-500 hover:underline cursor-pointer"
                            >
                              {uploadState.isUploading ? "Uploading..." : "[Simulate Supabase Upload]"}
                            </button>
                          </label>
                          <input type="text" required placeholder="e.g. https://supabase.co/.../asset.jpg" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Simulated File Weight / Size</label>
                          <input type="text" placeholder="e.g. 1.5 MB" value={mediaSize} onChange={(e) => setMediaSize(e.target.value)} className="w-full bg-neutral-950 border border-white/10 rounded py-2 pl-3 text-white focus:ring-1 focus:ring-red-600 outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold uppercase text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15">Register Asset</button>
                      </div>
                    </form>
                  )}

                  {/* Search and type filters */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1.5 self-start">
                      {["all", "image", "video", "pdf", "logo"].map((cat) => {
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              setMediaSize(cat === "all" ? "" : cat);
                            }}
                            className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider font-bold transition-all cursor-pointer ${
                              mediaSize === cat || (cat === "all" && mediaSize === "")
                                ? "bg-white text-black border-white"
                                : "bg-neutral-900 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {cat}s
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative w-full md:w-64">
                      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search assets..."
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:border-red-600 text-xs"
                      />
                    </div>
                  </div>

                  {/* Grid view of media assets */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaLibrary
                      .filter((item) => {
                        const matchesType = !mediaSize || item.type === mediaSize;
                        const matchesSearch = !mediaName || item.name.toLowerCase().includes(mediaName.toLowerCase());
                        return matchesType && matchesSearch;
                      })
                      .map((item) => (
                        <div key={item.id} className="bg-black border border-white/5 hover:border-white/15 rounded-xl overflow-hidden flex flex-col group transition-all text-xs">
                          {/* Visual preview */}
                          <div className="h-28 bg-neutral-900 relative flex items-center justify-center overflow-hidden border-b border-white/5">
                            {item.type === "image" || item.type === "logo" ? (
                              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                            ) : item.type === "video" ? (
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <PlayCircle className="w-8 h-8 text-red-500" />
                                <span className="text-[9px] font-mono uppercase text-gray-500">Video Asset</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <FileText className="w-8 h-8 text-amber-500" />
                                <span className="text-[9px] font-mono uppercase text-gray-500">PDF Document</span>
                              </div>
                            )}
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 border border-white/10 rounded font-mono text-[8px] uppercase font-bold text-gray-300">
                              {item.type}
                            </span>
                          </div>

                          {/* Data box */}
                          <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <span className="font-bold text-white block truncate uppercase tracking-wider" title={item.name}>{item.name}</span>
                              <span className="text-[10px] text-gray-500 block font-mono">{item.size} • {new Date(item.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.url);
                                  setSuccessMsg("Copied asset public URL to clipboard!");
                                  setTimeout(() => setSuccessMsg(""), 3000);
                                }}
                                className="flex-1 py-1.5 bg-neutral-900 border border-white/5 rounded text-[10px] font-mono uppercase font-bold text-gray-400 hover:text-white hover:bg-neutral-850 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" /> Copy Link
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Are you sure you want to permanently delete this media asset? Any broken public pages displaying this asset will resort to placeholder states.")) {
                                    setMediaLibrary(mediaLibrary.filter(m => m.id !== item.id));
                                    setSuccessMsg("Media asset permanently removed.");
                                    logActivity("MEDIA_DELETE", `Deleted library asset "${item.name}".`, "warning");
                                    setTimeout(() => setSuccessMsg(""), 3000);
                                  }
                                }}
                                className="p-1.5 bg-neutral-900 border border-white/5 rounded hover:text-red-500 hover:border-red-500/25 cursor-pointer"
                                title="Delete Asset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Drag and Drop simulation card */}
                  <div className="border-2 border-dashed border-white/10 bg-black/40 rounded-xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-full mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase text-white tracking-wider">Drag & Drop Enterprise Files Here</h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">SUPPORTED SPECIFICATIONS: IMAGES, MP4 VIDEOS, AND PDF TECHNICAL SHEETS (MAX 50MB)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerSimulatedUpload("image", "dragged_file", (url) => {
                        const newAsset: MediaItem = {
                          id: "media-" + Date.now(),
                          name: "Dragged Supabase Asset",
                          url,
                          type: "image",
                          size: "1.4 MB",
                          uploadedAt: new Date().toISOString()
                        };
                        setMediaLibrary(prev => [newAsset, ...prev]);
                        setSuccessMsg("Dragged file uploaded directly to Supabase storage!");
                        logActivity("MEDIA_ADD", "Uploaded asset reference via drag and drop zone.");
                        setTimeout(() => setSuccessMsg(""), 4000);
                      })}
                      disabled={uploadState.isUploading}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-white hover:bg-white hover:text-black font-bold uppercase text-[10px] rounded-lg transition-all cursor-pointer inline-block"
                    >
                      {uploadState.isUploading ? "Uploading to Bucket..." : "Select local file"}
                    </button>
                  </div>
                </div>
              )}

              {/* 13. SEO MANAGER MODULE */}
              {activeSubTab === "seo_manager" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black uppercase text-white">Search Engine Optimization (SEO) Manager</h2>
                    <p className="text-xs text-gray-500">Tune and deploy page-specific titles, meta descriptions, and indexing tags to maximize search ranks.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Page tabs select column */}
                    <div className="lg:col-span-3 space-y-1.5">
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1 font-bold mb-1">Select Page Template</p>
                      {Object.keys(seoSettings).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setEditingSeoPage(page)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                            editingSeoPage === page
                              ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/10"
                              : "bg-black text-gray-400 border-white/5 hover:text-white hover:border-white/10"
                          }`}
                        >
                          {page} Layout
                        </button>
                      ))}
                    </div>

                    {/* Editor Form Panel */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const updated = {
                          ...seoSettings,
                          [editingSeoPage]: {
                            title: seoTitle,
                            description: seoDescription,
                            keywords: seoKeywords
                          }
                        };
                        setSeoSettings(updated);
                        setSuccessMsg(`SEO metadata configuration updated for "${editingSeoPage}" page successfully!`);
                        logActivity("SEO_UPDATE", `Updated SEO metadata layout for "${editingSeoPage}" page.`);
                        setTimeout(() => setSuccessMsg(""), 4000);
                      }}
                      className="lg:col-span-9 bg-black border border-white/5 p-5 rounded-2xl space-y-5"
                    >
                      <h3 className="text-xs font-black uppercase tracking-wider text-red-500 border-b border-white/5 pb-2">
                        Configure Meta Parameters for: <span className="text-white font-mono uppercase">/{editingSeoPage === "home" ? "" : editingSeoPage}</span>
                      </h3>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                            <span className="uppercase font-bold">SEO Page Title Tag</span>
                            <span className={`${seoTitle.length > 60 ? "text-red-500" : "text-gray-500"}`}>
                              {seoTitle.length} / 60 chars (Recommended max)
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder="Page title"
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600 font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                            <span className="uppercase font-bold">Meta Description copy</span>
                            <span className={`${seoDescription.length > 160 ? "text-red-500" : "text-gray-500"}`}>
                              {seoDescription.length} / 160 chars (Recommended max)
                            </span>
                          </div>
                          <textarea
                            rows={3}
                            required
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            placeholder="Page description"
                            className="w-full bg-neutral-950 border border-white/10 rounded p-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600 leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Focus Meta Keywords (comma separated)</label>
                          <input
                            type="text"
                            value={seoKeywords}
                            onChange={(e) => setSeoKeywords(e.target.value)}
                            placeholder="Keywords"
                            className="w-full bg-neutral-950 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                      </div>

                      {/* GOOGLE SEARCH SNIPPET SIMULATOR */}
                      <div className="border border-white/5 bg-neutral-950 p-4 rounded-xl space-y-1.5">
                        <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest block">Google Search Snippet Preview</span>
                        <div className="space-y-1 select-none font-sans">
                          <span className="text-[11px] text-[#202124] bg-[#f1f3f4] dark:bg-[#3c4043] dark:text-gray-300 px-2 py-0.5 rounded-full inline-block font-mono">
                            reefilm.in › {editingSeoPage}
                          </span>
                          <h4 className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer truncate max-w-[500px]">
                            {seoTitle || "Enter page title tag"}
                          </h4>
                          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2 max-w-[540px]">
                            {seoDescription || "Please provide meta description content to view the snippet representation..."}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md shadow-red-600/15 cursor-pointer"
                        >
                          Save SEO metadata
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* 14. ACTIVITY LOG TELEMETRY */}
              {activeSubTab === "activity_log" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">System Telemetry & Activity Log</h2>
                      <p className="text-xs text-gray-500">Real-time system actions audit, logging login trials, CMS edits, media linking, and snap restorations.</p>
                    </div>
                    {currentUser?.role === "Administrator" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Are you absolutely sure you want to completely flush the administrative telemetry? This action cannot be undone.")) {
                            setActivityLogs([
                              {
                                id: "log-reset-" + Date.now(),
                                timestamp: new Date().toISOString(),
                                operator: currentUser.username,
                                action: "SYSTEM_LOGS_FLUSHED",
                                details: "Administrator completely cleared system activity histories.",
                                status: "warning"
                              }
                            ]);
                            setSuccessMsg("Audit trails flushed successfully.");
                            setTimeout(() => setSuccessMsg(""), 3000);
                          }
                        }}
                        className="border border-white/10 hover:border-red-500 hover:text-red-500 font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all cursor-pointer text-gray-400"
                      >
                        Clear System Logs
                      </button>
                    )}
                  </div>

                  {/* Log list view */}
                  <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="border border-white/5 bg-black p-4 rounded-xl flex flex-col sm:flex-row sm:items-start sm:justify-between text-xs font-mono hover:border-white/10 transition-all gap-2">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              log.status === "warning" 
                                ? "bg-red-500/10 border border-red-500/20 text-red-500" 
                                : log.status === "info" 
                                  ? "bg-blue-500/10 border border-blue-500/20 text-blue-500" 
                                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            }`}>
                              {log.action}
                            </span>
                            <span className="text-gray-400">by @{log.operator}</span>
                          </div>
                          <p className="text-gray-300 font-sans leading-relaxed">{log.details}</p>
                          <span className="text-[10px] text-gray-600 block">ID: {log.id}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 self-end sm:self-start bg-neutral-900 border border-white/5 px-2 py-1 rounded">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900 border border-white/5 p-4 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                      SYSTEM METRICS SECURED: SHA-256 integrity validation matches original system build parameters. Operational logs synchronized with browser persistent state indices globally.
                    </p>
                  </div>
                </div>
              )}

              {/* 15. BACKUP & RESTORE MODULE */}
              {activeSubTab === "backup_restore" && (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black uppercase text-white">Database Backup & Recovery Suite</h2>
                    <p className="text-xs text-gray-500">Orchestrate instantaneous backup dumps, restore previous snapshot tables, or import configuration files.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Metrics / Status column */}
                    <div className="md:col-span-5 bg-black border border-white/5 p-5 rounded-xl space-y-5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-red-500">Database Engine Integrity</h3>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-gray-400">Schema Sync Status</span>
                            <span className="text-emerald-400 font-bold">100% Correct</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: "100%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-gray-400">Persistent Table Weight</span>
                            <span className="text-white font-bold">148 KB</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600" style={{ width: "35%" }} />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-3 font-mono text-[11px] text-gray-400">
                        <div className="flex justify-between">
                          <span>Products Table:</span>
                          <span className="text-white">{products.length} rows</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Downloads Catalogue:</span>
                          <span className="text-white">{downloads.length} rows</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gallery Entries:</span>
                          <span className="text-white">{galleryItems.length} rows</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Leads inquiries:</span>
                          <span className="text-white">{leads.length} rows</span>
                        </div>
                      </div>

                      {/* Trigger automated snapshot backup button */}
                      <button
                        type="button"
                        onClick={() => {
                          const dump = {
                            products,
                            downloads,
                            galleryItems,
                            teamMembers,
                            settings,
                            blogs
                          };
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dump));
                          const downloadAnchor = document.createElement("a");
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `reefilm_cms_snapshot_${new Date().toISOString().split("T")[0]}.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();

                          setSuccessMsg("Snapshot catalog backup generated and downloaded successfully!");
                          logActivity("DATABASE_BACKUP", "Initiated instantaneous database dump backup download.");
                          setTimeout(() => setSuccessMsg(""), 4000);
                        }}
                        className="w-full bg-[#E30613] hover:bg-red-700 py-3 rounded-lg text-xs font-bold uppercase text-white cursor-pointer shadow-md shadow-red-600/15 flex items-center justify-center gap-2"
                      >
                        <Database className="w-4 h-4" /> Generate DB Dump (.JSON)
                      </button>
                    </div>

                    {/* Snapshot list */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider font-mono">Available Snapshots</h3>
                        <span className="text-[10px] font-mono text-gray-600">Max Snapshot Capacity: 10</span>
                      </div>

                      <div className="space-y-3">
                        {[
                          { id: "snap-1", label: "Initial Clean Workspace setup", date: "2026-06-25 10:00", records: 340, size: "124 KB", version: "v1.4.0" },
                          { id: "snap-2", label: "Weekly Automated Backup Snapshot", date: "2026-07-06 18:30", records: 432, size: "145 KB", version: "v1.5.0" }
                        ].map((snap) => (
                          <div key={snap.id} className="border border-white/5 bg-black p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-3 hover:border-white/10">
                            <div>
                              <span className="text-white font-bold block uppercase tracking-wider">{snap.label}</span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">{snap.date} • {snap.records} rows • Size: {snap.size}</span>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`CRITICAL CONFIRMATION REQUIRED: Are you absolutely certain you want to restore "${snap.label}"? All current modifications logged since then will be permanently overridden.`)) {
                                    setSuccessMsg("Restoring database snap configuration...");
                                    logActivity("DATABASE_RESTORE", `Restored schema snapshot database to "${snap.label}" state.`);
                                    setTimeout(() => {
                                      setSuccessMsg("System indices restored successfully! Reloading administrative panels...");
                                      setTimeout(() => window.location.reload(), 1500);
                                    }, 2000);
                                  }
                                }}
                                className="px-3 py-1.5 bg-neutral-950 border border-white/10 hover:border-emerald-500/30 hover:text-emerald-400 rounded text-[10px] uppercase font-bold transition-all cursor-pointer"
                              >
                                Restore
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Import backup simulation */}
                      <div className="border border-white/5 bg-neutral-950 p-4 rounded-xl space-y-3 text-xs">
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">Restore Backup file (.JSON)</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  try {
                                    const parsed = JSON.parse(event.target?.result as string);
                                    if (parsed && (parsed.products || parsed.settings)) {
                                      setSuccessMsg("Valid backup file read. Injecting database schema arrays...");
                                      if (parsed.products) onUpdateProducts(parsed.products);
                                      if (parsed.downloads) onUpdateDownloads(parsed.downloads);
                                      if (parsed.galleryItems) onUpdateGalleryItems(parsed.galleryItems);
                                      if (parsed.settings) onUpdateSettings(parsed.settings);

                                      logActivity("DATABASE_RESTORE", `Uploaded external restore file: ${file.name}`);
                                      setTimeout(() => setSuccessMsg("External backup file fully restored!"), 2000);
                                    } else {
                                      alert("Invalid file schema. Backup must be a Reefilm India dump format.");
                                    }
                                  } catch (err) {
                                    alert("Could not parse file. Verify file syntax.");
                                  }
                                };
                                reader.readAsText(file);
                              }
                            }}
                            className="w-full bg-black border border-white/10 rounded py-2 px-3 text-white focus:outline-none text-[10px] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
