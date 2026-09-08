<!-- Title: Get started with Foundry MCP Server | Category: Developer tools and integrations/Foundry MCP Server (preview)/Get started with Foundry MCP Server | URL: mcp/get-started -->

---
layout: Conceptual
title: Get started using Foundry MCP Server with Visual Studio Code - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/mcp/get-started
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
description: Connect to Foundry MCP Server from Visual Studio Code, authenticate with Entra ID, and run your first prompts against Foundry services.
keywords: mcp, model context protocol, foundry mcp server, visual studio code
ms.reviewer: sehan
ms.date: 2026-08-19T00:00:00.0000000Z
ms.topic: get-started
ms.subservice: foundry-mcp
ms.custom: doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: 29f68916-11a5-c700-5f0e-f78d13894937
document_version_independent_id: da1fbf15-1d57-20bd-5e82-4f817308fee5
updated_at: 2026-08-19T22:12:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/mcp/get-started.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/04973840a411e85c28bcaacfbc2edae54547434d/articles/foundry/mcp/get-started.md
git_commit_id: 04973840a411e85c28bcaacfbc2edae54547434d
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../toc.json
word_count: 1056
asset_id: foundry/mcp/get-started
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/mcp/get-started.md
cmProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/911a44a7-2f6c-477c-810f-dc8b7d425cce
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/341fdab2-4964-4759-8241-f5820b012a47
spProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/14f2b9d5-6f06-45a8-ac5f-313eaa351153
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/cc1f92bb-c0d6-4d40-99ce-dabea3161a84
platformId: 67453780-6e4a-15dd-5006-ab82413b90f8
---

# Get started using Foundry MCP Server with Visual Studio Code - Microsoft Foundry | Microsoft Learn

Foundry MCP Server (preview) is a cloud-hosted implementation of the Model Context Protocol (MCP) that gives your agents secure tool access to Foundry services. It exposes curated tools that let your agents perform read and write operations against Foundry services without calling backend APIs directly. You don't need to deploy infrastructure — the server provides a secure, scalable endpoint with built-in authentication through Microsoft Entra ID.

Use an MCP-compliant client such as Visual Studio Code to connect to the public endpoint, authenticate with Entra ID, and let LLMs access the tools. After you connect, you can build agents that invoke these tools with natural language prompts.

In this article, you learn how to:

- Connect to Foundry MCP Server with GitHub Copilot in Visual Studio Code
- Run prompts to test Foundry MCP Server tools and interact with Azure resources

This guide takes about 5 minutes to complete.

Note

