<!-- Title: Lifecycle and support policy | Category: Models/Explore Foundry Models/Model versions and lifecycle/Lifecycle and support policy | URL: openai/concepts/model-retirements -->

---
layout: Conceptual
title: Foundry Models lifecycle and support policy - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements
breadcrumb_path: ../../../breadcrumb/azure-ai/toc.json
feedback_help_link_url: https://learn.microsoft.com/answers/tags/133/azure
feedback_help_link_type: get-help-at-qna
feedback_product_url: https://feedback.azure.com/d365community/forum/79b1327d-d925-ec11-b6e6-000d3a4f06a4
feedback_system: Standard
permissioned-type: public
recommendations: false
recommendation_types:
- Training
- Certification
uhfHeaderId: azure-ai-foundry
ms.suite: office
author: msakande
learn_banner_products:
- azure
manager: mcleans
ms.author: mopeakande
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn about the Microsoft Foundry Models lifecycle and support policy, including model deprecations and retirements. Explore how these changes affect your deployments.
ms.subservice: foundry-openai
ms.topic: concept-article
ms.date: 2026-07-24T00:00:00.0000000Z
ai-usage: ai-assisted
ms.custom:
- classic-and-new
ms.reviewer: josander
reviewer: johnrsanders
locale: en-us
document_id: f129f12e-7835-9024-2bf8-5a73cb01a8f8
document_version_independent_id: 7de38e3b-4c94-23e8-53b2-a2b53d5a9175
updated_at: 2026-07-24T23:55:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/openai/concepts/model-retirements.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/5a0469d96198a200349810e3202b9c48fa7dabe9/articles/foundry/openai/concepts/model-retirements.md
git_commit_id: 5a0469d96198a200349810e3202b9c48fa7dabe9
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 2377
asset_id: foundry/openai/concepts/model-retirements
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/openai/concepts/model-retirements.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/cbd33d8f-e9af-440e-8f1e-fc69e07b902b
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3820371b-086e-47fb-9d1f-b215f569127a
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
platformId: 9b5785a3-fd56-c4e1-467a-2ef2154c0190
---

# Foundry Models lifecycle and support policy - Microsoft Foundry | Microsoft Learn

Microsoft Foundry Models move through a predictable lifecycle—from preview to general availability (GA) to eventual retirement—giving you time to evaluate replacements and migrate workloads. This article explains each lifecycle stage, the overlap commitments Microsoft makes when a model retires, and how you're notified. For specific retirement dates, see [Model retirement schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule).

## How model lifecycle works

Microsoft Foundry continuously refreshes its model catalog with newer, more capable models. When a model is superseded, it moves through a predictable lifecycle that gives customers time to evaluate replacements and migrate. The lifecycle applies uniformly across Foundry Models [sold by Azure](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) and [from partners and community](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners), though notification timelines differ slightly by model origin.

### Lifecycle stages

Every model in the Foundry catalog belongs to exactly one of these five stages:

