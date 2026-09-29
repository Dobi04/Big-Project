export type OrganisationSummary = {
  id: number;
  organisationName: string;
  organisationLogo: string | null;
  organisationDescription: string | null;
  visibility: string;
  type: string;
  membersCount: number;
  averageRating: number;
  ratingsCount: number;
  distanceKm: number | null;
};

export type OrganisationDetails = {
  id: number;
  organisationName: string;
  organisationLogo: string | null;
  organisationDescription: string | null;
  ownerId: string;
  ownerUsername: string;
  visibility: string;
  status: string;
  type: string;
  subscriptionType: 'Free' | 'Paid';
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  membersCount: number;
  averageRating: number;
  ratingsCount: number;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};

export type JoinedOrganisation = {
  organisationId: number;
  organisationName: string;
  organisationLogo: string | null;
  organisationDescription: string | null;
  type: string;
  status: string;
  subscriptionType: 'Free' | 'Paid';
  paymentStatus: string;
  myRole: string;
  joinedAt: string;
  memberCount: number;
  unreadNotificationsCount: number;
};