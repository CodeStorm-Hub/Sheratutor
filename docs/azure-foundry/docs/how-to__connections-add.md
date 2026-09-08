<!-- Title: Connections and resources | URL: how-to/connections-add -->

---
layout: Conceptual
title: Add a new connection to your project - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/how-to/connections-add
breadcrumb_path: ../../breadcrumb/azure-ai/toc.json
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
author: sdgilley
learn_banner_products:
- azure
manager: mcleans
ms.author: sgilley
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how to add a new connection to your Foundry project.
ms.subservice: foundry-platform
ms.custom:
- classic-and-new
- ignite-2023
- build-2024
- ignite-2024
- doc-kit-assisted
ms.topic: how-to
ms.date: 2026-06-19T00:00:00.0000000Z
ms.reviewer: meerakurup
ai-usage: ai-assisted
locale: en-us
document_id: bb036dae-ef90-8893-0488-26d66c468047
document_version_independent_id: 4b6a6a4f-d068-a22d-beaa-a06950925672
updated_at: 2026-08-13T22:15:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/how-to/connections-add.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/0909fd8da836d162b6fc7eb2207f2488e0ffcf69/articles/foundry/how-to/connections-add.md
git_commit_id: 0909fd8da836d162b6fc7eb2207f2488e0ffcf69
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../toc.json
word_count: 1291
asset_id: foundry/how-to/connections-add
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/how-to/connections-add.md
cmProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://authoring-docs-microsoft.poolparty.biz/devrel/f488294d-f483-456e-94e3-755f933b811b
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/12ed19f9-ebdf-4c8a-8bcd-7a681836774d
spProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://authoring-docs-microsoft.poolparty.biz/devrel/02662057-0b9b-40f4-a3c7-537125b6d283
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3a764584-4f97-452b-8f1d-36f19b12f6ae
platformId: efdfadea-7715-54d3-6e88-0fe4b10d5304
---

# Add a new connection to your project - Microsoft Foundry | Microsoft Learn

