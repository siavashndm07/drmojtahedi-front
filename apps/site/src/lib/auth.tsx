"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  apiGetMe,
  apiPatchMe,
  apiSendOtp,
  apiVerifyOtp,
} from "@/lib/api/auth";
import { isApiEnabled } from "@/lib/api/config";

const STORAGE_TOKEN = "dm_authToken";
const STORAGE_REFRESH = "dm_refreshToken";
const STORAGE_PHONE = "dm_loggedInPhone";
const STORAGE_PROFILE = "dm_userProfile";

/** Demo OTP when SMS gateway / API is unavailable. */
export const DEMO_OTP = "123456";

export type MembershipStatus = "active" | "expired" | "pending";

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  education: string;
  description: string;
  howMet: string;
  membershipType: string;
  membershipNumber: string;
  membershipStatus: MembershipStatus;
  membershipValidUntil: string;
  annualFeeRials: number;
};

export type AuthUser = {
  phone: string;
} & UserProfile;

export type DonationRecord = {
  id: string;
  dateLabel: string;
  timeLabel: string;
  amountRials: number;
  transactionId: string;
  bankName: string;
  targets: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  accessToken: string | null;
  donations: DonationRecord[];
  login: (
    phone: string,
    tokens?: { access: string; refresh?: string },
    profile?: Partial<UserProfile>,
  ) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  addDonation: (donation: Omit<DonationRecord, "id">) => void;
};

const emptyProfile: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  nationalId: "",
  education: "",
  description: "",
  howMet: "",
  membershipType: "عضو وابسته",
  membershipNumber: "—",
  membershipStatus: "pending",
  membershipValidUntil: "—",
  annualFeeRials: 5_000_000,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readProfile(phone: string): UserProfile {
  try {
    const raw = localStorage.getItem(`${STORAGE_PROFILE}:${phone}`);
    if (!raw) return { ...emptyProfile };
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return { ...emptyProfile, ...parsed };
  } catch {
    return { ...emptyProfile };
  }
}

function writeProfile(phone: string, profile: UserProfile) {
  localStorage.setItem(`${STORAGE_PROFILE}:${phone}`, JSON.stringify(profile));
}

function readDonations(phone: string): DonationRecord[] {
  try {
    const raw = localStorage.getItem(`dm_donations:${phone}`);
    if (!raw) return [];
    return JSON.parse(raw) as DonationRecord[];
  } catch {
    return [];
  }
}

