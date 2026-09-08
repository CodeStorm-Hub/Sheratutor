<!-- Title: Claude hosting comparison | URL: foundry-models/concepts/claude-models-hosting-comparison -->

---
layout: Conceptual
title: Compare hosting options for Claude models in Microsoft Foundry - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/claude-models-hosting-comparison
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
author: msakande
learn_banner_products:
- azure
manager: mcleans
ms.author: mopeakande
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Compare Azure-hosted and Anthropic-hosted Claude models in Microsoft Foundry.
ms.reviewer: ambadal
ms.subservice: foundry-models
ms.topic: concept-article
ms.date: 2026-07-24T00:00:00.0000000Z
ms.custom:
- classic-and-new
- doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: 96d3120a-af51-4a12-d76a-8cfd94879eb7
document_version_independent_id: a7eb6371-2986-64a6-096a-a389a9d89969
updated_at: 2026-07-24T23:55:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/foundry-models/concepts/claude-models-hosting-comparison.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/b9cc768bfc5d58ea2bf14717e2aed70fbd499473/articles/foundry/foundry-models/concepts/claude-models-hosting-comparison.md
git_commit_id: b9cc768bfc5d58ea2bf14717e2aed70fbd499473
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1024
asset_id: foundry/foundry-models/concepts/claude-models-hosting-comparison
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/foundry-models/concepts/claude-models-hosting-comparison.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
platformId: aa31f7b5-fba7-3a9f-262a-f56900b6ef8a
---

# Compare hosting options for Claude models in Microsoft Foundry - Microsoft Foundry | Microsoft Learn

Microsoft Foundry offers Claude models in two hosting configurations: **Hosted on Azure** and **Hosted on Anthropic infrastructure**. This article outlines how the various aspects are impacted by the hosting option you choose.

For model availability and capabilities, see [Claude models in Microsoft Foundry](claude-models). For detailed data handling information, see [Data, privacy, and security for Claude models](../../responsible-ai/claude-models/data-privacy).

## At a glance

The following table summarizes the key differences between Azure-hosted and Anthropic-hosted Claude models in Microsoft Foundry.

