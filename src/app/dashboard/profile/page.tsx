"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Key, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileSkeleton } from "./components/profile-skeleton";

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'\-]+$/;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [revertingAvatar, setRevertingAvatar] = useState(false);

  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setEmail(user.email || "");

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) console.error("Failed to fetch profile:", error);

        if (profile) {
          const derivedFullName =
            profile.full_name ||
            [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
            user.user_metadata?.full_name ||
            "";
          setFullName(derivedFullName);
          setBio(profile.bio || "");
          setAvatarUrl(profile.avatar_url || user.user_metadata?.avatar_url || "");
        } else {
          setFullName(user.user_metadata?.full_name || "");
          setAvatarUrl(user.user_metadata?.avatar_url || "");
        }
      }
      setLoading(false);
    };

    fetchProfileData();
  }, []);

  const handleNameChange = (value: string) => {
    setFullName(value);
    if (value && !NAME_REGEX.test(value)) {
      setNameError("Name can only contain letters, spaces, hyphens, and apostrophes.");
    } else {
      setNameError("");
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", { description: "Please upload an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Profile picture must be under 5MB." });
      return;
    }

    setUploadingAvatar(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      toast.error("Upload failed", { description: uploadError.message });
      setUploadingAvatar(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);

    await Promise.all([
      supabase.from("profiles").upsert({ id: user.id, avatar_url: publicUrl }),
      supabase.auth.updateUser({ data: { avatar_url: publicUrl } }),
    ]);

    setAvatarUrl(publicUrl);
    setUploadingAvatar(false);
    toast.success("Profile picture updated", {
      style: { background: "#050505", border: "1px solid rgba(0,243,141,0.2)", color: "white" },
    });
    e.target.value = "";
  };

  const handleRevertAvatar = async () => {
    if (!user) return;
    setRevertingAvatar(true);
    const supabase = createClient();

    const { data: files } = await supabase.storage.from("avatars").list(user.id);
    if (files && files.length > 0) {
      await supabase.storage.from("avatars").remove(files.map(f => `${user.id}/${f.name}`));
    }

    await Promise.all([
      supabase.from("profiles").upsert({ id: user.id, avatar_url: null }),
      supabase.auth.updateUser({ data: { avatar_url: null } }),
    ]);

    setAvatarUrl("");
    setRevertingAvatar(false);
    toast.success("Profile picture removed", {
      style: { background: "#050505", border: "1px solid rgba(0,243,141,0.2)", color: "white" },
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.error("Name required", { description: "Full name cannot be empty." });
      return;
    }
    if (nameError) {
      toast.error("Invalid name", { description: nameError });
      return;
    }

    setSaving(true);
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim(),
      first_name: firstName,
      last_name: lastName,
      bio: bio.trim(),
    });

    if (error) {
      toast.error("Failed to update profile", {
        description: "Something went wrong. Please try again.",
        style: { background: "#050505", border: "1px solid rgba(255,0,0,0.2)", color: "white" },
      });
      setSaving(false);
      return;
    }

    await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });

    setSaving(false);
    toast.success("Profile updated", {
      description: "Your changes have been saved.",
      style: { background: "#050505", border: "1px solid rgba(0,243,141,0.2)", color: "white" },
    });
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Error", { description: "You must provide both your current and new password." });
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Error", { description: "New password must be at least 8 characters long." });
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("Error", { description: "New password must be different from your current password." });
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    });

    if (error) {
      toast.error("Failed to update password", {
        description: "Please check your current password and try again.",
        style: { background: "#050505", border: "1px solid rgba(255,0,0,0.2)", color: "white" },
      });
      return;
    }

    toast.success("Password Updated", { description: "Your password has been securely changed." });
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you absolutely sure you want to permanently delete your account?");
    if (!confirmDelete) return;

    const supabase = createClient();
    const { error } = await supabase.rpc("delete_user");

    if (error) {
      toast.error("Failed to delete account", {
        description: "Account deletion is not currently available. Please contact support for assistance.",
        style: { background: "#050505", border: "1px solid rgba(255,0,0,0.2)", color: "white" },
      });
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <ProfileSkeleton />;

  const initials = fullName
    ? fullName.trim().split(" ").filter(n => n.length > 0).map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-500 w-full max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Profile & Identity</h2>
        <p className="text-muted-foreground text-sm">Manage your personal settings and customize your Fluentia AI coaching experience.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription className="text-zinc-400">Update your basic profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="w-24 h-24 border-2 border-white/10 group-hover:border-[#00F38D] transition-colors">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="bg-[#050505] text-xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10">
                      {uploadingAvatar ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-white mb-1" />
                          <span className="text-[10px] uppercase tracking-wider font-bold text-white">Change</span>
                        </>
                      )}
                    </div>
                  </div>
                  {avatarUrl && (
                    <button
                      onClick={handleRevertAvatar}
                      disabled={revertingAvatar}
                      className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider disabled:opacity-50"
                    >
                      {revertingAvatar ? "Removing..." : "Remove photo"}
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{fullName || "Guest User"}</h3>
                  <p className="text-sm text-zinc-400">{email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-zinc-400">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`bg-[#050505] border-white/10 focus-visible:border-[#00F38D] focus-visible:ring-[#00F38D]/20 text-white ${nameError ? "border-red-500/60" : ""}`}
                  />
                  {nameError && <p className="text-[11px] text-red-400 mt-1">{nameError}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-[#050505] border-white/5 opacity-50 cursor-not-allowed text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-zinc-400">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell your AI coach a bit about your professional background..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-[#050505] border-white/10 focus-visible:border-[#00F38D] focus-visible:ring-[#00F38D]/20 text-white min-h-25 resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 bg-[#0A0A0A] p-4 flex justify-end rounded-b-xl">
              <Button
                onClick={handleSaveProfile}
                disabled={saving || !!nameError}
                className="bg-[#00F38D] text-black hover:bg-[#00F38D]/90 font-bold gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#111] border-red-500/20 text-white shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">Security & Data</CardTitle>
              <CardDescription className="text-zinc-400">Manage your account security and data retention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-zinc-400">Password</Label>
                {!isChangingPassword ? (
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    variant="outline"
                    className="w-full border-white/10 bg-[#050505] hover:bg-white/5 text-white justify-start gap-3"
                  >
                    <Key className="w-4 h-4 text-zinc-400" />
                    Change Password
                  </Button>
                ) : (
                  <div className="bg-[#050505] p-4 rounded-md border border-white/10 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-400">Current Password</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-[#111] border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-400">New Password</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-[#111] border-white/10 text-white"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-white"
                        onClick={() => setIsChangingPassword(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdatePassword}
                        className="bg-[#00F38D] text-black hover:bg-[#00F38D]/90"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 mt-4 border-t border-white/5">
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="w-full border-red-500/30 bg-red-500/5 hover:bg-red-500/20 hover:text-red-500 text-red-500/80 justify-start gap-3 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
                <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                  Permanently delete your account and all associated communication data, session history, and metrics from Fluentia servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
