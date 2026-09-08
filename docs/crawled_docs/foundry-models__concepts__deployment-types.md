<!-- Title: Deployment types | Category: Models/Offers, deployment types, and pricing/Deployment types | URL: foundry-models/concepts/deployment-types -->

---
layout: Conceptual
title: Understanding deployment types in Microsoft Foundry Models - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types
breadcrumb_path: ../../../breadcrumb/azure-ai/toc.json
feedback_help_link_url: https://learn.microsoft.com/answers/tags/133/azure
feedback_help_link_type: get-help-at-qna
feedback_product_url: https://feedback.azure.com/d365community/forum/79b1327d-d925-ec11-b6e6-000d3a4f06a4
feedback_system: Standard
permissioned-type: public
recommendations: true
recommendation_types:
- Training
- Certification
uhfHeaderId: azure-ai-foundry
ms.suite: office
author: alvinashcraft
learn_banner_products:
- azure
manager: mcleans
ms.author: aashcraft
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Compare Microsoft Foundry deployment types including Global Standard, Provisioned, DataZone, and Batch. Learn about data residency, pricing, and when to use each type.
ai-usage: ai-assisted
ms.subservice: foundry-models
ms.topic: concept-article
ms.date: 2026-08-06T00:00:00.0000000Z
ms.custom:
- ignite-2024, github-universe-2024, pilot-ai-workflow-jan-2026
- classic-and-new
- doc-kit-assisted
locale: en-us
document_id: e14c1bd4-5aae-cf8b-9369-c866eabbc98e
document_version_independent_id: f89cc595-4109-824a-7bf6-91675a3cf639
updated_at: 2026-08-12T22:14:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/foundry-models/concepts/deployment-types.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/32726378f9adc67a78fef2187aa9197cdfea657a/articles/foundry/foundry-models/concepts/deployment-types.md
git_commit_id: 32726378f9adc67a78fef2187aa9197cdfea657a
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 2057
asset_id: foundry/foundry-models/concepts/deployment-types
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/foundry-models/concepts/deployment-types.md
cmProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://authoring-docs-microsoft.poolparty.biz/devrel/86a4b315-a9f1-4577-b985-6fb0e0e67420
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
spProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://authoring-docs-microsoft.poolparty.biz/devrel/96ac410d-d052-4707-8007-df31dd0fe041
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
platformId: 5428ee2e-73b6-f3cf-5ea6-404aea590b01
---

# Understanding deployment types in Microsoft Foundry Models - Microsoft Foundry | Microsoft Learn

When you deploy a model in Microsoft Foundry, you choose a deployment type that determines:

- **Where your data is processed** (global, data zone, or Azure geography)
- **How you pay** (pay-per-token or reserved capacity)
- **Performance characteristics** (latency variance, throughput limits)

These deployment types apply to the **Serverless API** deployment option. Open-source and custom models that use **managed compute** don't use these types. For how the options differ, see [Deployment overview for Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/../concepts/deployments-overview).

The service offers three main categories: *standard* (pay-per-token), *provisioned* (reserved capacity), and *batch* (discounted asynchronous processing). A *Developer* type is also available for fine-tuned model evaluation. Within the standard and provisioned categories, you can choose global, data zone, or geography-based processing based on your compliance requirements.

Tip

You don't always need to create a deployment. With [instant access (preview)](https://learn.microsoft.com/en-us/azure/foundry/../concepts/instant-models), you call supported models by name and start running inference immediately — no deployment required.

