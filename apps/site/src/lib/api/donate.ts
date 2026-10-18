import { isApiEnabled } from "@/lib/api/config";
import { apiGet, apiPost } from "@/lib/api/client";

export type DonateGatewayOption = {
  id: string;
  label: string;
  sandbox?: boolean;
};

export type DonatePaymentMethod = {
  id: "online" | "card_to_card" | string;
  label: string;
  description?: string;
};

export type DonateGoalOption = {
  id: string;
  title: string;
  description?: string;
};

export type DonatePaymentOptions = {
  methods: DonatePaymentMethod[];
  gateways: DonateGatewayOption[];
  defaultGateway: string | null;
  cardToCard: {
    enabled: boolean;
    cardHolder: string;
    cardNumber: string;
  };
  minAmountRials: number;
  message: string;
  goals: DonateGoalOption[];
};

export type DonateStartPayload = {
  amount: number;
  method: string;
  gateway?: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string;
  goals: string[];
};

export type DonateStartResult = {
  donationId: number;
  method: string;
  status: string;
  gateway?: string;
  transactionId?: string;
  redirectUrl?: string | null;
  cardToCard?: {
    enabled: boolean;
    cardHolder: string;
    cardNumber: string;
  };
};

const EMPTY_OPTIONS: DonatePaymentOptions = {
  methods: [],
  gateways: [],
  defaultGateway: null,
  cardToCard: { enabled: false, cardHolder: "", cardNumber: "" },
  minAmountRials: 10_000,
  message: "",
  goals: [],
};

export async function getDonateHighlights(): Promise<{
  message: string;
  goals: DonateGoalOption[];
}> {
  if (!isApiEnabled()) return { message: "", goals: [] };
  try {
    const data = await apiGet<Partial<DonatePaymentOptions>>("/donate/payment-options/");
    return {
      message: data.message?.trim() ?? "",
      goals: data.goals ?? [],
    };
  } catch {
    return { message: "", goals: [] };
  }
}

export async function getDonatePaymentOptions(): Promise<DonatePaymentOptions> {
  if (!isApiEnabled()) return EMPTY_OPTIONS;
  const data = await apiGet<Partial<DonatePaymentOptions>>(
    "/donate/payment-options/",
    { scope: "public" },
  );
  return {
    ...EMPTY_OPTIONS,
    ...data,
    methods: data.methods ?? [],
    gateways: data.gateways ?? [],
    cardToCard: {
      ...EMPTY_OPTIONS.cardToCard,
      ...(data.cardToCard ?? {}),
    },
    goals: data.goals ?? [],
    message: data.message ?? "",
  };
}

export async function startDonatePayment(
  payload: DonateStartPayload,
): Promise<DonateStartResult> {
  return apiPost<DonateStartResult>("/donate/start/", payload, {
    scope: "public",
  });
}
