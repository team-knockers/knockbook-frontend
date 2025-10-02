import { PrivacyPolicy, TermsOfService } from "../../features/customer/resources/policy.doc";

export async function policyLoader() {
  return {
    tos: TermsOfService,
    privacy: PrivacyPolicy,
  };
}
