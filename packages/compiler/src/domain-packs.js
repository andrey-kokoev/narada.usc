import saas from "../../domain-packs/saas/src/index.js";
import workflowAutomation from "../../domain-packs/workflow-automation/src/index.js";
import aiAgentOperation from "../../domain-packs/ai-agent-operation/src/index.js";
import dataPipeline from "../../domain-packs/data-pipeline/src/index.js";
import internalTools from "../../domain-packs/internal-tools/src/index.js";
import erp from "../../domain-packs/erp/src/index.js";
import helpdesk from "../../domain-packs/helpdesk/src/index.js";
import analyticsDashboard from "../../domain-packs/analytics-dashboard/src/index.js";
import billingSubscriptions from "../../domain-packs/billing-subscriptions/src/index.js";
import complianceSystem from "../../domain-packs/compliance-system/src/index.js";
import customerPortal from "../../domain-packs/customer-portal/src/index.js";
import integrationHub from "../../domain-packs/integration-hub/src/index.js";
import fieldService from "../../domain-packs/field-service/src/index.js";
import healthcareOps from "../../domain-packs/healthcare-ops/src/index.js";
import realEstate from "../../domain-packs/real-estate/src/index.js";
import projectManagement from "../../domain-packs/project-management/src/index.js";
import notificationsMessaging from "../../domain-packs/notifications-messaging/src/index.js";
import cmsPublishing from "../../domain-packs/cms-publishing/src/index.js";
import learningManagement from "../../domain-packs/learning-management/src/index.js";
import communityPlatform from "../../domain-packs/community-platform/src/index.js";
import procurement from "../../domain-packs/procurement/src/index.js";
import assetManagement from "../../domain-packs/asset-management/src/index.js";

export const domainPacks = [
  saas,
  workflowAutomation,
  aiAgentOperation,
  dataPipeline,
  internalTools,
  erp,
  helpdesk,
  analyticsDashboard,
  billingSubscriptions,
  complianceSystem,
  customerPortal,
  integrationHub,
  fieldService,
  healthcareOps,
  realEstate,
  projectManagement,
  notificationsMessaging,
  cmsPublishing,
  learningManagement,
  communityPlatform,
  procurement,
  assetManagement,
];

export function findPackById(id) {
  return domainPacks.find((p) => p.id === id) || null;
}

export function detectPack(intent) {
  let best = null;
  let bestScore = 0;
  for (const pack of domainPacks) {
    const result = pack.detect(intent);
    const score = typeof result === "number" ? result : result ? 1 : 0;
    if (score > bestScore) {
      bestScore = score;
      best = pack;
    }
  }
  return bestScore > 0 ? best : null;
}
