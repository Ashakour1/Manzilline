import { API_URL, getAuthHeaders } from "../lib/api";

export interface PropertyApplication {
  id: string;
  propertyId: string;
  tenantId: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    city: string;
    address: string;
    property_type: string;
    status: string;
    images: Array<{ url: string }>;
  };
}

// Get current user's property applications
export const getMyPropertyApplications = async (): Promise<PropertyApplication[]> => {
  try {
    // First get the current user to get their ID
    const userResponse = await fetch(`${API_URL}/users/me`, {
      headers: getAuthHeaders(),
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user");
    }

    const user = await userResponse.json();

    // Then get their applications
    const response = await fetch(`${API_URL}/property-applications/tenant/${user.id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch property applications");
    }

    const applications = await response.json();
    return applications;
  } catch (error) {
    console.error("Error fetching property applications:", error);
    throw error;
  }
};

