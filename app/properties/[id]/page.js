import React, { Fragment } from "react";
import { property } from "zod";
import PropertySchema from "@/components/SeoSetup/PropertySchema";
import BreadcrumbSchema from "@/components/SeoSetup/BreadcrumbSchema";
import StructuredDataSchema from "@/components/SeoSetup/StructuredDataSchema";
import PropertyDetails from "@/components/property/PropertyDetails";
import { GenerateMetadata } from "@/utils/metadata";

const getPropertyDetails = async (id) => {
  // console.log(id);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch property: ${res.status}`);
    }

    const data = await res.json();
    // console.log(data);

    return data?.data?.listing;
  } catch (error) {
    console.error("Failed to fetch property details:", error);
  }
};

export async function generateMetadata({ params }) {
  const property = await getPropertyDetails(params.id);
  // console.log(property);
  return GenerateMetadata.property(property);
}

const page = ({ params }) => {
  const breadcrumbs = [
    { name: "Home", url: "https://cpmarket.in" },
    { name: "Properties", url: "https://cpmarket.in/properties" },
    {
      name: property.title,
      url: `https://cpmarket.in/properties/${property.id}`,
    },
  ];

  // Additional product schema for the property
  const productData = {
    name: property.title,
    description: property.description,
    images: property.images?.map((img) => img.url),
    price: property.price,
    rating: property.rating,
  };

  return (
    <Fragment>
      <PropertyDetails params={params} />
      <PropertySchema property={property} />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <StructuredDataSchema type="product" data={productData} />
    </Fragment>
  );
};

export default page;
