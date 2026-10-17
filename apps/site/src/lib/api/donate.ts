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
};

export async function getDonatePaymentOptions(): Promise<DonatePaymentOptions> {
  if (!isApiEnabled()) return EMPTY_OPTIONS;
  return apiGet<DonatePaymentOptions>("/donate/payment-options/", {
    scope: "public",
  });
}

export async function startDonatePayment(
  payload: DonateStartPayload,
): Promise<DonateStartResult> {
  return apiPost<DonateStartResult>("/donate/start/", payload, {
    scope: "public",
  });
}
