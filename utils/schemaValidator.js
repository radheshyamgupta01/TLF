// utils/schemaValidator.js
export const SchemaValidator = {
  // Validate basic schema structure
  validateSchema: (schema) => {
    const errors = [];
    const warnings = [];

    // Check required fields
    if (!schema["@context"]) {
      errors.push("Missing @context field");
    }
    if (!schema["@type"]) {
      errors.push("Missing @type field");
    }

    // Check for common issues
    if (schema["@context"] !== "https://schema.org") {
      warnings.push("Consider using https://schema.org as @context");
    }

    return { errors, warnings, isValid: errors.length === 0 };
  },

  // Validate property schema
  validatePropertySchema: (property) => {
    const errors = [];
    const warnings = [];

    // Required fields for real estate listing
    const requiredFields = ["name", "description", "url"];
    requiredFields.forEach((field) => {
      if (!property[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Check price specification
    if (property.priceSpecification) {
      if (!property.priceSpecification.price) {
        warnings.push("Price specification missing price value");
      }
      if (!property.priceSpecification.priceCurrency) {
        warnings.push("Price specification missing currency");
      }
    }

    // Check address
    if (property.mainEntity?.address) {
      const address = property.mainEntity.address;
      if (!address.addressLocality && !address.addressRegion) {
        warnings.push("Address missing locality or region");
      }
    }

    return { errors, warnings, isValid: errors.length === 0 };
  },

  // Validate agent schema
  validateAgentSchema: (agent) => {
    const errors = [];
    const warnings = [];

    if (!agent.name) {
      errors.push("Agent name is required");
    }
    if (!agent.telephone && !agent.email) {
      warnings.push("Agent should have at least phone or email contact");
    }

    return { errors, warnings, isValid: errors.length === 0 };
  },

  // Generate test schema for development
  generateTestSchema: (type, sampleData = {}) => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": type,
    };

    switch (type) {
      case "RealEstateListing":
        return {
          ...baseSchema,
          name: sampleData.name || "Test Property",
          description: sampleData.description || "A beautiful test property",
          url: sampleData.url || "https://cpmarket.in/properties/test",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: sampleData.price || "50000",
            priceCurrency: "INR",
          },
          mainEntity: {
            "@type": "Apartment",
            name: sampleData.name || "Test Property",
            numberOfRooms: sampleData.bedrooms || 2,
            address: {
              "@type": "PostalAddress",
              addressLocality: sampleData.city || "Mumbai",
              addressRegion: sampleData.state || "Maharashtra",
              addressCountry: "IN",
            },
          },
        };

      case "RealEstateAgent":
        return {
          ...baseSchema,
          name: sampleData.name || "Test Agent",
          telephone: sampleData.phone || "+91-9999999999",
          email: sampleData.email || "test@cpmarket.in",
          jobTitle: "Real Estate Agent",
          worksFor: {
            "@type": "Organization",
            name: "cpmarket",
          },
        };

      default:
        return baseSchema;
    }
  },

  // Check schema against Google's structured data guidelines
  checkGoogleGuidelines: (schema) => {
    const suggestions = [];

    // Check for required properties based on type
    if (schema["@type"] === "RealEstateListing") {
      if (!schema.image) {
        suggestions.push(
          "Consider adding image property for better rich results"
        );
      }
      if (!schema.priceSpecification) {
        suggestions.push(
          "Add price specification for better property search results"
        );
      }
      if (!schema.mainEntity?.address) {
        suggestions.push(
          "Add address information for location-based search results"
        );
      }
    }

    if (schema["@type"] === "RealEstateAgent") {
      if (!schema.image) {
        suggestions.push("Add agent photo for better profile display");
      }
      if (!schema.areaServed) {
        suggestions.push("Specify service areas for local search optimization");
      }
    }

    // Check for common optimization opportunities
    if (
      !schema.aggregateRating &&
      (schema["@type"] === "RealEstateListing" ||
        schema["@type"] === "RealEstateAgent")
    ) {
      suggestions.push(
        "Consider adding aggregate rating for enhanced search results"
      );
    }

    return suggestions;
  },

  // Format schema for testing tools
  formatForTesting: (schema) => {
    return JSON.stringify(schema, null, 2);
  },

  // Generate schema testing URLs
  getTestingUrls: (url) => {
    const encodedUrl = encodeURIComponent(url);
    return {
      googleRichResults: `https://search.google.com/test/rich-results?url=${encodedUrl}`,
      googleStructuredData: `https://search.google.com/structured-data/testing-tool?url=${encodedUrl}`,
      schemaMarkup: `https://validator.schema.org/#url=${encodedUrl}`,
      facebookDebugger: `https://developers.facebook.com/tools/debug/?q=${encodedUrl}`,
      twitterValidator: `https://cards-dev.twitter.com/validator?url=${encodedUrl}`,
    };
  },
};

// Schema testing helper for development
export const SchemaTestRunner = {
  // Run all validations
  runAllTests: (schemas) => {
    const results = {};

    Object.keys(schemas).forEach((key) => {
      const schema = schemas[key];
      results[key] = {
        basic: SchemaValidator.validateSchema(schema),
        google: SchemaValidator.checkGoogleGuidelines(schema),
        formatted: SchemaValidator.formatForTesting(schema),
      };
    });

    return results;
  },

  // Generate test report
  generateReport: (testResults) => {
    let report = "# Schema Validation Report\n\n";

    Object.keys(testResults).forEach((schemaName) => {
      const result = testResults[schemaName];
      report += `## ${schemaName}\n\n`;

      if (result.basic.errors.length > 0) {
        report += `### Errors:\n`;
        result.basic.errors.forEach((error) => {
          report += `- ❌ ${error}\n`;
        });
        report += "\n";
      }

      if (result.basic.warnings.length > 0) {
        report += `### Warnings:\n`;
        result.basic.warnings.forEach((warning) => {
          report += `- ⚠️ ${warning}\n`;
        });
        report += "\n";
      }

      if (result.google.length > 0) {
        report += `### Google Guidelines Suggestions:\n`;
        result.google.forEach((suggestion) => {
          report += `- 💡 ${suggestion}\n`;
        });
        report += "\n";
      }

      report += `### Status: ${
        result.basic.isValid ? "✅ Valid" : "❌ Invalid"
      }\n\n`;
      report += "---\n\n";
    });

    return report;
  },
};
