const API_URL = "http://localhost:4000/api";




export const fetchProperties = async () => {
    const response = await fetch(`${API_URL}/properties`);

    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }

    return response.json();
}