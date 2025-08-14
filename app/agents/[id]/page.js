import React, { Fragment } from "react";
import BreadcrumbSchema from "@/components/SeoSetup/BreadcrumbSchema";
import AgentDetailsPage from "@/components/AgentsCarousel/AgentDetailsPage";
import { GenerateMetadata } from "@/utils/metadata";

const fetchAgent = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
    );

    if (!response.ok) {
      throw new Error("Agent not found");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching agent:", error);
  }
};

export async function generateMetadata({ params }) {
  const agent = await fetchAgent(params.id);
  // console.log(agent);
  return GenerateMetadata.agent(agent);
}

const page = async ({ params }) => {
  const agent = await fetchAgent(params.id);

  const breadcrumbs = [
    { name: "Home", url: "https://cpmarket.in" },
    { name: "Agents", url: "https://cpmarket.in/agents" },
  ];

  return (
    <Fragment>
      <AgentDetailsPage params={params} agentDetails={agent} />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
    </Fragment>
  );
};

export default page;
