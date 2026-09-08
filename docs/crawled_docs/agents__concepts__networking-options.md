<!-- Title: Networking Options and Isolation | URL: agents/concepts/networking-options -->

---
layout: Conceptual
title: Networking options for Foundry Agent Service - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options
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
author: aahill
learn_banner_products:
- azure
manager: mcleans
ms.author: aahi
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Compare the networking options for Microsoft Foundry Agent Service, map them to your isolation and connectivity goals, and pick the right deployment template.
ms.manager: mcleans
ms.subservice: foundry-agent-service
ms.topic: concept-article
ms.date: 2026-06-29T00:00:00.0000000Z
ms.custom: references_regions, doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: 373ce382-27a7-fa95-543f-13fa8738f514
document_version_independent_id: 647764b9-2bf3-1970-1f94-ff9c7b4d4362
updated_at: 2026-06-29T22:16:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/agents/concepts/networking-options.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/7d609bc95918be57c5946d0361111329478c428f/articles/foundry/agents/concepts/networking-options.md
git_commit_id: 7d609bc95918be57c5946d0361111329478c428f
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1579
asset_id: foundry/agents/concepts/networking-options
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/agents/concepts/networking-options.md
cmProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/20ed8455-bc18-4537-87a4-83784e7b2a39
spProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/9a7f703b-30bb-4d62-9eb4-97213f571849
platformId: 4af31408-d7fb-bdd9-dc31-ed2750f1560d
---

# Networking options for Foundry Agent Service - Microsoft Foundry | Microsoft Learn

Microsoft Foundry Agent Service supports several networking options, from a fully public setup for rapid prototyping to complete network isolation inside your own virtual network. This article compares the options, maps each one to common goals, and points you to the deployment template and configuration guide for the option you choose.

After you choose an option, follow the linked how-to to deploy it, then validate the deployment. If you hit problems, use the linked troubleshooting guidance.

## Default networking behavior

When you create a Foundry resource without any networking configuration, you get a fully public baseline:

- **Inbound:** the Foundry endpoint is reachable over the public internet. Any caller with a valid credential and the endpoint URL can reach it.
- **Outbound:** agents reach your data and Azure resources over public networking, and can reach only internet-accessible endpoints.
- **Storage:** agent state uses Microsoft-managed storage by default. If you bring your own storage and other Azure resources, you configure network access to those resources as part of your networking setup.

Nothing is private until you choose one of the options in the next section. Each option changes the inbound side, the outbound side, or both.

## Networking options

A networking configuration combines two related decisions:

- **Outbound (egress) access:** how your agents reach your data and other Azure resources. This decision determines the main isolation: keep egress public, or confine it to a virtual network so traffic stays on your private network. The virtual network can be one you bring and manage (BYO virtual network) or one Microsoft manages for you.
- **Inbound access:** which networks can reach your Foundry endpoint. Either public (optionally restricted to selected IP addresses) or private through a private endpoint.

The two decisions are connected. When you isolate egress in a virtual network, inbound access to the Foundry endpoint also goes through a private endpoint, because the resources in that virtual network reach the endpoint over the private network. Start with the egress model, because that choice determines isolation and the inbound options available to you. The following table shows the three egress models and the inbound choices available with each.

| Egress model | Inbound choices | Best for |
| --- | --- | --- |
| **Public egress** | Public (optionally selected IP addresses), or a private endpoint in your virtual network | No egress isolation. Use public inbound for prototyping and tests, or a private endpoint to restrict callers while egress stays public. |
| **BYO virtual network** | Private endpoint in your virtual network | Full isolation where you control IP ranges, peering, and routing. Agents are injected into a subnet you delegate and manage. |
| **Managed virtual network** | Private endpoint in your virtual network | Full isolation without managing IP ranges, or when your IP space overlaps. Agents run in a Microsoft-managed virtual network. |

With public egress, adding a private endpoint secures only the inbound path: callers reach the Foundry endpoint privately, but agent egress isn't isolated.

With BYO virtual network, you can bring your own data resources or use platform-managed data resources. For more information, see Bring-your-own virtual network requirements.

Note

Network isolation applies at the Foundry account and project level. It covers hosted agents, prompt agents, and the other Foundry resources in the account. The two agent types consume network resources differently inside an isolated setup. For details, see [Deep dive into Foundry Agent Service networking](agents-networking-deep-dive).

## Networking options by scenario

The following table maps common goals to a recommended option and a deployment template. The infrastructure-as-code templates are in the [Foundry samples infrastructure setup repository](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep) (Bicep, with a Terraform mirror).

