<!-- Title: Manage Agents at Scale | URL: control-plane/how-to-manage-agents -->

---
layout: Conceptual
title: Manage agents at scale in Microsoft Foundry Control Plane - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/control-plane/how-to-manage-agents
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
author: santiagxf
learn_banner_products:
- azure
manager: mcleans
ms.author: lagayhar
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how to view your agent inventory, monitor agent health, and perform lifecycle operations by using Microsoft Foundry Control Plane.
ms.reviewer: fasantia
ms.date: 2026-07-15T00:00:00.0000000Z
ms.manager: mcleans
ms.topic: how-to
ms.subservice: foundry-control-plane
ms.custom: dev-focus, doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: c475cedb-9bfe-fa9c-f3ed-6a2ac2f0ee60
document_version_independent_id: 89b96d0a-9b90-3d98-c133-6e7e0d296985
updated_at: 2026-07-16T17:09:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/control-plane/how-to-manage-agents.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/18e2c4f07663e93c34f1d81382281e8d8f5f9b99/articles/foundry/control-plane/how-to-manage-agents.md
git_commit_id: 18e2c4f07663e93c34f1d81382281e8d8f5f9b99
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../toc.json
word_count: 1981
asset_id: foundry/control-plane/how-to-manage-agents
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/control-plane/how-to-manage-agents.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/b96d6ca2-3a10-4cbe-9688-a712765ad324
- https://authoring-docs-microsoft.poolparty.biz/devrel/07bb3e10-d135-43ff-bc8b-360497cb39fa
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/74a8ae24-e88d-4772-8c51-76842d0aff90
- https://authoring-docs-microsoft.poolparty.biz/devrel/12e559b9-eaf6-4aee-9af7-62334e15f863
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
platformId: e6557712-a0b0-3b4b-9d81-be7f405e0f2d
---

# Manage agents at scale in Microsoft Foundry Control Plane - Microsoft Foundry | Microsoft Learn

Microsoft Foundry Control Plane provides centralized management and observability for agents that run across supported platforms and infrastructures. By using Foundry Control Plane, you can manage agents that are distributed across multiple projects within a subscription.

