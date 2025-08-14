// components/schemas/FAQSchema.js
import React from "react";

const FAQSchema = ({ faqs }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs?.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })) || [
      {
        "@type": "Question",
        name: "How can I list my property on cpmarket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can list your property on cpmarket by creating an account, clicking on 'List Property', and filling out the property details form. Our team will verify the listing within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: "Are all properties on cpmarket verified?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all properties listed on cpmarket go through a verification process to ensure authenticity and accuracy of information provided.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact a property agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can contact property agents directly through their profile page, property listings, or by using the contact form available on each property page.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default FAQSchema;
