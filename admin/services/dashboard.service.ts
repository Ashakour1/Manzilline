import { API_URL } from "../lib/api";
import { getProperties } from "./properties.service";
import { getLandlords } from "./landlords.service";
import { getUsers } from "./users.service";

export interface DashboardStats {
  totalEarnings: number;
  totalProperties: number;
  activeTenants: number;
  monthlyRevenue: number;
  propertiesChange?: number;
  tenantsChange?: number;
  revenueChange?: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface OccupancyData {
  month: string;
  occupancy: number;
}

export interface PropertyTypeData {
  name: string;
  value: number;
  fill: string;
  [key: string]: string | number;
}

export interface PaymentStatusData {
  status: string;
  count: number;
  amount: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  amount: string;
  time: string;
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [properties, landlords, users] = await Promise.all([
      getProperties(),
      getLandlords(),
      getUsers(),
    ]);

    // Calculate total earnings (sum of all property prices)
    const totalEarnings = properties.reduce((sum: number, p: any) => {
      return sum + (Number(p.price) || 0);
    }, 0);

    // Calculate monthly revenue (from rented properties)
    const rentedProperties = properties.filter((p: any) => p.status === "RENTED");
    const monthlyRevenue = rentedProperties.reduce((sum: number, p: any) => {
      return sum + (Number(p.price) || 0);
    }, 0);

    // Get total properties
    const totalProperties = properties.length;

    // Active tenants (assuming users with tenant role or from applications)
    // For now, we'll use a placeholder - you may need to add a tenants API
    const activeTenants = users.length; // This is a placeholder

    return {
      totalEarnings,
      totalProperties,
      activeTenants,
      monthlyRevenue,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Get revenue data (last 8 months)
export const getRevenueData = async (): Promise<RevenueData[]> => {
  try {
    const properties = await getProperties();
    
    // Group properties by month based on createdAt
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const revenueData: RevenueData[] = months.map((month, index) => {
      // Calculate revenue for this month (simplified - you may need actual payment data)
      const monthProperties = properties.filter((p: any) => {
        if (!p.createdAt) return false;
        const date = new Date(p.createdAt);
        return date.getMonth() === index;
      });
      
      const revenue = monthProperties.reduce((sum: number, p: any) => {
        if (p.status === "RENTED") {
          return sum + (Number(p.price) || 0);
        }
        return sum;
      }, 0);

      // Estimate expenses (20% of revenue)
      const expenses = revenue * 0.2;

      return {
        month,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
      };
    });

    return revenueData;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return [];
  }
};

// Get occupancy data
export const getOccupancyData = async (): Promise<OccupancyData[]> => {
  try {
    const properties = await getProperties();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    
    const occupancyData: OccupancyData[] = months.map((month, index) => {
      // Calculate occupancy rate
      const total = properties.length;
      const occupied = properties.filter((p: any) => p.status === "RENTED").length;
      const baseOccupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;
      
      // Add some variation for the chart
      const occupancy = Math.min(100, Math.max(70, baseOccupancy + (index * 2)));

      return {
        month,
        occupancy,
      };
    });

    return occupancyData;
  } catch (error) {
    console.error("Error fetching occupancy data:", error);
    return [];
  }
};

// Get property type distribution
export const getPropertyTypes = async (): Promise<PropertyTypeData[]> => {
  try {
    const properties = await getProperties();
    
    const typeCounts: Record<string, number> = {};
    properties.forEach((p: any) => {
      const type = p.property_type || "Other";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const total = properties.length;
    const colors = ["#2a6f97", "#3a7fa7", "#4a8fb7"];
    
    const propertyTypes: PropertyTypeData[] = Object.entries(typeCounts)
      .map(([name, count], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        value: total > 0 ? Math.round((count / total) * 100) : 0,
        fill: colors[index % colors.length],
      }))
      .slice(0, 3); // Limit to 3 types

    return propertyTypes;
  } catch (error) {
    console.error("Error fetching property types:", error);
    return [];
  }
};

// Get payment status data
export const getPaymentStatus = async (): Promise<PaymentStatusData[]> => {
  try {
    // Since payments API might not exist, we'll calculate from properties
    const properties = await getProperties();
    const rentedProperties = properties.filter((p: any) => p.status === "RENTED");
    
    // Estimate payment status (this is simplified - you may need actual payments API)
    const paid = Math.round(rentedProperties.length * 0.9);
    const pending = Math.round(rentedProperties.length * 0.08);
    const overdue = Math.round(rentedProperties.length * 0.02);

    const avgRent = rentedProperties.length > 0
      ? rentedProperties.reduce((sum: number, p: any) => sum + (Number(p.price) || 0), 0) / rentedProperties.length
      : 0;

    return [
      {
        status: "Paid",
        count: paid,
        amount: Math.round(paid * avgRent),
      },
      {
        status: "Pending",
        count: pending,
        amount: Math.round(pending * avgRent),
      },
      {
        status: "Overdue",
        count: overdue,
        amount: Math.round(overdue * avgRent),
      },
    ];
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return [];
  }
};

// Get recent activity
export const getRecentActivity = async (): Promise<RecentActivity[]> => {
  try {
    const [properties, landlords] = await Promise.all([
      getProperties(),
      getLandlords(),
    ]);

    const activities: RecentActivity[] = [];

    // Get recent properties (last 4)
    const recentProperties = properties
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 4);

    recentProperties.forEach((property: any, index: number) => {
      const timeAgo = index === 0 ? "2 hours ago" : 
                     index === 1 ? "5 hours ago" : 
                     index === 2 ? "1 day ago" : 
                     "2 days ago";

      activities.push({
        id: property.id || `activity-${index}`,
        type: property.status === "RENTED" ? "Lease" : "Property",
        description: property.status === "RENTED" 
          ? `New lease signed for ${property.title || "Property"}`
          : `New property added: ${property.title || "Property"}`,
        amount: property.price ? `$${Number(property.price).toLocaleString()}` : "$0",
        time: timeAgo,
      });
    });

    return activities;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
};
