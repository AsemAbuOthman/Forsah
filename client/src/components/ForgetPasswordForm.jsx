import { useState } from "react";
import { Mail, Key, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "../src1/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DEFAULT_USER_ID } from "../src1/lib/constants";

const ForgotPasswordForm = () => {
const { toast } = useToast();
const navigate = useNavigate();

const [step, setStep] = useState(1);
const [email, setEmail] = useState("");
const [otp, setOtp] = useState("");
const [otpForCheck, setOtpForCheck] = useState("");
const [newPassword, setNewPassword] = useState("");
const [isSending, setIsSending] = useState(false);
const [error, setError] = useState("");

const sendOtp = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
    const res = await axios.post("/api/forget_password", { email });

    if (res.data.code) {
        toast({
        title: "OTP Sent",
        description: "Please check your email for the OTP.",
        });
        setOtpForCheck(res.data.code);
        setStep(2);
    }
    } catch (err) {
    console.error(err);
    setError("Failed to send OTP. Make sure the email is correct.");
    toast({
        title: "Error",
        description: "Failed to send OTP.",
        variant: "destructive",
    });
    } finally {
    setIsSending(false);
    }
};

const verifyOtp = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
    if (otp === otpForCheck) {
        toast({
        title: "OTP Verified",
        description: "You can now reset your password.",
        });
        setStep(3);
        return;
    } else {
        throw new Error("Invalid OTP");
    }
    } catch (err) {
    console.error(err);
    setError("Invalid or expired OTP.");
    toast({
        title: "Error",
        description: "Invalid or expired OTP.",
        variant: "destructive",
    });
    } finally {
    setIsSending(false);
    }
};

const resetPassword = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
    await axios.post(`/api/password/`, {
        email,
        new: newPassword,
    });
    toast({
        title: "Password Changed",
        description: "You can now log in with your new password.",
    });
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    } catch (err) {
    console.error(err);
    setError("Failed to reset password.");
    toast({
        title: "Error",
        description: "Could not reset password.",
        variant: "destructive",
    });
    } finally {
    setIsSending(false);
    }
};

const renderStep = () => {
    switch (step) {
    case 1:
        return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter your email address
            </label>
            <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                placeholder="you@example.com"
            />
            </div>
        </>
        );
    case 2:
        return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter the OTP sent to your email
            </label>
            <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                placeholder="Enter OTP"
            />
            </div>
        </>
        );
    case 3:
        return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter your new password
            </label>
            <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                placeholder="New Password"
            />
            </div>
        </>
        );
    default:
        return null;
    }
};

const handleSubmit = (e) => {
    if (step === 1) sendOtp(e);
    else if (step === 2) verifyOtp(e);
    else if (step === 3) resetPassword(e);
};

return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-100 to-indigo-50 px-4">
    <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-md flex flex-col gap-6"
    >
        <h2 className="text-xl font-bold text-center text-violet-600">
        {step === 1 && "Forgot Password"}
        {step === 2 && "Verify OTP"}
        {step === 3 && "Reset Password"}
        </h2>

        {renderStep()}
        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
        type="submit"
        disabled={isSending}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold text-lg transition hover:from-violet-700 hover:to-indigo-600 disabled:opacity-70"
        >
        {isSending ? (
            <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-5 w-5" />
            Processing...
            </span>
        ) : step === 1 ? (
            "Send OTP"
        ) : step === 2 ? (
            "Verify OTP"
        ) : (
            "Reset Password"
        )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
        Remember your password?{" "}
        <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-violet-600 hover:underline font-medium"
        >
            Log In
        </button>
        </p>
    </form>
    </div>
);
};

export default ForgotPasswordForm;