This feature is currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Azure account with an active subscription. If you don't have one, [create a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A Foundry project. If you don't have a project, create one with the [Microsoft Foundry SDK Quickstart](/en-us/azure/ai-foundry/quickstarts/get-started-code?tabs=python#first-run-experience).
- [Visual Studio Code](https://code.visualstudio.com/download) (version 1.99 or later).
- A [GitHub Copilot](https://github.com/features/copilot) subscription (Individual, Business, or Enterprise).
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) Visual Studio Code extension.
- Contributor or higher role on the Foundry project you want to access.

## Install and start Foundry MCP Server

Select an option to install Foundry MCP Server in Visual Studio Code.

# [User profile](#tab/user)
Install Foundry MCP Server in your user profile so it's available to all workspaces in Visual Studio Code.

1. Open the **Command Palette** (Ctrl+Shift+P).
2. Search for **MCP: Add Server**.
3. Select the **HTTP (HTTP or Server-Sent Events)** option.
4. Enter `https://mcp.ai.azure.com` as the URL.
5. Enter a friendly name such as *foundry-mcp-remote*, then press Enter. Visual Studio Code adds the following server entry under your user profile:

    ```json
    { 
      "servers": { 
        "foundry-mcp-remote": { 
          "type": "http", 
          "url": "https://mcp.ai.azure.com" 
        } 
      } 
    }
    ```
6. Open the **Command Palette** (Ctrl+Shift+P).
7. Search for and select **MCP: List Servers**.
8. Select Foundry MCP Server you added and choose **Start Server**.
9. A green indicator appears next to the server name in **MCP: List Servers**, confirming the connection is active.
10. When prompted, sign in to Azure so the MCP server can interact with services in your subscription.
11. Open GitHub Copilot and select **Agent Mode**.
12. Select the tools icon, search for *Foundry* to filter the list, and confirm the server appears.

    ![Screenshot of GitHub Copilot Agent Mode tools list showing Foundry MCP Server tool.](../media/mcp/foundry-mcp-server-tools.png)

    Learn more about Agent Mode in the [Visual Studio Code documentation](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).

# [Workspace install](#tab/workspace)
Install Foundry MCP Server for a specific workspace to scope it to that folder:

1. Open an empty folder or an existing project folder in Visual Studio Code.
2. In the folder root, create a `.vscode` folder if it doesn't exist.
3. Inside the `.vscode` folder, create a file named `mcp.json`, and add the following JSON.

    ```json
    { 
      "servers": { 
        "foundry-mcp-remote": { 
          "type": "http", 
          "url": "https://mcp.ai.azure.com" 
        } 
      } 
    }
    ```
4. Save your changes to `mcp.json`.
5. Select the **Start** button above the new server entry.
6. A green indicator appears next to the server name, confirming the connection is active.
7. When prompted, sign in so the MCP server can interact with services in your subscription.
8. Open GitHub Copilot and select Agent Mode.
9. Select the tools icon, search for *Foundry* to filter the results, and confirm the server appears.

    ![A screenshot showing Foundry MCP Server as GitHub Copilot tool.](../media/mcp/foundry-mcp-server-tools.png)

    To learn more about Agent Mode, visit the [Visual Studio Code documentation](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).

---

## Use prompts to test Foundry MCP Server

1. Open the GitHub Copilot chat panel and confirm **Agent Mode** is selected.
2. Enter a prompt that uses Foundry MCP Server tools—for example *Tell me about the latest models on Foundry*.
3. Copilot requests permission to run the required Foundry MCP Server operation. Select **Continue** or use the arrow to choose a more specific behavior:

    - **Current session** always runs the operation in the current GitHub Copilot Agent Mode session.
    - **Current workspace** always runs the command for the current Visual Studio Code workspace.
    - **Always allow** sets the operation to always run for any GitHub Copilot Agent Mode session or any Visual Studio Code workspace.

    ![Screenshot of options to run Foundry MCP Server operations.](../media/mcp/foundry-mcp-server-run-tool.png)

    The response resembles the following shortened output. Your actual results vary based on current model availability.

    ```text
    Latest / Notable Foundry Models (Preview Snapshot)
    
    1. Frontier & Reasoning Models
    gpt-4o (2024-11-20) – Flagship multimodal model; strong multi-turn coherence.
    o3 (2025-04-16) – Balanced reasoning with good accuracy/quality trade-off.
    o4-mini (2025-04-16) – Strong quality with better latency than o3.
    Phi-4 – Microsoft small frontier open model; competitive quality at lower cost.
    
    // Further output omitted
    ```
4. Explore and test Foundry MCP Server operations with other prompts, such as:

    ```text
    What tools can I use from Foundry MCP Server (preview)?
    Tell me about the latest models on Foundry
    Show me details about the GPT-4o model on Foundry
    ```

## Troubleshooting

| Issue | Resolution |
| --- | --- |
| Server doesn't start | Verify you entered the URL `https://mcp.ai.azure.com` correctly. Open the **Command Palette** and run **MCP: List Servers** to check server status. |
| Authentication prompt doesn't appear | Make sure the GitHub Copilot extension is installed and you're signed in to Visual Studio Code with a Microsoft account that has access to your Azure subscription. |
| Foundry tools don't appear in Agent Mode | Confirm the server is running (green indicator in **MCP: List Servers**). Check that you selected **Agent Mode** in the Copilot chat panel, then select the tools icon and search for *Foundry*. |
| "Access denied" or permission errors | Verify you have Contributor or higher role on the Foundry project. The server uses On-Behalf-Of flow with your Entra ID credentials. |

If these steps don't resolve a product or service issue, create an [Azure support request](https://portal.azure.com). Select **Technical** for **Issue type**, **Microsoft Foundry** for **Service**, and **Foundry MCP Server** for **Problem type**. For documentation feedback, use the feedback controls on this page. For how-to questions, ask the community on [Microsoft Q&A](/en-us/answers/tags/133/azure).

## Clean up resources

To remove the server configuration:

- **User profile**: Open the **Command Palette**, run **MCP: List Servers**, select the Foundry server, and choose **Remove Server**.
- **Workspace**: Delete the server entry from the `.vscode/mcp.json` file in your project folder.