function writeDonations(phone: string, items: DonationRecord[]) {
  localStorage.setItem(`dm_donations:${phone}`, JSON.stringify(items));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = localStorage.getItem(STORAGE_TOKEN);
        const phone = localStorage.getItem(STORAGE_PHONE);
        if (!token || !phone) return;

        setDonations(readDonations(phone));

        if (isApiEnabled() && !token.startsWith("demo-")) {
          setAccessToken(token);
          try {
            const me = await apiGetMe(token);
            const profile: UserProfile = {
              ...emptyProfile,
              firstName: me.firstName ?? "",
              lastName: me.lastName ?? "",
              email: me.email ?? "",
              nationalId: me.nationalId ?? "",
              education: me.education ?? "",
              description: me.description ?? "",
              howMet: me.howMet ?? "",
              membershipType: me.membershipType ?? emptyProfile.membershipType,
              membershipNumber: me.membershipNumber ?? emptyProfile.membershipNumber,
              membershipStatus: me.membershipStatus ?? emptyProfile.membershipStatus,
              membershipValidUntil:
                me.membershipValidUntil ?? emptyProfile.membershipValidUntil,
              annualFeeRials: me.annualFeeRials ?? emptyProfile.annualFeeRials,
            };
            writeProfile(phone, profile);
            setUser({ phone, ...profile });
            return;
          } catch {
            localStorage.removeItem(STORAGE_TOKEN);
            localStorage.removeItem(STORAGE_REFRESH);
            localStorage.removeItem(STORAGE_PHONE);
            setAccessToken(null);
            return;
          }
        }

        setAccessToken(token);
        setUser({ phone, ...readProfile(phone) });
      } catch {
        /* ignore */
      } finally {
        setReady(true);
      }
    }

    void bootstrap();
  }, []);

  const login = useCallback(
    (
      phone: string,
      tokens?: { access: string; refresh?: string },
      profile?: Partial<UserProfile>,
    ) => {
      const stored = readProfile(phone);
      const nextProfile: UserProfile = {
        ...stored,
        ...profile,
        membershipNumber:
          profile?.membershipNumber ??
          stored.membershipNumber ??
          `DM-${phone.slice(-4)}`,
      };
      if (nextProfile.membershipNumber === "—") {
        nextProfile.membershipNumber = `DM-${phone.slice(-4)}`;
      }
      writeProfile(phone, nextProfile);

      if (tokens?.access) {
        localStorage.setItem(STORAGE_TOKEN, tokens.access);
        setAccessToken(tokens.access);
      } else {
        localStorage.setItem(STORAGE_TOKEN, `demo-${phone}`);
        setAccessToken(`demo-${phone}`);
      }

      if (tokens?.refresh) {
        localStorage.setItem(STORAGE_REFRESH, tokens.refresh);
      }

      localStorage.setItem(STORAGE_PHONE, phone);
      setDonations(readDonations(phone));
      setUser({ phone, ...nextProfile });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH);
    localStorage.removeItem(STORAGE_PHONE);
    setAccessToken(null);
    setUser(null);
    setDonations([]);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      let phone = "";
      let next: UserProfile = emptyProfile;

      setUser((current) => {
        if (!current) return current;
        phone = current.phone;
        next = { ...current, ...patch };
        writeProfile(current.phone, next);
        return { ...current, ...next };
      });

      if (!phone) return;

      if (isApiEnabled() && accessToken && !accessToken.startsWith("demo-")) {
        try {
          await apiPatchMe(accessToken, patch);
        } catch {
          /* keep local profile */
        }
      }
    },
    [accessToken],
  );

  const addDonation = useCallback((donation: Omit<DonationRecord, "id">) => {
    setUser((current) => {
      if (!current) return current;
      const next: DonationRecord = {
        ...donation,
        id: `don-${Date.now()}`,
      };
      setDonations((prev) => {
        const list = [next, ...prev];
        writeDonations(current.phone, list);
        return list;
      });
      return current;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      accessToken,
      donations,
      login,
      logout,
      updateProfile,
      addDonation,
    }),
    [user, ready, accessToken, donations, login, logout, updateProfile, addDonation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function isValidIranMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

export async function sendLoginOtp(phone: string): Promise<{
  success: boolean;
  message?: string;
}> {
  if (isApiEnabled()) {
    try {
      return await apiSendOtp(phone);
    } catch {
      /* fall through to demo OTP for front-only mode */
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!isValidIranMobile(phone)) {
    return { success: false, message: "لطفا شماره موبایل معتبر (با ۰۹) وارد کنید." };
  }
  return { success: true };
}

export async function verifyLoginOtp(
  phone: string,
  otp: string,
): Promise<{
  success: boolean;
  message?: string;
  access?: string;
  refresh?: string;
  user?: Partial<UserProfile>;
}> {
  if (isApiEnabled()) {
    try {
      const res = await apiVerifyOtp(phone, otp);
      if (!res.success) {
        return { success: false, message: res.message ?? "کد وارد شده نادرست است." };
      }
      return {
        success: true,
        access: res.access,
        refresh: res.refresh,
        user: res.user,
      };
    } catch {
      /* fall through to demo */
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!isValidIranMobile(phone)) {
    return { success: false, message: "شماره موبایل نامعتبر است." };
  }
  if (otp !== DEMO_OTP) {
    return { success: false, message: "کد وارد شده نادرست است." };
  }
  return { success: true };
}
