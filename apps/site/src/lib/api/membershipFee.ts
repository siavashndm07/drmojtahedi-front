import { apiGet, apiPost } from "@/lib/api/client";
import { isApiEnabled } from "@/lib/api/config";

export type MembershipFeePayment = {
  id: number;
  amount: number;
  method: string;
  gateway?: string;
  gatewayLabel?: string;
  tierTitle?: string;
  tier_title?: string;
  status: string;
  transactionId?: string;
  transaction_id?: string;
  periodYear?: number | null;
  period_year?: number | null;
  createdAt?: string;
  created_at?: string;
};

export type MembershipFeeStartResult = {
  paymentId: number;
  method: string;
  status: string;
  gateway?: string;
  transactionId?: string;
  amount?: number;
  redirectUrl?: string | null;
  cardToCard?: {
    enabled: boolean;
    cardHolder: string;
    cardNumber: string;
  };
};

export async function listMyMembershipFees(
  token: string,
): Promise<MembershipFeePayment[]> {
  if (!isApiEnabled()) return [];
  return apiGet<MembershipFeePayment[]>("/membership-fee/payments/", {
    token,
    scope: "public",
  });
}

export async function startMembershipFeePayment(
  token: string,
  payload: { method: string; gateway?: string | null },
): Promise<MembershipFeeStartResult> {
  return apiPost<MembershipFeeStartResult>("/membership-fee/start/", payload, {
    token,
    scope: "public",
  });
}
