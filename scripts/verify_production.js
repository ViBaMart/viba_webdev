const http = require("http");

async function request(urlPath, options = {}) {
  const url = new URL(urlPath, "http://localhost:3000");
  const defaultHeaders = {
    "X-Forwarded-For": `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
  };
  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: options.method || "GET",
        headers: { ...defaultHeaders, ...(options.headers || {}) },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  const results = {
    passed: [],
    failed: [],
  };

  function assert(name, condition, details = "") {
    if (condition) {
      console.log(`[PASS] ${name}`);
      results.passed.push(name);
    } else {
      console.error(`[FAIL] ${name}: ${details}`);
      results.failed.push({ name, details });
    }
  }

  console.log("=== STARTING VIBA PRODUCTION READINESS TESTS ===");

  // 1. Main Website Navigation
  try {
    const home = await request("/");
    assert(
      "1. Main Website Navigation (Home)",
      home.status === 200 && typeof home.data === "string" && home.data.includes("ViBa"),
      `Status: ${home.status}`
    );
  } catch (err) {
    assert("1. Main Website Navigation (Home)", false, err.message);
  }

  // 2. All Three Website Demos
  try {
    const demo1 = await request("/demos/static-business");
    assert(
      "2a. Demo: Static Business",
      demo1.status === 200 && typeof demo1.data === "string" && demo1.data.includes("html"),
      `Status: ${demo1.status}`
    );

    const demo2 = await request("/demos/dynamic-business");
    assert(
      "2b. Demo: Dynamic Business",
      demo2.status === 200 && typeof demo2.data === "string" && demo2.data.includes("html"),
      `Status: ${demo2.status}`
    );

    const demo3 = await request("/demos/ecommerce");
    assert(
      "2c. Demo: E-commerce",
      demo3.status === 200 && typeof demo3.data === "string" && demo3.data.includes("html"),
      `Status: ${demo3.status}`
    );
  } catch (err) {
    assert("2. Website Demos", false, err.message);
  }

  // 3. Customer Application Submission
  let createdAppId = null;
  try {
    const appRes = await request("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        customerName: "Test Customer Deployment",
        email: "test.deploy@example.com",
        mobileNumber: "+91 9988776655",
        businessName: "Deploy Verification Ltd",
        businessAddress: "123 Tech Park, Phase 1, Bangalore, Karnataka",
        websiteType: "E-commerce Website",
        selectedPackage: "E-commerce Professional",
        businessDescription: "Full-scale direct-to-consumer apparel and accessories enterprise brand.",
        requiredPages: "Home, Shop, Product Catalog, About Us, Cart, Checkout, Support",
        requiredFunctionality: "Razorpay/UPI Payment Gateway, Inventory Stock Sync, Order Notifications",
        preferredDesign: "Minimalist Modern Cyberpunk with Neon Blue & Dark Themes",
        domainRequirement: "I need ViBa to register a new domain for me",
        referenceLinks: "https://example.com/storefront",
        additionalNotes: "Full production deployment verification application test.",
      },
    });

    createdAppId = appRes.data?.data?.id;
    assert(
      "3. Customer Application Submission",
      appRes.status === 201 && appRes.data?.success === true && !!createdAppId,
      `Status: ${appRes.status}, data: ${JSON.stringify(appRes.data)}`
    );
  } catch (err) {
    assert("3. Customer Application Submission", false, err.message);
  }

  // 4. Customer File Upload / Storage API
  try {
    const storageRes = await request("/api/storage");
    assert(
      "4. Storage API Status",
      storageRes.status === 200 && storageRes.data?.data?.service === "ViBa Storage API",
      `Status: ${storageRes.status}, data: ${JSON.stringify(storageRes.data)}`
    );
  } catch (err) {
    assert("4. Customer File Uploads / Storage", false, err.message);
  }

  // 5. Admin Login & Session
  let adminCookie = null;
  try {
    const loginRes = await request("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        email: "admin@vibawebdev.com",
        password: "ViBaAdmin@2026!",
      },
    });

    const setCookie = loginRes.headers["set-cookie"];
    if (setCookie && setCookie.length > 0) {
      adminCookie = setCookie[0].split(";")[0];
    }

    assert(
      "5. Admin Login Authentication",
      loginRes.status === 200 && loginRes.data?.success === true && !!adminCookie,
      `Status: ${loginRes.status}, data: ${JSON.stringify(loginRes.data)}`
    );
  } catch (err) {
    assert("5. Admin Login Authentication", false, err.message);
  }

  // 6. Application Management (Admin view and status update)
  try {
    const listRes = await request("/api/admin/applications", {
      headers: { Cookie: adminCookie || "" },
    });

    const apps = listRes.data?.data || [];
    assert(
      "6a. Admin Application Listing",
      listRes.status === 200 && Array.isArray(apps),
      `Status: ${listRes.status}, count: ${apps.length}`
    );

    if (createdAppId) {
      const updateRes = await request(`/api/admin/applications/${createdAppId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie || "",
        },
        body: { status: "Under Review" },
      });

      assert(
        "6b. Admin Application Status Update",
        updateRes.status === 200 && updateRes.data?.data?.status === "Under Review",
        `Status: ${updateRes.status}`
      );
    }
  } catch (err) {
    assert("6. Application Management", false, err.message);
  }

  // 7. Quotation Generation
  let createdQuotationId = null;
  try {
    const quoteRes = await request("/api/quotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie || "",
      },
      body: {
        applicationId: createdAppId || "VIBA-APP-2026-99999",
        customerName: "Test Customer Deployment",
        businessName: "Deploy Verification Ltd",
        email: "test.deploy@example.com",
        mobileNumber: "+91 9988776655",
        businessAddress: "123 Tech Park, Phase 1, Bangalore, Karnataka",
        websiteType: "E-commerce Website",
        selectedPackage: {
          id: "ecommerce",
          name: "E-Commerce Website",
          price: 18000,
        },
        developmentCharges: {
          description: "Full-Stack Custom Storefront & Admin Portal",
          amount: 5000,
        },
        annualServiceCharges: {
          description: "Cloud Hosting, Domain & Maintenance",
          amount: 3000,
        },
        additionalCharges: [
          { description: "Custom Payment Integration", amount: 2000, approvedByCustomer: true },
        ],
        advancePaymentPercentOrAmount: 10000,
        deliverables: ["Custom store", "Admin portal", "Payment gateway"],
      },
    });

    createdQuotationId = quoteRes.data?.data?.quotation?.id;
    assert(
      "7. Quotation Generation",
      quoteRes.status === 201 && quoteRes.data?.success === true && !!createdQuotationId,
      `Status: ${quoteRes.status}, data: ${JSON.stringify(quoteRes.data)}`
    );
  } catch (err) {
    assert("7. Quotation Generation", false, err.message);
  }

  // 8. Payment Status Management
  try {
    if (createdQuotationId) {
      // Customer submits payment transaction
      const submitPay = await request(`/api/payments/${createdQuotationId}/submit-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          transactionReference: "UPI9876543210REF",
          paymentMethod: "UPI",
          amount: 10000,
          customerNotes: "Advance payment submitted for verification.",
        },
      });

      const submittedTxnId = submitPay.data?.data?.transaction?.id;
      assert(
        "8a. Customer Payment Transaction Submission",
        submitPay.status === 200 && submitPay.data?.success === true && !!submittedTxnId,
        `Status: ${submitPay.status}, data: ${JSON.stringify(submitPay.data)}`
      );

      // Admin verifies payment
      const verifyPay = await request(`/api/payments/${createdQuotationId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie || "",
        },
        body: {
          transactionId: submittedTxnId,
          action: "approve",
          verificationNotes: "Reconciled with HDFC Bank statement.",
        },
      });

      assert(
        "8b. Admin Payment Verification & Confirmation",
        verifyPay.status === 200 && verifyPay.data?.success === true,
        `Status: ${verifyPay.status}, data: ${JSON.stringify(verifyPay.data)}`
      );
    }
  } catch (err) {
    assert("8. Payment Management", false, err.message);
  }

  // 9. Project Tracking
  let createdProjectId = null;
  try {
    const projRes = await request("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie || "",
      },
      body: {
        projectName: "Deploy Verification Storefront",
        clientName: "Test Customer Deployment",
        clientBusiness: "Deploy Verification Ltd",
        clientEmail: "test.deploy@example.com",
        clientMobile: "+91 9988776655",
        quotationId: createdQuotationId || "VIBA-QT-2026-99999",
        applicationId: createdAppId || "VIBA-APP-2026-99999",
        websiteType: "E-Commerce Website",
        totalCost: 28000,
        advancePaid: 10000,
        expectedDeliveryDate: "2026-12-15",
      },
    });

    createdProjectId = projRes.data?.data?.id;
    assert(
      "9a. Admin Project Creation",
      projRes.status === 201 && projRes.data?.success === true && !!createdProjectId,
      `Status: ${projRes.status}, data: ${JSON.stringify(projRes.data)}`
    );

    if (createdProjectId) {
      // Admin update project stage
      const stageUpdate = await request(`/api/admin/projects/${createdProjectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie || "",
        },
        body: {
          stage: "Design",
          note: "Completed initial wireframes and UI designs.",
        },
      });

      assert(
        "9b. Admin Project Stage Update",
        stageUpdate.status === 200 && stageUpdate.data?.data?.stage === "Design",
        `Status: ${stageUpdate.status}`
      );
    }
  } catch (err) {
    assert("9. Project Tracking", false, err.message);
  }

  // 10. Customer Dashboard & Access
  try {
    const custDash = await request("/customer/dashboard");
    assert(
      "10a. Customer Dashboard Page Load",
      custDash.status === 200 && typeof custDash.data === "string",
      `Status: ${custDash.status}`
    );

    // Test customer API with customer token
    const customerPayload = Buffer.from(
      JSON.stringify({
        uid: "cust-test-123",
        email: "test.deploy@example.com",
        name: "Test Customer Deployment",
      })
    ).toString("base64");
    const custToken = `mockHeader.${customerPayload}.mockSignature`;
    const custApi = await request("/api/customer/dashboard", {
      headers: {
        Authorization: `Bearer ${custToken}`,
      },
    });

    assert(
      "10b. Customer Dashboard API Isolation",
      custApi.status === 200 && custApi.data?.success === true,
      `Status: ${custApi.status}, data: ${JSON.stringify(custApi.data)}`
    );
  } catch (err) {
    assert("10. Customer Dashboard", false, err.message);
  }

  // 11. Domain Management
  let createdDomainId = null;
  try {
    const domainRes = await request("/api/domains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie || "",
      },
      body: {
        customerName: "Test Customer Deployment",
        customerEmail: "test.deploy@example.com",
        domainName: "deploytestviba.com",
        registrar: "Cloudflare",
        registrationDate: "2026-01-01",
        expiryDate: "2027-01-01",
        registrationCost: 950,
        renewalCost: 950,
        customerPaymentStatus: "PAID",
      },
    });

    createdDomainId = domainRes.data?.data?.id;
    assert(
      "11a. Admin Domain Registration Record",
      domainRes.status === 201 && domainRes.data?.success === true && !!createdDomainId,
      `Status: ${domainRes.status}`
    );

    // List domains
    const listDomainsRes = await request("/api/domains", {
      headers: { Cookie: adminCookie || "" },
    });

    assert(
      "11b. Admin Domain Listing with Expiry Stats",
      listDomainsRes.status === 200 && !!listDomainsRes.data?.stats,
      `Status: ${listDomainsRes.status}`
    );
  } catch (err) {
    assert("11. Domain Management", false, err.message);
  }

  // 12. API Security & Access Controls
  try {
    // Attempt admin route without auth
    const unauthAdmin = await request("/api/admin/applications");
    assert(
      "12a. Admin API rejects unauthenticated requests",
      unauthAdmin.status === 401,
      `Status: ${unauthAdmin.status} (expected 401)`
    );

    // Customer API rejects unauthenticated requests
    const unauthCust = await request("/api/customer/dashboard");
    assert(
      "12b. Customer API rejects unauthenticated requests",
      unauthCust.status === 401,
      `Status: ${unauthCust.status} (expected 401)`
    );

    // Invalid input rejection
    const invalidApp = await request("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { fullName: "" }, // missing required fields
    });
    assert(
      "12c. API rejects invalid / malformed input",
      invalidApp.status === 400,
      `Status: ${invalidApp.status} (expected 400)`
    );
  } catch (err) {
    assert("12. API Security", false, err.message);
  }

  // 13. Mobile Responsiveness / Layout Checks
  try {
    const layoutRes = await request("/");
    const html = typeof layoutRes.data === "string" ? layoutRes.data : "";
    const hasViewport = html.includes('name="viewport"') || html.includes('width=device-width');
    assert(
      "13. Mobile Viewport & Responsiveness Configured",
      hasViewport,
      "Viewport meta tag verified in server response"
    );
  } catch (err) {
    assert("13. Mobile Responsiveness", false, err.message);
  }

  console.log("=== TESTS COMPLETE ===");
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("FATAL TEST ERROR:", e);
  process.exit(1);
});