![Screenshot of the Foundry portal deployment dialog showing the deployment type selection box with Global Standard selected.](https://learn.microsoft.com/en-us/azure/foundry/media/add-model-deployments/models-deploy-deployment-type.png)

Important

**Data residency for all deployment types**: Data stored at rest remains in the designated Azure geography. However, inferencing data is processed as follows:

- **Global** types: May be processed in any Azure region
- **Data Zone** types: The service processes data only within the Microsoft-specified data zone (US, EU, or Asia Pacific (APAC)).
- **Standard and Regional Provisioned** types: Prompts and responses are processed within the customer-specified Azure geography and might be processed between regions within that geography for operational purposes.

[Learn more about data residency](https://azure.microsoft.com/explore/global-infrastructure/data-residency/).

## Start with Global Standard

For most workloads, start with **Global Standard**. It launches first when a new model releases, has the lowest price, and offers the broadest region coverage. Move to another deployment type only when you have a specific reason, such as data residency, reserved throughput, or asynchronous batch processing.

New deployment types become available in a set order: Global, then Data Zone, then geography-based. Geography-based deployment types arrive last, have no guaranteed availability date, and depend on capacity that frees up as older models retire. For the authoritative launch order, see [Model launch and availability](https://learn.microsoft.com/en-us/azure/foundry/../openai/concepts/model-retirements#model-launch-and-availability).

## Deployment type comparison

Instant models let you run inference without creating a deployment, so they aren't deployment types. To try a model instantly, see [Instant access to models](https://learn.microsoft.com/en-us/azure/foundry/../concepts/instant-models).

| Deployment type | SKU code | Data processing | Billing | Best for |
| --- | --- | --- | --- | --- |
| Global Standard | `GlobalStandard` | Any Azure region | Pay-per-token | General workloads, highest quota |
| Global Provisioned | `GlobalProvisionedManaged` | Any Azure region | Reserved PTU | Predictable high-throughput |
| Global Batch | `GlobalBatch` | Any Azure region | 50% discount, 24-hr | Large async jobs |
| Data Zone Standard | `DataZoneStandard` | Within data zone | Pay-per-token | EU/US/APAC data zone compliance |
| Data Zone Provisioned | `DataZoneProvisionedManaged` | Within data zone | Reserved PTU | Data zone + predictable throughput |
| Data Zone Batch | `DataZoneBatch` | Within data zone | 50% discount | Large async jobs with data zone |
| Standard | `Standard` | Within Azure geography | Pay-per-token | Geography compliance, low volume |
| Regional Provisioned | `ProvisionedManaged` | Within Azure geography | Reserved PTU | Geography compliance + throughput |
| Developer | `DeveloperTier` | Any Azure region | Pay-per-token | Fine-tuned model evaluation only (24-hour lifetime, no SLA or data-residency guarantee) |

Note

Not all models support all deployment types. Check [Foundry Models sold by Azure](https://learn.microsoft.com/en-us/azure/foundry/models-sold-directly-by-azure) for model availability by deployment type and region.

SLA guarantees vary by deployment type. Provisioned types provide guaranteed throughput and lower latency variance. Standard types offer best-effort service. Developer deployments don't include an SLA. For details, see the [Azure SLA for Azure OpenAI Service](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

Tip

For detailed pricing, see [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/).

## Choose the right deployment type

Use the following table for a quick recommendation, then refine it with the criteria that follow.

| Requirement | Recommended tier |
| --- | --- |
| Default: newest models, lowest price, broadest regions | Global Standard |
| Reserved, predictable throughput | Global Provisioned |
| Keep processing within a data zone | Data Zone Standard or Data Zone Provisioned |
| Data residency plus reserved throughput | Data Zone Provisioned |
| Keep processing within an Azure geography | Standard or Regional Provisioned (where supported) |
| Large asynchronous jobs at lower cost | Global Batch or Data Zone Batch (where supported) |
| Evaluate a fine-tuned model (temporary, no SLA) | Developer |

### By data residency requirement

- **No restrictions**: Use Global Standard or Global Provisioned
- **EU, US, or APAC data zone**: Use Data Zone Standard or Data Zone Provisioned in a region within that data zone
- **Azure geography**: Use Standard or Regional Provisioned

For the exact regions in each data zone, see Data Zone deployments.

### By workload pattern

- **Quick start, prototyping, or trying a new model**: Use [instant access (preview)](https://learn.microsoft.com/en-us/azure/foundry/../concepts/instant-models) (no deployment needed)
- **Variable, bursty traffic**: Use Standard or Global Standard (pay-per-token)
- **Consistent high volume**: Use Provisioned types (reserved capacity)
- **Large batch jobs (not time-sensitive)**: Use Global Batch or Data Zone Batch (50% cost savings)
- **Fine-tuned model evaluation**: Use Developer (no SLA, lowest cost)

### By latency requirement

- **Low latency variance required**: Use Provisioned types
- **Latency variance acceptable**: Use Standard types
- **Evaluating a fine-tuned model**: Use developer (no SLA; not intended for latency-sensitive workloads).

## Data processing locations

Standard and provisioned deployments both offer three data-processing options: global, data zone, and Azure geography. Global Standard is a common starting point for most workloads.

### Global deployments

Global deployments use Azure's global infrastructure to dynamically route traffic to available datacenters. Global deployments offer the highest initial throughput limits and broadest model availability.

For high-volume workloads, you might experience increased latency variation. If you require lower latency variance at scale, use provisioned deployment types.

Global deployments receive new models and features first.

### Data Zone deployments

For **Global** deployment types, the service can process prompts and responses in any geography where the model is deployed. For **Data Zone** deployment types, the service processes prompts and responses only within the specified data zone:

- **United States**: The service processes data anywhere within the US.
- **European Union**: The service processes data within the [Azure EU Data Boundary](https://learn.microsoft.com/en-us/privacy/eudb/eu-data-boundary-learn).
- **Asia Pacific**: The service processes data within the APAC data zone.

The EU Data Zone follows the [Azure EU Data Boundary](https://learn.microsoft.com/en-us/privacy/eudb/eu-data-boundary-learn), which can include European Free Trade Association (EFTA) countries and regions such as Norway and Switzerland in addition to EU member states. The APAC Data Zone covers multiple Asia Pacific regions. Microsoft can add regions to either data zone without prior notice to improve capacity and availability. For the current per-region breakdown, see the "Model region availability by deployment type" section of [Foundry Models sold by Azure](https://learn.microsoft.com/en-us/azure/foundry/models-sold-directly-by-azure).

Note

With Global Standard and Data Zone Standard deployment types, if the primary region experiences an interruption in service, all traffic initially routed to this region is affected. To learn more, see the [high availability and disaster recovery guide](https://learn.microsoft.com/en-us/azure/foundry/../how-to/high-availability-resiliency).

## Global Standard

- SKU name in code: `GlobalStandard`

Global Standard deployments use Azure's global infrastructure to dynamically route traffic to available datacenters. This deployment type provides the highest default quota and eliminates the need to load balance across multiple resources.

Customers with high consistent volume might experience greater latency variability. The threshold is set per model. To learn more, see the [Quotas page](https://learn.microsoft.com/en-us/azure/foundry/quotas-limits). For applications that require lower latency variance at large workload usage, consider provisioned throughput.

Global Standard supports priority processing for faster response times on a pay-as-you-go basis. To learn more, see [Priority processing for Foundry models](https://learn.microsoft.com/en-us/azure/foundry/../openai/concepts/priority-processing).

## Global Provisioned

- SKU name in code: `GlobalProvisionedManaged`

Global Provisioned deployments use Azure's global infrastructure to dynamically route traffic to available datacenters. This deployment type provides reserved model processing capacity for predictable throughput, combining global routing with guaranteed capacity.

With provisioned throughput, you purchase a fixed number of provisioned throughput units (PTUs) that guarantee a specific level of processing capacity. This deployment type provides lower and more consistent latency than Global Standard. To learn more, see [Provisioned throughput concepts](https://learn.microsoft.com/en-us/azure/foundry/../openai/concepts/provisioned-throughput).

## Global Batch

- SKU name in code: `GlobalBatch`

[Global Batch](https://learn.microsoft.com/en-us/azure/foundry/../openai/how-to/batch) handles large-scale and high-volume processing tasks. You can process asynchronous groups of requests with separate quota and a 24-hour target turnaround, at [50% less cost than Global Standard](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/). With batch processing, rather than sending one request at a time, you send a large number of requests in a single file. Global Batch requests have a separate enqueued token quota, which avoids any disruption of your online workloads.

Common use cases:

- **Large-scale data processing**: Analyze datasets in parallel.
- **Content generation**: Create large volumes of text, such as product descriptions or articles.
- **Document review and summarization**: Process and summarize lengthy documents.
- **Customer support automation**: Handle numerous queries simultaneously.
- **Data extraction and analysis**: Extract and analyze information from large amounts of unstructured data.
- **Natural language processing (NLP) tasks**: Perform sentiment analysis or translation on large datasets.

Note

Batch deployments trade real-time responsiveness for cost savings. Batch requests don't have a real-time SLA — they target completion within 24 hours but might take longer.

## Data Zone Standard

- SKU name in code: `DataZoneStandard`

Data Zone Standard deployments dynamically route traffic to datacenters within the Microsoft-defined data zone (US, EU, or APAC). This deployment type provides higher default quotas than geography-based deployment types while keeping data within the specified zone.

Customers with high consistent volume might experience greater latency variability. The threshold is set per model. To learn more, see the [quotas and limits page](https://learn.microsoft.com/en-us/azure/foundry/quotas-limits). For workloads that require low latency variance at large volume, consider provisioned deployment types.

Data Zone Standard supports priority processing for faster response times on a pay-as-you-go basis. To learn more, see [Priority processing for Foundry models](https://learn.microsoft.com/en-us/azure/foundry/../openai/concepts/priority-processing).

## Data Zone Provisioned

- SKU name in code: `DataZoneProvisionedManaged`

Data Zone Provisioned deployments dynamically route traffic within the Microsoft-specified data zone (US, EU, or APAC) while providing reserved model processing capacity. This deployment type combines data zone compliance with high and predictable throughput.

## Data Zone Batch

- SKU name in code: `DataZoneBatch`

Data Zone Batch deployments provide the same functionality as [Global Batch](https://learn.microsoft.com/en-us/azure/foundry/../openai/how-to/batch), including 50% cost savings and 24-hour turnaround. Traffic is routed only to datacenters within the Microsoft-defined data zone (US, EU, or APAC).

## Standard

- SKU name in code: `Standard`

Standard deployments use pay-per-token billing. You pay only for what you consume. Models available in each region and throughput might be limited.

Standard deployments are suited for low-to-medium volume workloads with high burstiness. Customers with high consistent volume might experience greater latency variability.

## Regional Provisioned

- SKU name in code: `ProvisionedManaged`

Regional Provisioned deployments allow you to specify the amount of throughput you require in a deployment. The service then allocates the necessary model processing capacity and ensures it's ready for you. Throughput is defined in terms of provisioned throughput units (PTUs), which is a normalized way of representing the throughput for your deployment. Each model-version pair requires different amounts of PTUs to deploy, and provides different amounts of throughput per PTU. Minimum PTU requirements vary by model. For current minimums and available capacity, see [Provisioned throughput concepts](https://learn.microsoft.com/en-us/azure/foundry/../openai/concepts/provisioned-throughput).

## Developer (for fine-tuned models)

- SKU name in code: `DeveloperTier`

The Developer deployment type is designed for fine-tuned model evaluation only. It provides cost-efficient testing of custom models but doesn't include data residency guarantees or an SLA. Developer deployments have a fixed 24-hour lifetime and are automatically deleted after expiration. To learn more about using the Developer deployment type, see the [fine-tuning guide](https://learn.microsoft.com/en-us/azure/foundry/../../foundry-classic/openai/how-to/fine-tune-test).

## Troubleshooting deployment issues

Common issues when creating or using deployments:

| Issue | Cause | Resolution |
| --- | --- | --- |
| Deployment type unavailable | Model doesn't support the selected type | Check [model availability by deployment type](https://learn.microsoft.com/en-us/azure/foundry/models-sold-directly-by-azure) |
| Quota exceeded | Subscription limit reached for tokens per minute | Request quota increase in Azure portal or use a different region |
| Region unavailable | Model not deployed in selected region | Select a region from the model's availability list |
| Provisioned capacity unavailable | No PTU capacity in region | Try a different region or use Global Provisioned for broader availability |

For quota limits by deployment type, see [Foundry Models quotas and limits](https://learn.microsoft.com/en-us/azure/foundry/quotas-limits).

## Restrict deployment types with Azure Policy

Azure Policy helps enforce organizational standards and assess compliance at scale. Through its compliance dashboard, you can evaluate the overall state of the environment and drill down to per-resource, per-policy granularity. Azure Policy also supports bulk remediation for existing resources and automatic remediation for new resources. [Learn more about Azure Policy and specific built-in controls for Foundry Tools](https://learn.microsoft.com/en-us/azure/foundry/../../ai-services/security-controls-policy).

Use the following policy to disable access to a specific Foundry deployment type. Replace `GlobalStandard` with the SKU name for the deployment type you want to restrict.

```json
{
    "mode": "All",
    "policyRule": {
        "if": {
            "allOf": [
                {
                    "field": "type",
                    "equals": "Microsoft.CognitiveServices/accounts/deployments"
                },
                {
                    "field": "Microsoft.CognitiveServices/accounts/deployments/sku.name",
                    "equals": "GlobalStandard"
                }
            ]
        }
    }
}
```