![Screenshot showing model lifecycle stage transitions.](https://learn.microsoft.com/en-us/azure/foundry/media/concepts/lifecycle-stage-transitions.png)

| Stage | What it means | Can create new deployments? | Existing deployments work? |
| --- | --- | --- | --- |
| **Preview** | Experimental. Weights, runtime, and API schema might change. Not guaranteed to become GA. Labeled "Preview" in the catalog. | Yes | Yes |
| **Generally Available (GA)** | Production-ready. Weights and APIs are fixed. Runtime patches for security vulnerabilities don't affect outputs. No label shown (default state). | Yes | Yes |
| **Legacy** | Newer, more capable models exist. You should plan on migrating workloads. This stage is **optional**—models might skip directly from GA to Deprecated. | Yes (until deprecation) | Yes |
| **Deprecated** | Existing customers can continue to create and manage deployments. No longer available to new customers—new customers can't create deployments or access the model. "Existing customer" is determined at the subscription level: whether that Azure subscription has ever deployed the specific model version. A new subscription under the same tenant doesn't inherit access. | - Existing customers: Yes. - New customers: **No** | Yes |
| **Retired** | Removed from service. All inference requests return `410 Gone`. | **No** | **No** |

Note

- **Fine-tuned models** follow a separate retirement schedule for training and deployment. See Fine-tuned models for details.
- Generally available models from Anthropic, DeepSeek, Fireworks, and Mistral AI follow a 12-month lifecycle instead of the standard 18-month lifecycle. For model-specific retirement dates, see the [Model retirement schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule).

## Model launch and availability

New models become available through deployment types in this order:

![Screenshot showing the order of deployment type availability for models.](https://learn.microsoft.com/en-us/azure/foundry/media/concepts/lifecycle-availability-rollout.png)

Note

Although all models launch with availablility through global standard deployment, they aren't guaranteed to be available for deployment through the other deployment types. For a full comparison of deployment types, see [Deployment type comparison](https://learn.microsoft.com/en-us/azure/foundry/../foundry-models/concepts/deployment-types).

| Order | Deployment type | When available |
| --- | --- | --- |
| 1 | **Global Standard** | At launch—broadest availability and lowest latency across regions |
| 2 | **Global Provisioned** | Follows closely after Global Standard—provides reserved throughput with global routing |
| 3 | **Data Zone Standard** and **Data Zone Provisioned** | After Global Provisioned—data processing stays within a defined geographic boundary |
| 4 | **Standard** and **Provisioned** | Last—regional-only, as older models retire and capacity is reallocated |

## Lifecycle and availability variations

Several factors affect how the standard lifecycle applies to your deployments, including the region you operate in, the cloud environment you use, and security requirements.

### Regional availability

- Not all model and version combinations are available in all regions.
- Typically, more specialized models—for example, audio, image, and video generation—are only available as Data Zone or Global deployment types.
- Successive model versions might not be available in the same regions. A newer version can appear in some regions before upgrades are scheduled in others.
- Microsoft can limit new customers in specific regions to maintain service quality for existing customers.

### Azure Government clouds

- Global Standard deployments aren't available in government clouds.
- Not all models or versions available in commercial clouds are available in government clouds.
- Government clouds typically support only one version of a given model at a time, with a **30-day overlap** when a new version becomes available.

For more information, see [Foundry Models sold by Azure (government)](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure-gov), [Model versions](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/model-versions-gov), and [Deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types-gov) in Azure Government.

### Security-driven retirements

If a model is found to have compliance or security issues, Microsoft reserves the right to invoke an **emergency retirement** with shortened notice. Refer to the Azure terms of service for details.

## Lifecycle timeline commitments

Microsoft makes specific commitments about how long model versions stay available and when replacements appear, so you can plan migrations with confidence.

### Generally Available (GA) replacement model overlap commitments

We commit to meaningful overlap between a retiring GA model and its replacement so customers can test, evaluate, and migrate with confidence.

![Screenshot of the general availability model lifecycle showing model overlap and replacement transition timeframes.](https://learn.microsoft.com/en-us/azure/foundry/media/concepts/general-availability-lifecycle-and-replacement-transition-timeframes.png)

| Phase | Pattern |
| --- | --- |
| **GA launch** | Each model launches per its own deployment type and region availability matrix. Retirement date (18 months out) is set programmatically and available via the [Models API](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/models). |
| **Deprecated (existing customers only)** | At 12 months from launch, existing customers can continue to create and manage deployments. New customers can't access the model. |
| **Replacement available in global standard** | Customers can use and test the replacement model in global standard approximately 90 days before retirement. |
| **Replacement available in provisioned regions** | Replacement model becomes available to test in provisioned regions where the predecessor is retiring approximately 30 days before retirement, giving provisioned customers a manual migration window. |
| **Model version retired** | At 18 months from launch, all inference returns `410 Gone`. |

Tip

**Why 90–120 days?** The official replacement model is selected and declared approximately 90–120 days before the retiring model's retirement date—not sooner. Given the rapid pace of improvement in generative AI, declaring a replacement too early risks directing customers to a model that is no longer the best available option by the time they need to migrate.

### Preview model lifecycle

Preview models have a fundamentally different lifecycle than GA models. They launch with a "not sooner than" retirement date (typically 90 days out), but are sometimes extended beyond that initial window, until a suitable replacement preview or GA model version is available. When a retirement decision is made, customers are **force-upgraded** to a replacement (a newer preview version or the GA model) or the model is **retired with no replacement**. There's no option to remain on a retiring preview model—all preview deployments are either upgraded or terminated.

Note

Preview models aren't recommended for production workloads.

![Screenshot of the preview lifecycle of models, showing model overlap and replacement transition timeframes.](https://learn.microsoft.com/en-us/azure/foundry/media/concepts/preview-lifecycle-and-replacement-transition-timeframes.png)

| Outcome | What happens |
| --- | --- |
| **Upgrade to newer Preview** | Existing preview deployments are force-upgraded to a newer preview version. Customers get at least **30 days notice**. The cycle repeats until a GA version is available. |
| **Upgrade to GA** | When the GA model launches, preview deployments are force-upgraded to the GA version. Customers get at least **30 days notice**. The GA model then follows the standard 18-month GA lifecycle. |
| **No replacement (rare)** | If no replacement exists, customers get **30 days notice** before the model retires and inference returns `410 Gone`. |

## Automatic upgrades

For **Global Standard**, **Data Zone Standard**, and **Standard** deployment types, Microsoft manages automatic upgrades when a model version is retired:

- Auto-upgrades are scheduled on a **rolling, region-by-region** basis.
- The upgrade schedule is published in advance in the [Model Retirement Schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule).
- Upgrades can occur even if the new model version isn't yet separately available in that region, or for that SKU—the upgrade process will make it available.

Important

**Provisioned deployments are NOT auto-upgraded.** Provisioned customers must manually migrate to the replacement model.

Use the [Models API](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/models) to programmatically check `lifecycleStatus`, `deprecation`, and per-SKU `deprecationDate` for any model at any time.

### Example: gpt-4o → gpt-5.1 upgrade

When gpt-4o version `2024-05-13` retires on **2026-10-01**, the service automatically upgrades it to gpt-5.1 on the Standard SKU in each region where that version is currently available. If gpt-5.1 doesn't yet have a Standard presence in one of those regions, the upgrade process adds it there. Check the [Model Retirement Schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule) for the current retirement date and replacement model before this upgrade occurs, since these details are subject to change.

## Migration to a replacement model

Don't wait for Microsoft to name an official replacement before you begin evaluating newer models. New models and model versions become available regularly, and the best option for your application might change as models with better quality, lower latency, or lower cost become available.

Microsoft selects the official replacement approximately 90–120 days before retirement. Waiting until closer to the retirement date allows the recommendation to reflect the strongest available option when customers need to migrate. The replacement listed in the [Model retirement schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule) is Microsoft's recommended migration target and, where supported, the model used for automatic upgrades at retirement. It doesn't limit your manual migration choices.

When you choose a target, evaluate candidate models against your own application, prompts, and representative data. Compare quality, latency, and cost together rather than relying on public benchmarks alone. Before you migrate, confirm API compatibility, feature support, deployment-type and regional availability, capacity, and quota.

For the full, phase-by-phase migration process, including how to prepare a test dataset, adapt prompts and schemas, validate quality, and roll out safely, see [Model migration process](https://learn.microsoft.com/en-us/azure/foundry/../foundry-models/concepts/model-migration).

## Notifications

GA models have their retirement date set programmatically at launch to 18 months out—there's no separate "announcement." Legacy and Deprecated transitions follow the published timeline and are visible in real time via the [Models API](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/models).

### When you receive active notifications

| Event | Timing | Applies to |
| --- | --- | --- |
| **GA model retirement notice** | At least **60 days** before retirement | All GA models. Sent to subscription owners with active deployments. |
| **Preview model retirement notice** | At least **30 days** before retirement | Preview models. Preview deployments can be auto-upgraded to the replacement if a replacement model is available and applicable (for example, doesn't require a different API contract). |

### How you're notified

| Channel | Details |
| --- | --- |
| **Email** | Sent automatically to subscription owners with active deployments. |
| **Azure Service Health** | Health advisories appear for affected subscriptions. Go to [Service Health &gt; Health advisories](https://portal.azure.com/#blade/Microsoft_Azure_Health/AzureHealthBrowseBlade/healthAdvisories), filter by `Azure OpenAI Service`, and create an alert rule for email, text messages, or webhook notifications. |

### Programmatic methods to check model lifecycle and deprecation

Customers can check lifecycle and deprecation fields on any model using the [Models API](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/models) (subscription-scoped, all models in a region):

```http
GET https://management.azure.com/subscriptions/{sub}/providers/Microsoft.CognitiveServices/locations/{location}/models?api-version=2024-10-01
```

Key fields: `lifecycleStatus`, `deprecation.inference`, `deprecation.fineTune`, per-SKU `deprecationDate` (ISO dates).

Important

**The API uses different terminology than the docs and portal.** The table below maps the customer-facing stage names used in this document and the Foundry portal to the corresponding API field values.

| Stage (docs and portal) | API status field (`lifecycleStatus`) | API date field (`deprecation.inference`) | What it means |
| --- | --- | --- | --- |
| **Preview** | `Preview` | Future date or not set | Experimental. May change or be removed. |
| **Generally Available** | `GenerallyAvailable` | Future date (set at launch) | Production-ready. Fixed weights and API. |
| **Deprecated** | `Deprecating` | Future date | Still serves inference. Blocked for new customers. |
| **Retired** | `Deprecated` | Past date | Fully retired. Inference returns `410 Gone`. |

For example, a model that the docs list as **"Deprecated"** (still works, blocked for new customers) appears in the API as `lifecycleStatus: "Deprecating"`—not `"Deprecated"`. The API value `"Deprecated"` means the model is **retired** and no longer serves inference.

To determine a model's stage programmatically, check both fields together:

```
if lifecycleStatus == "Deprecated"         → Retired (410 Gone)
if lifecycleStatus == "Deprecating"        → Deprecated (existing customers only)
if deprecation.inference < today           → Retired (regardless of lifecycleStatus lag)
if lifecycleStatus == "GenerallyAvailable" → GA
if lifecycleStatus == "Preview"            → Preview
```

## Fine-tuned models

Fine-tuned models retire in two phases: training and deployment.

Unless explicitly stated, training retires no earlier than the base model retirement date. After a model is retired for training, it's no longer available for fine-tuning but any previously trained models remain available for deployment.

At deployment retirement, inference and deployment return error responses.

| Model | Version | Training retirement date | Deployment retirement date |
| --- | --- | --- | --- |
| gpt-4o | 2024-08-06 | No earlier than 2027-04-01^1^ | 2027-10-01 |
| gpt-4o-mini | 2024-07-18 | No earlier than 2027-04-01^1^ | 2027-10-01 |
| gpt-4.1 | 2025-04-14 | No earlier than 2027-04-14^1^ | 2027-10-14 |
| gpt-4.1-mini | 2025-04-14 | No earlier than 2027-04-14^1^ | 2027-10-14 |
| gpt-4.1-nano | 2025-04-14 | No earlier than 2027-04-14^1^ | 2027-10-14 |
| o4-mini | 2025-04-16 | No earlier than 2027-04-16^1^ | 2027-10-16 |
|  |  |  |  |

^1^ For existing customers only. Otherwise, training retirement occurs at base model retirement.

## Frequently asked questions

| Question | Answer | Learn more |
| --- | --- | --- |
| **What's the difference between a model family, version, and variant?** | A *model family* is a generation of models (for example, GPT-4o, GPT-5). A *model version* is a dated release within a family (for example, gpt-4o 2024-05-13 vs. 2024-08-06). A *model variant* is a size/capability tier within the same family (for example, GPT-5, GPT-5-mini, GPT-5-nano). | [Model versions](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/model-versions) |
| **Can I control when my Standard deployment auto-upgrades?** | Yes. Set the `versionUpgradeOption` property on your deployment to one of three values: `OnceNewDefaultVersionAvailable` (upgrade when a new default is set), `OnceCurrentVersionExpired` (upgrade only at retirement), or `NoAutoUpgrade` (never auto-upgrade—deployment stops working at retirement). You can configure this setting via REST API, Azure PowerShell, or the Foundry portal. | [Working with models—upgrade configuration](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/working-with-models#model-deployment-upgrade-configuration) |
| **How do I migrate a Provisioned deployment?** | Provisioned deployments aren't auto-upgraded. You have two options: *In-place migration* (Azure handles traffic migration over a 20–30 minute window with no downtime) or *Side-by-side (multi-deployment) migration* (you create a new deployment, test, switch traffic, and delete the old one). | [Managing models on provisioned deployment types](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/working-with-models#managing-models-on-provisioned-deployment-types) |
| **Will my quota carry over to the replacement model?** | For Standard auto-upgrades, yes—quota is handled automatically. For Provisioned deployments, you must ensure quota is available for the target model before migrating. PTU capacity is model-agnostic and fungible across provisioned managed deployments. | [Provisioned throughput—quota](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput) |
| **Can I get an exception to extend a model's retirement date?** | No. Retirement dates aren't extendable. Plan your migration using the timelines published in the [Model Retirement Schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule) and the [Models API](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/models). | N/A |
| **What tools can help me evaluate a replacement model?** | Use the model leaderboard in the [Foundry portal](https://ai.azure.com/explore/models) to compare benchmarks, the model comparison feature when deploying, and [Evaluations](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements?tabs=text#preparation-for-model-retirements-and-version-upgrades) for custom workload testing. Apply prompt engineering and fine-tuning as needed to match prior accuracy. | [Preparation for model retirements](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements?tabs=text#preparation-for-model-retirements-and-version-upgrades) |
| **Do embeddings models follow the same lifecycle?** | Embeddings models (text-embedding-3-large, text-embedding-3-small, text-embedding-ada-002) have extended timelines and are handled differently from inference models. Check the [Model Retirement Schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule) for specific dates. | [Model retirement schedule](https://learn.microsoft.com/en-us/azure/foundry/model-retirement-schedule) |
| **How do Priority Processing and Batch deployments upgrade?** | Priority Processing follows the same upgrade process as Standard deployments (auto-upgrade supported). Batch deployments follow the side-by-side (multi-deployment) migration approach—deploy the new model, resubmit jobs, then retire the old deployment. | [Working with models](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/working-with-models) |
| **I can't find "Microsoft Foundry" in Azure Service Health—how do I set up alerts?** | Select `Azure OpenAI Service` as the service name when configuring Service Health alerts. There's no separate "Microsoft Foundry" service in Service Health. | [Set up Service Health alerts](https://learn.microsoft.com/en-us/azure/service-health/alerts-activity-log-service-notifications-portal) |