<!-- Title: Govern MCP tools with AI gateway | URL: agents/how-to/tools/governance -->

---
layout: Conceptual
title: Govern MCP Tools by Using an AI Gateway - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance
breadcrumb_path: ../../../../breadcrumb/azure-ai/toc.json
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
author: mattwojo
learn_banner_products:
- azure
manager: mcleans
ms.author: mattwoj
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how to govern MCP tools by using an AI gateway in Microsoft Foundry. Apply rate limits, IP filters, and routing policies by using Azure API Management.
services: cognitive-services
ms.subservice: foundry-agent-service
ms.topic: how-to
ms.date: 2026-08-19T00:00:00.0000000Z
reviewer: lindazqli
ms.reviewer: zhuoqunli
ms.custom: azure-ai-agents,  pilot-ai-workflow-jan-2026, doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: a3fc3918-dae3-9d38-8a3c-f2db56387d5a
document_version_independent_id: 435aab90-22e9-05aa-5260-5bb03e08b687
updated_at: 2026-08-27T06:04:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/agents/how-to/tools/governance.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/98b7b1700c3cf43ecb2c8c80f728ff55c355ff8d/articles/foundry/agents/how-to/tools/governance.md
git_commit_id: 98b7b1700c3cf43ecb2c8c80f728ff55c355ff8d
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../../toc.json
word_count: 1214
asset_id: foundry/agents/how-to/tools/governance
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/agents/how-to/tools/governance.md
cmProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/bf4dbf7f-261c-4ae9-9fee-5989668a780a
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
spProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/1c4b5d48-3f26-4bd8-9592-816d9c1a3420
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
platformId: e9c63f96-52b9-3524-685e-75130f7b08fb
---

# Govern MCP Tools by Using an AI Gateway - Microsoft Foundry | Microsoft Learn