| Topic | Hosted on Azure | Hosted on Anthropic |
| --- | --- | --- |
| **Seller of record** | Anthropic | Anthropic |
| **Data processor** | Anthropic | Anthropic |
| **SLA** | Anthropic is the operator and provides any SLA. | Anthropic is the operator and provides any SLA. |
| **Data retention** | Governed by [Anthropic's Data Processing Addendum](https://www.anthropic.com/legal/data-processing-addendum) and [Anthropic's Commercial Terms of Service](https://aka.ms/anthropic_tandc) | Governed by [Anthropic's Data Processing Addendum](https://www.anthropic.com/legal/data-processing-addendum) and [Anthropic's Commercial Terms of Service](https://aka.ms/anthropic_tandc) |
| **Data residency** | Data at rest is stored in the selected Azure geography and processing is scoped to applicable "global" or "DataZone" deployment options on Microsoft Foundry. | Data might be processed outside Azure, including outside the selected Azure region. |
| **Data zone availability** | Global Standard and Data Zone Standard (US) | Global Standard only |
| **Quota increase form** | [Foundry quota request](https://aka.ms/oai/stuquotarequest) | [Foundry quota request](https://aka.ms/oai/stuquotarequest) |
| **Compliance** | Refer to [Anthropic Trust Center](https://trust.anthropic.com/) | Refer to [Anthropic Trust Center](https://trust.anthropic.com/) |
| **Support path** | Microsoft Support | Microsoft Support |
| **Purchasing flow** | Azure Marketplace → CCU meter; MACC-eligible | Azure Marketplace → CCU meter; MACC-eligible |

Note

For both hosting options, Anthropic is the seller and operator of Claude models in Microsoft Foundry. Claude models are Non-Microsoft Products under the Product Terms. Your use of Claude models is subject to the terms of use Anthropic provides for Claude models and APIs.

## Model and API differences

The following table summarizes operational differences that affect how you build and run applications on each hosting option.

| Dimension | Hosted on Azure | Hosted on Anthropic |
| --- | --- | --- |
| **Model availability** | Opus 5, Opus 4.8, Sonnet 5, and Haiku 4.5 | Opus 5, Opus 4.8, Sonnet 5, Haiku 4.5, preview models (Fable), and older versions of Opus, Sonnet, and Haiku |
| **Deployment types** | Global Standard and Data Zone Standard (US) | Global Standard only |
| **Supported APIs** | Messages, Token counting | Messages, Token counting, plus /files and /skills |
| **Additional capabilities** | Core capability set | Core set plus [additional capabilities](https://docs.claude.com/en/docs/build-with-claude/overview) |
| **Content safety** | Anthropic safety systems active | Anthropic safety systems active |

## Data processing and residency

Microsoft Foundry offers two hosting options for deploying your Claude models:

- **Hosted on Azure**
- **Hosted on Anthropic infrastructure**

For both hosting options, Anthropic is the seller and operator of Claude models in Microsoft Foundry and acts as an independent data processor for prompts and outputs associated with Claude models. Your use of the Claude models is subject to the terms of use Anthropic provides for Claude models and APIs.

## Hosted on Azure

If you choose the **Hosted on Azure** deployment option, your prompts and outputs are processed on Azure infrastructure, including request ingress, API services, and GPU inference. Data at rest is stored in the selected Azure geography and processing is scoped to applicable “Global” or “DataZone” deployment options available on Microsoft Foundry.

Automatic safeguards flag content that might be sent to Anthropic Trust & Safety for review. Anthropic personnel review customer content on an exceptions-only basis to investigate potential safety violations, subject to applicable Anthropic terms.

## Hosted on Anthropic Infrastructure

If you choose the **Hosted on Anthropic Infrastructure** deployment option, your prompts and outputs are processed on Anthropic hosted infrastructure. Data might be processed outside of Azure including outside of your selected Azure region. To learn more about the terms that govern data processing in Anthropic-hosted infrastructure, see [Anthropic's Data processing Addendum](https://www.anthropic.com/legal/data-processing-addendum) and [Anthropic's Commercial Terms of Service](https://aka.ms/anthropic_tandc).

Microsoft continues to provide Microsoft Foundry experience, Azure infrastructure, and billing services for this deployment option. Microsoft also collects billing, usage, customer contact, and transaction information for Marketplace operations. Microsoft might share such customer contact information, transaction details, and usage information with Anthropic so that Anthropic can operate, support, and communicate with customers about the model. Microsoft processes data for these services under the Microsoft Products and Services Data Protection Addendum and applicable Marketplace terms.

## Support path

For both hosting options, contact **Microsoft Support** for all support questions, including:

- Deployment issues in the Microsoft Foundry portal
- Billing questions and disputes
- Azure Marketplace subscription issues
- API connectivity issues

## Purchasing, billing, and quotas

### Purchasing flow

Both hosting options use the same Azure Marketplace purchasing flow:

1. Subscribe to the **Claude Platform on Foundry** offer through [Azure Marketplace](https://marketplace.microsoft.com/) or the Microsoft Foundry portal model catalog.
2. Accept the offer on your Azure billing account.
3. Deploy a Claude model from the Foundry catalog. If the model is available in both versions, you land on the Azure-hosted version by default.
4. Usage is metered and billed in Claude Consumption Units (CCU).

For step-by-step instructions, see [Deploy and use Claude models in Microsoft Foundry](../how-to/use-foundry-models-claude).

### Billing

Both hosting options use **Claude Consumption Units (CCU)** for billing, with the following characteristics:

- **Microsoft bills** you on your Azure invoice
- **MACC-eligible** — CCU spend decrements your Microsoft Azure Consumption Commitment
- **Hourly metering**, invoiced monthly in arrears
- **Pay-as-you-go** — no prepaid CCU credits

For a full explanation of CCU billing, see [Claude Consumption Units (CCU) billing in Microsoft Foundry](claude-models-billing).

### Subscription type restrictions

The following subscription types aren't supported for Claude models:

- Free trial subscriptions
- Student subscriptions
- Credit-based subscriptions
- Enterprise accounts in South Korea
- Cloud Solution Provider (CSP) subscriptions

### Quota increase

To request a quota increase beyond your default rate limits, submit the [quota increase request form](https://aka.ms/oai/stuquotarequest).

For current default rate limits by subscription type, see [Claude models in Microsoft Foundry — Quotas and rate limits](claude-models#quotas-and-rate-limits).

## Choose the right option for your workload

**Choose Hosted on Azure if:**

- You need data residency within a specific Azure geography
- You need Data Zone Standard (US) deployment

**Choose Hosted on Anthropic if:**

- You need access to API features that aren't yet available in the hosted on Azure version