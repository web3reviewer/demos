import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const requestData = req.body;
  console.log("requestData", requestData);

  try {
    const email = requestData.requestedInfo?.email;
    const physicalAddress = requestData.requestedInfo?.physicalAddress;
    type PhysicalAddressError = { postalCode?: string; countryCode?: string };
    type Errors = { email?: string; physicalAddress?: PhysicalAddressError };
    const errors: Errors = {};
    if (email && email.endsWith("@example.com")) {
      errors.email = "Example.com emails are not allowed";
    }
    if (physicalAddress) {
      if (physicalAddress.postalCode && physicalAddress.postalCode.length < 5) {
        if (!errors.physicalAddress) errors.physicalAddress = {};
        errors.physicalAddress.postalCode = "Invalid postal code";
      }
      if (physicalAddress.countryCode === "XY") {
        if (!errors.physicalAddress) errors.physicalAddress = {};
        errors.physicalAddress.countryCode = "We don't ship to this country";
      }
    }
    if (Object.keys(errors).length > 0) {
      return res.status(200).json({ errors });
    }
    return res.status(200).json({
      calls: requestData.calls,
      chainId: requestData.chainId,
      version: requestData.version,
      capabilities: requestData.capabilities
    });
  } catch (error) {
    console.error("Error processing data:", error);
    return res.status(500).json({ errors: { server: "Server error validating data" } });
  }
}
