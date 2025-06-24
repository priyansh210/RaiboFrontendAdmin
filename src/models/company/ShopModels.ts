// External model mirrors API response
export interface ExternalShop {
  id: string;
  name: string;
  location: string;
  owner: string;
  contact: string;
  description: string;
}

// Internal model for app usage
export interface Shop {
  id: string;
  name: string;
  location: string;
  owner: string;
  contact: string;
  description: string;
}