This article explains how to view your agent inventory, monitor agent health, and perform lifecycle operations by using the Foundry portal.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, create a [free Azure account, which includes a free trial subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A Foundry project. If you don't have one, [create a project](../how-to/create-projects).

- [Application Insights configured](monitoring-across-fleet#configure-monitoring) for observability metrics (optional but recommended).

## Agent inventory

The **Assets** pane provides a unified, searchable table of all AI assets across projects within a subscription. This inventory brings together critical metadata and health indicators, so you can assess and act on your AI estate efficiently.

Foundry Control Plane automatically discovers supported agents within resources in the selected subscription and displays them on the **Agents** tab. To view them, select **Operate** &gt; **Assets** &gt; **Agents**.

[![Screenshot of the tab that contains an inventory of agents.](media/how-to-manage-agents/inventory-all-agents.png)](media/how-to-manage-agents/inventory-all-agents.png#lightbox)

The following information appears:

| Column | Description | Agent platform |
| --- | --- | --- |
| **Name** | The name of the agent or the agentic resource. | All |
| **Source** | The source platform where the agent or resource was discovered. See the list of supported platforms later in this article. | All |
| **Project** | The Foundry project associated with the agent. For custom agents, it's the project where the agent was registered. | FoundryCustom |
| **Status** | Refers to a broad range of conditions, including operational, health, or lifecycle status of the agent. Agents transition to different values, depending on the platform and lifecycle operations. Possible values are: <br>- Running<br>- Stopped<br>- Blocked<br>- Unknown | All |
| **Version** | The version of the agent asset. | Foundry |
| **Published as** | Indicates if the agent was [published as an agent application](../agents/how-to/agent-applications). Published agents in Foundry have their own endpoint for invocation. | Foundry |
| **Error rate** | The proportion of failed runs compared to successful ones in the last month. This column requires observability configured. | All |
| **Estimated cost** | The estimated cost of the agent executions in the last month, based on the number of tokens consumed. This column requires observability configured. | Foundry |
| **Token usage** | The estimated tokens consumed by the runs in the last month. This column requires observability configured. | Foundry |
| **Runs** | The number of executions in the last month. This column requires observability configured. | All |
| **Monitoring features** | The number of monitoring features that are enabled in the agent. See [The three stages of AI application lifecycle evaluation](../concepts/observability#the-three-stages-of-ai-application-lifecycle-evaluation). | Foundry |
| **Entra ID** | The Microsoft Entra Agent ID application and object ID associated with the agent. An agent identity is a special service principal in Microsoft Entra ID. It represents an identity that the agent identity blueprint created and is authorized to impersonate. See [Agent identity concepts in Microsoft Foundry](../agents/concepts/agent-identity). | Foundry |

### Permissions model

Foundry Control Plane automatically discovers agents that users can access. Because Foundry Control Plane aggregates information across resources within the subscription, different users might see different agents listed on the **Assets** pane, depending on their access level on each resource.

The following roles affect what you can see and do:

| Role | Scope | Capabilities |
| --- | --- | --- |
| Reader | Resource, resource group, or subscription | View agent inventory and traces |
| Contributor | Resource, resource group, or subscription | View and perform lifecycle operations (start, stop, block) |
| Owner | Resource, resource group, or subscription | Full management, including permissions |

Note

These roles are the minimum requirements. Custom roles with equivalent permissions also work. The agents you see depend on your role assignments across the resources in the selected subscription.

## Supported agent platforms

Foundry Control Plane automatically discovers agents in the following platforms:

- Foundry agents, including [prompt-based agents](../agents/overview), [workflows](../agents/concepts/workflow), and [hosted agents](../agents/concepts/hosted-agents)
- [Azure SRE Agent](/en-us/azure/sre-agent/)
- [Azure Logic Apps agent loops](/en-us/azure/logic-apps/agent-workflows-concepts)
- [Custom agents](register-custom-agent)

### Foundry agents

Foundry Control Plane helps you manage agents across all your Foundry projects. When you create an agent or workflow in a Foundry project, the agent appears in the inventory. Foundry Control Plane lists all the agents across all the projects within a subscription.

For each agent, the information includes:

- The latest version of the agent.
- Versions [published as agent applications](../agents/how-to/agent-applications).

You can monitor versions consumed by your users and new versions under development. The following example shows multiple Foundry agents listed. Version 6 of the `format-agent` agent was published, but version 7 (latest) is still under development.

[![Screenshot of multiple Foundry agents listed in an inventory.](media/how-to-manage-agents/inventory-foundry-agent.png)](media/how-to-manage-agents/inventory-foundry-agent.png#lightbox)

Note

Classic agents and Azure OpenAI assistants aren't supported.

### Azure SRE Agent

Azure SRE Agent helps you maintain the health and performance of your Azure resources through AI-powered monitoring and assistance. Agents continuously watch your resources for problems, provide troubleshooting help, and suggest remediation steps in a natural-language chat interface. [Learn more about Azure SRE Agent](/en-us/azure/sre-agent/).

Foundry Control Plane discovers Azure SRE Agent resources in your subscription and displays them in the inventory.

### Azure Logic Apps agent loop

Azure Logic Apps supports workflows that complete tasks by using agent loops with large language models (LLMs). An agent loop uses an iterative process to solve complex, multistep problems. [Learn more about workflows with AI agents and models in Logic Apps](/en-us/azure/logic-apps/agent-workflows-concepts).

Foundry Control Plane discovers Logic Apps resources that contain agent loop workflows and lists them in the inventory.

Note

Observability features, including traces and metrics, aren't supported in Logic Apps agent loops.

### Custom agents

For agentic platforms that Foundry Control Plane doesn't support, you can manually register agents in a Foundry project to enable management.

Registering custom agents that run in Azure compute services or other cloud environments can help you gain visibility into their operations and control their behavior. You can register a custom agent in Foundry Control Plane and develop the agent in the technology of your choice, for both platform and infrastructure solutions.

[Learn how to register an agent in Foundry Control Plane](register-custom-agent) to enable management.

## Observability of agents

Foundry Control Plane uses the Application Insights resources that host your agents to help you monitor and diagnose those agents. When such data is available, Foundry Control Plane can:

- Compute runs and error rates.
- Compute usage metrics, including token usage and cost.
- Collect execution traces.

If you don't see such information for your agent, you need to [configure Application Insights](monitoring-across-fleet#configure-monitoring). Ensure that you also have [the appropriate permissions to view Application Insights data and cost metrics](monitoring-across-fleet#prerequisites).

Tip

Configure Application Insights for each of the resources that host agents. For Foundry agents, configure Application Insights per Foundry project. However, you can connect multiple Foundry projects to the same Application Insights resources to optimize those resources.

### View traces

You can view traces and logs sent to Foundry. Traces are stored in Application Insights, and you can query them by using the Foundry portal or any other compatible tool.

To view them:

1. On the toolbar, select **Operate**.
2. On the left pane, select **Assets**.
3. Select the agent.
4. Select the **Traces** tab. The tab shows one entry for each call made to the agent.

    Two columns contain IDs associated with the call: **Trace ID** and **Conversation ID**. Traces are stored in Application Insights and contain data to diagnose behavior. The **Conversation ID** column applies for Foundry agents. It contains the *conversation* associated with the trace. Conversations are stored in the Foundry service.

    [![Screenshot of the traces associated with one agent.](media/how-to-manage-agents/inventory-traces-list.png)](media/how-to-manage-agents/inventory-traces-list.png#lightbox)
5. To see the details, select a value in the **Trace ID** column.

    [![Screenshot of a single trace with LLM calls.](media/how-to-manage-agents/inventory-traces-view.png)](media/how-to-manage-agents/inventory-traces-view.png#lightbox)

    Tip

    Custom agents require extra configuration to show details, including tools and LLM spans. Learn more at [Instrument custom code agents](register-custom-agent#instrument-custom-code-agents).

## Lifecycle operations

Foundry Control Plane helps organizations control agents to manage usage and infrastructure cost. Different agent platforms support different operations.

The following table summarizes supported actions for each platform. A Foundry agent's support depends on the agent type and its publishing state.

| Platform | Agent type | Published | Supported actions | Notes |
| --- | --- | --- | --- | --- |
| Foundry | PromptWorkflow | No | None | Unpublished agents don't have dedicated deployments, and they use the project's endpoint to receive requests. Their lifecycle is attached to the project's lifecycle. To stop an unpublished prompt agent or workflow, you must delete it. |
| Foundry | Hosted | No | Start/stop | Stopping a hosted agent stops the deployment associated with it. Any compute attached to it is deallocated. |
| Foundry | PromptWorkflowHosted | Yes | Start/stop | Stopping a published agent stops the deployment associated with it. It deallocates any compute attached. |
| Azure SRE Agent | Not applicable | Not applicable | Start/stop |  |
| Azure Logic Apps | Not applicable | Not applicable | Start/stop | You can stop an Azure Logic Apps agent loop by stopping the Logic Apps resource that hosts it. Stopping a Logic Apps resource stops all the workflows associated with it. |
| Custom | Not applicable | Not applicable | Block/unblock | Foundry doesn't have access to the underlying infrastructure where the agent runs, so start and stop operations aren't available. However, Foundry can block incoming requests to the agent. Blocking prevents clients from using the agent. |

### Start and stop agents

When you stop an agent, you stop the infrastructure that's associated with it and move the agent to the **Stopped** state.

Stopping an agent deprovisions its infrastructure and prevents new runs. Any workflows or resources connected to this agent can't access it. This operation *doesn't terminate existing runs*.

To stop an agent:

1. On the toolbar, select **Operate**.
2. On the left pane, select **Assets**.
3. Select the agent that you want to stop. The information pane appears.
4. Select **Update status**, and then select **Stop**.

    [![Screenshot of steps for stopping an agent.](media/how-to-manage-agents/how-to-manage-agents-stop.png)](media/how-to-manage-agents/how-to-manage-agents-stop.png#lightbox)
5. Confirm the operation.

Note

The operation might take a few minutes to complete. Refresh the **Assets** pane to verify the updated status.

After you stop the agent, the **Status** value of the agent in Foundry is **Stopped**.

To start the agent:

1. Select **Update status**, and then select **Start**.
2. Confirm the operation.

### Block and unblock agents

For [custom agents](register-custom-agent), Foundry doesn't have access to the underlying infrastructure where the agent runs, so start and stop operations aren't available. However, Foundry can block incoming requests to the agent. Blocking prevents clients from using the agent. This capability allows administrators to disable an agent if it misbehaves.

To block incoming requests to your agent:

1. On the toolbar, select **Operate**.
2. On the left pane, select **Assets**.
3. Select the agent that you want to block. The information pane appears.
4. Select **Update status**, and then select **Block**.

    [![Screenshot of steps for blocking incoming requests to an agent.](media/register-custom-agent/register-custom-agent-block.png)](media/register-custom-agent/register-custom-agent-block.png#lightbox)
5. Confirm the operation.

After you block the agent, the **Status** value of the agent in Foundry is **Blocked**. Agents in the **Blocked** state run in their associated infrastructure but can't take incoming requests. Foundry blocks any attempt to communicate with the agent.

Note

The operation might take a few minutes to complete. Refresh the **Assets** pane to verify the updated status.

To unblock the agent:

1. Select **Update status**, and then select **Unblock**.
2. Confirm the operation.

### Handle unknown states

Under certain circumstances, agents can display the status **Unknown**. This status indicates that Foundry Control Plane can't determine the agent's state because the source platform is unavailable or the agent failed to report back.

To troubleshoot an **Unknown** status:

1. Verify that the source platform (for example, Azure Logic Apps or Azure SRE Agent) is operational.
2. For custom agents, confirm the agent's infrastructure is running and accessible.
3. Check the agent's Application Insights logs for error traces.
4. If the status doesn't resolve, try stopping and restarting the agent.

## Troubleshooting

### Observability data isn't visible

If metrics like error rate, token usage, or cost don't appear for an agent:

1. Verify that [Application Insights is configured](monitoring-across-fleet#configure-monitoring) for the resource that hosts the agent.
2. Confirm you have the [required permissions](monitoring-across-fleet#prerequisites) to view Application Insights data and cost metrics.
3. Run the agent after you configure Application Insights. Metrics and traces are collected only for runs that occur after configuration. Past runs aren't retroactively captured.
4. Wait up to 15 minutes for data to propagate after the first post-configuration run.

### Agent doesn't appear in inventory

If an expected agent doesn't appear in the **Assets** pane:

1. Confirm the agent is in a supported platform.
2. Verify you have RBAC permissions on the resource that hosts the agent.
3. Check that the agent is within the currently selected subscription.
4. For custom agents, verify the agent is [registered in a Foundry project](register-custom-agent).