Important

Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to add a new connection in [Microsoft Foundry portal](https://ai.azure.com/?cid=learnDocs).

Connections let you authenticate to Microsoft and other resources within your Foundry projects. They're required for scenarios such as building Standard Agents or building with Agent knowledge tools. Certain connections can be created in the Foundry UI while others require deployment through code in Bicep template. See our [foundry-samples on GitHub](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/01-connections). Read the table descriptions below to learn more.

## Prerequisites

- If you don't have one, [create a project](https://learn.microsoft.com/en-us/azure/foundry/create-projects).
- Make sure you can open your project in Microsoft Foundry.
- Make sure you have permissions to add connections to the project or resource. Adding connections requires the **Foundry User**, **Foundry Owner**, or Azure **Contributor** role (or higher). For details, see [Role-based access control](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry).

    Important

    The Foundry RBAC roles were recently renamed. **Foundry User**, **Foundry Owner**, **Foundry Account Owner**, and **Foundry Project Manager** were previously named Azure AI User, Azure AI Owner, Azure AI Account Owner, and Azure AI Project Manager. You might still see the previous names in some places while the rename rolls out. The role IDs and core permissions are unchanged by the rename.

## Connection types

| Service connection type | Preview | Description |
| --- | --- | --- |
| Azure AI Search |  | Azure AI Search is an Azure resource that supports information retrieval over vector and textual data stored in search indexes. Required for Standard Agent deployment. |
| Azure Storage |  | Azure Storage is a cloud storage solution for storing unstructured data such as documents, images, videos, and application installers. Required for Standard Agent deployment. |
| Azure Cosmos DB | ✅ | Azure Cosmos DB is a globally distributed, multi-model database service that offers low latency, high availability, and scalability across multiple regions. Required for Standard Agent deployment. Connection creation is supported only through code. |
| Azure OpenAI |  | Azure OpenAI provides access to OpenAI models, including GPT-5, GPT-4o, GPT-image-1, and Embeddings, with Azure security and enterprise capabilities. |
| Application Insights |  | Azure Application Insights helps detect performance anomalies, diagnose issues, and understand application behavior. |
| Azure Key Vault |  | Azure service for securely storing and accessing secrets. (See limitations below.) |
| Foundry |  | Connect to other Foundry resources. |
| OpenAI |  | Connect to your OpenAI models. |
| Serp |  | Serp connects to Search Engine Results Pages (SERP) for real-time data access. Supports scenarios that need the latest search results. |
| API key |  | API key connections handle authentication to your specified target on an individual basis. |
| Custom key |  | Custom connections let you securely store and access keys while storing related properties, such as targets and versions. These connections are useful when you have many targets or scenarios where you don't need a credential to access the target. LangChain scenarios are a common example. You manage authentication for custom connections. |
| Grounding with Bing Search |  | Connects to Bing Search to provide real-time web grounding for queries. Enables agents to reference current web data in responses. |
| Serverless Model | ✅ | Serverless Model connections allow serverless API deployment. Connection creation is supported only through code. |
| Azure Databricks | ✅ | Azure Databricks connections let Foundry Agents access workflows and Genie Spaces during runtime. Connection creation is supported only through code. |
| SharePoint | ✅ | SharePoint is a Microsoft platform for document storage and collaboration. It lets agents access and manage organizational documents. Connection creation is supported only through code. |
| Microsoft Fabric | ✅ | AI skills let you create conversational Q&A systems on Fabric using generative AI. Connection creation is supported only through code. |
| Grounding with Bing Custom Search | ✅ | Integrates with a custom Bing search instance for tailored web grounding. Connection creation is supported only through code. |
| Azure APIM | ✅ | APIM supports governance for AI models called in Foundry Agent Service. Connection creation is supported only through code. |
| Model Gateway | ✅ | Model Gateway supports governance for AI models called in Foundry Agent Service. Connection creation is supported only through code. |
| Copilot Studio Environment |  | Bring your Copilot Studio agents into Foundry Control Plane to view. Create the connection on the **Manage** &gt; **Project details** &gt; **Connected resources** tab in the Foundry portal, connecting directly to your Copilot Studio Environment. |

### Azure Key Vault limitations

Foundry stores connections details in a managed Azure Key Vault if no Key Vault connection is created. Users that prefer to manage their secrets themselves can bring their own Azure Key Vault via a connection. All Foundry projects use a managed Azure Key Vault (not shown in your subscription). If you bring your own Azure Key Vault, note:

- Only one Azure Key Vault connection per Foundry resource at a time.
- You can delete an Azure Key Vault connection only if there are no other existing connections on the Foundry resource or project level.
- Secret migration isn't supported; recreate connections after attaching the Key Vault.
- Deleting the underlying Azure Key Vault breaks the Foundry resource (connections depend on stored secrets).
- Deleting secrets in your BYO Key Vault may break connections to other services.

### Azure Databricks connection (preview) limitations

It supports three connection types: **Jobs**, **Genie**, and **Other**. You can choose the Job or Genie space to associate with the connection in the Foundry UI. You can also use the Other connection type to let your agent access workspace operations in Azure Databricks. Authentication uses Microsoft Entra ID for users or service principals. For examples of using this connector, see [Jobs](https://github.com/Azure-Samples/AI-Foundry-Connections/blob/main/src/samples/python/sample_agent_adb_job.py) and [Genie](https://github.com/Azure-Samples/AI-Foundry-Connections/blob/main/src/samples/python/sample_agent_adb_genie.py). Usage of this connection is available only via the Foundry SDK and is integrated into agents as a FunctionTool. Usage of this connection in Foundry Playground isn't currently supported.

## Create a new connection

Use the portal or a Bicep template to add a connection.

# **Foundry portal**
Follow these steps to create a new connection that's available for the current project.

1. Sign in to [Microsoft Foundry](https://ai.azure.com/?cid=learnDocs). Make sure the **New Foundry** toggle is on. These steps refer to **Foundry (new)**.

    ![](https://learn.microsoft.com/en-us/azure/foundry/media/version-banner/new-foundry.png)
2. Select **Manage** in the upper-right navigation.
3. Select **Project details** in the left pane.
4. Select the **Connected resources** tab.
5. Select **Add connection**.
6. Select the service you want to connect to from the list of available external resources. For example, select **Azure AI Search**.
7. Browse for and select your Azure AI Search service from the list of available services and then select the type of **Authentication** to use for the resource. Select **Add connection**.

    Tip

    Different connection types support different authentication methods. Using Microsoft Entra ID might require specific Azure role-based access permissions for your developers. For more information, visit [Role-based access control](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry).
8. Confirm that your new connection appears in the connected resources list.

# **Bicep**
Use [Connection templates](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/01-connections) to create connections through infrastructure deployment.

After deployment, return to your project and verify that the new connection appears in connected resources.

---

## Network isolation

For end-to-end [network isolation](https://learn.microsoft.com/en-us/azure/foundry/configure-private-link) with Foundry, you need private endpoints to connect to your connected resource. For example, if your Azure Storage account is set to public network access as **Disabled**, then a private endpoint should be deployed in your virtual network to access in Foundry.

For more on how to set private endpoints to your connected resources, see the following documentation:

| Private resource | Documentation |
| --- | --- |
| Azure Storage | [Use private endpoints](https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints) |
| Azure Cosmos DB | [Configure Azure Private Link for Azure Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-configure-private-endpoints?tabs=arm-bicep) |
| Azure AI Search | [Create a private endpoint for a secure connection](https://learn.microsoft.com/en-us/azure/search/service-create-private-endpoint) |
| Azure OpenAI | [Configure virtual networks for Azure AI services](https://learn.microsoft.com/en-us/azure/ai-services/cognitive-services-virtual-networks) |
| Application Insights | [Use Azure Private Link to connect networks to Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/private-link-security) |

Note

Cross-subscription connections used for model deployment are not supported (Foundry, Azure OpenAI). You can't connect to resources from different subscriptions for model deployments.