Control how your agents access external tools by routing Model Context Protocol (MCP) traffic through an [AI gateway](https://learn.microsoft.com/en-us/azure/foundry/../../configuration/enable-ai-api-management-gateway-portal) in Microsoft Foundry. An AI gateway provides a single, governed entry point where you can enforce authentication, rate limits, IP restrictions, and audit logging without modifying your MCP servers or agent code.

This feature is in preview. Only new MCP tools created in the Foundry portal that don't use managed OAuth are routed through an AI gateway.

## Prerequisites

- The AI gateway must be connected to the Microsoft Foundry resource. Follow the steps in [Configure an AI gateway in your Foundry resources](https://learn.microsoft.com/en-us/azure/foundry/../../configuration/enable-ai-api-management-gateway-portal).

    Governance is activated at the Microsoft Foundry resource level. All governance functionality depends on this connection.
- You need permissions to manage API Management policies: the API Management Service Contributor or Owner role on the connected API Management instance. For more information, see [Use role-based access control for API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-role-based-access-control).
- The MCP server must support one of the following authentication methods:

    - Managed identity (Microsoft Entra)
    - Key-based (API key or token)
    - Custom OAuth identity passthrough
    - Unauthenticated (if applicable)

## Key benefits

- Secure routing for all new MCP tools through a gateway endpoint
- Consistent access control and authentication enforcement
- Centralized observability for gateway traffic (such as logs and metrics)
- Unified policies for throttling, IP restrictions, and routing
- Seamless reuse of tools through public and private catalogs

## Govern a tool

The following sections walk you through setting up an AI gateway as a governed entry point.

### Add a tool

To add a tool to be governed, use either of these methods in the Foundry portal:

- Use the tool catalog by selecting **Tools** &gt; **Catalog**. Then choose an MCP server to add.
- Add a custom tool by selecting **Build** &gt; **Tools** &gt; **Custom** &gt; **Model Context Protocol**. Then paste your MCP server endpoint and select an authentication type.

After you add the tool, verify that the MCP server endpoint in the tool configuration displays the AI gateway URL (for example, `https://<your-API-Management-instance>.azure-api.net/mcp/...`) rather than the direct MCP server URL.

For more information about MCP tools, see [Connect to Model Context Protocol servers](https://learn.microsoft.com/en-us/azure/foundry/model-context-protocol).

### Confirm routing

Before you apply policies, confirm these settings in the Foundry portal:

- **Remote MCP server endpoint**: Verify that it points to the AI gateway URL, not the original MCP server.
- **Redirect URL**: If you use custom OAuth identity passthrough, confirm that the redirect URL matches your OAuth app registration.
- **Authentication method**: Confirm the method (key-based or OAuth) aligns with your MCP server requirements.
- **Agent usage**: Note which agents reference this tool so you can test after applying policies.

### Apply policies

In the [Azure portal](https://portal.azure.com/), go to your resource. Select **API Management** to apply [policies](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-policies) for governance.

You must apply policies through Azure API Management. Common policies include:

- **Rate limiting**: Limit how many calls a project or user can make in one minute.

    ```xml
    <inbound>
      <base />
      <rate-limit-by-key calls="60" renewal-period="60" counter-key="@(context.Request.IpAddress)" />
    </inbound>
    ```
- **IP filtering**: Allow requests from only trusted networks.

    ```xml
    <inbound>
      <base />
      <ip-filter action="allow">
        <address>10.0.0.0/24</address> <!-- internal network -->
        <address>20.50.123.45</address> <!-- trusted app -->
      </ip-filter>
    </inbound> 
    ```
- **Correlation ID**: Add a unique request ID so that you can trace requests later in logs.

    ```xml
    <inbound>
      <base />
        <set-header name="X-Correlation-Id" exists-action="override"> 
        <value>@(context.RequestId)</value>
      </set-header>
    </inbound>
    ```
- **Removal of sensitive headers**: Clean up incoming requests to help protect credentials or session data.

    ```xml
    <inbound>
      <base />
      <set-header name="Cookie" exists-action="delete" />
      <set-header name="Referer" exists-action="delete" />
    </inbound>
    ```

    Important

    Avoid deleting authentication headers (such as `Authorization`) unless you're sure that the MCP server doesn't require them.
- **Simple routing control**: If you have different backends (like ones for different geographies), you can route requests based on a header.

    ```xml
    <inbound>
      <base />
      <choose>
        <when condition="@(context.Request.Headers.GetValueOrDefault('X-Region','us') == 'eu')">
          <set-backend-service base-url="https://europe-api.contoso-mcp.net" />
        </when>
        <otherwise>
          <set-backend-service base-url="https://us-api.contoso-mcp.net" />
        </otherwise>
      </choose>
    </inbound>
    ```

For more policy XML examples, see the [API Management policy snippets](https://github.com/Azure/api-management-policy-snippets) repository on GitHub.

### Test with an agent

After you configure your MCP server, you can test it in the Foundry portal:

1. Open the [Foundry portal](https://ai.azure.com/) and go to your project.
2. Create a new agent or open an existing one, and configure an MCP tool. For details, see [Connect to Model Context Protocol servers](https://learn.microsoft.com/en-us/azure/foundry/model-context-protocol).
3. In the agent's chat interface, send a message that triggers the tool (for example, "List my repositories" for the GitHub MCP server). Verify that the response returns successfully.

## Verify that governance is working

Use these steps to confirm that traffic is routed through the AI gateway and policies are applied:

1. In the Foundry portal, open your MCP tool configuration. Confirm that the tool endpoint points to the AI gateway (not directly to your MCP server).
2. In the Azure portal, open the API Management instance connected to your Foundry resource. Review metrics and logs to confirm that requests appear when your agent calls the tool.

When you're reviewing API Management metrics:

- Look for requests where the name of the API Management instance matches your MCP tool.
- Check **Response codes** for successful calls (2xx) and policy-blocked calls (429 for rate limits, 403 for IP filters).
- If you applied rate limiting, verify that the **X-RateLimit-Remaining** header decreases with each call.
- For log-level details, enable **Diagnostic settings** on your API Management instance and query Azure Monitor Logs.

## Security considerations

- Treat API keys, tokens, and OAuth client secrets as secrets. Store shared credentials in a project connection and limit project access to authorized users.
- Apply the least-privilege principle for managed identity and Microsoft Entra access.
- Review which headers you forward to backends. Remove only headers that you don't need, and avoid stripping required authentication headers.

For MCP authentication options, see [Set up authentication for Model Context Protocol (MCP) tools (preview)](https://learn.microsoft.com/en-us/azure/foundry/mcp-authentication).

## Troubleshooting

| Problem | Cause | Resolution |
| --- | --- | --- |
| The tool still calls the MCP server directly. | The tool was created before the AI gateway was connected, or the tool isn't eligible for gateway routing (for example, it uses managed OAuth). | Re-create the tool after the AI gateway is connected. Confirm that the tool is an MCP tool that doesn't use managed OAuth. |
| Tool calls fail after you add API Management policies. | A policy blocks traffic (rate limits, IP filtering) or modifies headers that the MCP server requires. | Temporarily disable policies to isolate the cause, and then refine the policy conditions. Avoid deleting required authentication headers. |
| OAuth sign-in fails for custom OAuth identity passthrough. | Redirect URL or OAuth app configuration is incorrect. | Re-check the redirect URL in your OAuth app registration and confirm required OAuth settings. For options and terminology, see [Set up authentication for Model Context Protocol (MCP) tools (preview)](https://learn.microsoft.com/en-us/azure/foundry/mcp-authentication). |
| You don't see request traces in the AI gateway. | The AI gateway doesn't log tool traces. | Use API Management logging and metrics for gateway traffic. Use your MCP server logs for tool-level details. |

## Limitations

- AI gateways support only MCP tools. Foundry-based tools such as SharePoint, code-first MCP tools, tools with managed OAuth, or OpenAPI tools aren't supported.
- AI gateways don't log tool traces.
- Gateway routing is applied only at tool creation. Existing tools aren't automatically mediated with AI gateways.
- API gateways support the application of API Management policies only in the Azure portal, not the Foundry portal.

For a broader list of Foundry Agent Service tool support when you're working with gateways, see [Bring your own AI gateway to Azure AI Agent Service (preview)](https://learn.microsoft.com/en-us/azure/foundry/ai-gateway).