| Your goal | Recommended option | Deploy with |
| --- | --- | --- |
| Fastest path to a working agent, no isolation | Public, Microsoft-managed storage | [Deploy your first hosted agent quickstart](../quickstarts/quickstart-hosted-agent) (Azure Developer CLI or VS Code) |
| Keep agent data in your own Azure resources, no isolation | Public, bring-your-own storage (standard) | [`41-standard-agent-setup`](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/41-standard-agent-setup) |
| Restrict who can call the endpoint, public egress is acceptable | Public egress with a private endpoint | [`10-private-network-basic`](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/10-private-network-basic) |
| Full isolation with no public egress, you control the network and want to bring your own data resources | BYO virtual network with bring-your-own data resources (network-secured standard) | [`15-private-network-standard-agent-setup`](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/15-private-network-standard-agent-setup) |
| Full isolation with no public egress, you control the network but don't want to manage data resources | BYO virtual network with platform-managed data resources | [`11-private-network-basic-vnet`](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/11-private-network-basic-vnet) |
| Full isolation, but you can't manage IP ranges or your IP space overlaps | Managed virtual network | [`18-managed-virtual-network`](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/18-managed-virtual-network) |
| Full isolation behind an API gateway | BYO virtual network with Azure API Management | [`16-private-network-standard-agent-apim-setup`](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/16-private-network-standard-agent-apim-setup) |
| Reach on-premises resources from agents | BYO virtual network plus VPN or ExpressRoute | [`15-private-network-standard-agent-setup`](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep/15-private-network-standard-agent-setup) plus [Access on-premises resources](../../how-to/access-on-premises-resources) |

For the full template catalog and what each one provisions, see the [infrastructure setup README](https://github.com/microsoft-foundry/foundry-samples/tree/main/infrastructure/infrastructure-setup-bicep#readme).

## Bring-your-own virtual network requirements

Both BYO virtual network and managed virtual network provide full isolation. The difference is who runs the network: with managed virtual network, Microsoft handles the requirements in this section for you. Choose BYO virtual network when you want full control of a network you already manage - your own IP ranges, firewall, peering, and routing.

When you choose BYO virtual network, plan for these requirements before you deploy. The [setup how-to](../how-to/virtual-networks) and the [deep dive](agents-networking-deep-dive) cover them in full.

- **A dedicated, delegated subnet.** Delegate a subnet to `Microsoft.App/environments`. The subnet can't be shared by more than one Foundry resource. Size it for the scale you expect; see Plan your subnet size.
- **RFC 1918 address space only.** Use `10.0.0.0/8`, `172.16.0.0/12`, or `192.168.0.0/16`. Public and CGNAT ranges aren't supported. Class A (`10.x`) ranges are only available in certain regions.
- **Your choice of data resources.**With BYO virtual network, you choose how agent data resources (Azure Storage, Azure AI Search, and Azure Cosmos DB) are provided:
    - **Platform-managed data resources.** Use multitenant, platform-managed data resources so you don't bring or configure your own. Choose this option when your agents don't need customer-managed data resources—for example, many hosted-agent scenarios—or when you want to avoid capacity planning for resources like Azure Cosmos DB. This option removes the need to set up data resources you don't use.
    - **Bring-your-own data resources.** Use your own Azure Storage, Azure AI Search, and Azure Cosmos DB so all agent data stays in your tenant. Choose this option when you need agent data in resources you own and manage.
- **Private endpoints and Private DNS zones** for the Foundry account, and for each data resource you bring, so name resolution stays inside the virtual network.
- **Same region for the Foundry resource and the virtual network.** Other resources can be in different regions, with cross-region cost implications.

Important

Set the virtual network configuration when you create the Foundry account. Network injection is part of the create-resource flow and can't be added to an existing account. The network configuration takes effect when you create the first hosted agent, and you can't change the network injection afterward. To move to a different network configuration, create new projects. The configuration applies at the account level, so it covers both hosted and prompt agents. Decide on a BYO virtual network before you create the account.

For a topology diagram of the BYO virtual network option - the delegated subnet, hosted-agent Micro VMs, and private endpoints to your data resources - see [Deep dive into Foundry Agent Service networking](agents-networking-deep-dive#network-architecture-overview).

### Tool support with network isolation

Not all agent tools support network isolation. Some tools aren't supported behind a virtual network, and some reach their destination over the public internet rather than your private network. Before you commit to an isolated setup, check [Agent tools with network isolation](../../how-to/configure-private-link#agent-tools-with-network-isolation) to confirm that the tools your agents use are supported.

### Plan your subnet size

The subnet must be at least /27, and you can't change its size after you assign it, so size it for the scale you expect. All projects in the Foundry account share the subnet, so plan for the combined usage of every project, agent, and concurrent session in the account. Azure reserves five IP addresses in every subnet for internal use.

- **Hosted agents** run in a dedicated Micro VM with its own network interface, so each one consumes an IP address from the subnet. IP usage scales with the number of projects, the hosted agents in each project, and their concurrent sessions. New revisions also consume IP addresses temporarily during rollout, when old and new revisions run in parallel.
- **Prompt agents** don't consume an IP address per revision. They use a small, static pool of IP addresses (up to about 10 per project), regardless of how many prompt agents or revisions you run.

| Subnet size | Recommendation |
| --- | --- |
| **/24** | Recommended for production with hosted agents. Leaves headroom to scale hosted agents across projects, support concurrent sessions, and absorb in-place upgrades. |
| **/27** | Supported minimum. Works for production when you run prompt agents, or for smaller hosted-agent deployments. Leaves less headroom for scaling hosted agents and concurrent sessions. |

For the IP-allocation model, concurrent-session limits, and sizing math, see [Deep dive into Foundry Agent Service networking](agents-networking-deep-dive).

## Hosted agents compared to prompt agents

The networking option applies to your whole Foundry account, but the two agent types consume network resources differently, as described in Plan your subnet size. Both types reach your resources through private endpoints in your virtual network.