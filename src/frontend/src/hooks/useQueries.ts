import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import {
  FarmerProfile,
  InstitutionProfile,
  UserProfile,
  FarmerCompensation,
  PFAccount,
  AssistanceType,
  AssistanceRequestStatus,
  ExternalBlob,
} from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Farmer Profile Queries
export function useGetCallerFarmerProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<FarmerProfile | null>({
    queryKey: ['currentFarmerProfile'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      return actor.getFarmerProfile(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
  });
}

export function useRegisterFarmer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: FarmerProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerFarmer(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentFarmerProfile'] });
    },
  });
}

// Institution Profile Queries
export function useGetCallerInstitutionProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InstitutionProfile | null>({
    queryKey: ['currentInstitutionProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have getCallerInstitutionProfile, need to check if registered
      return null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useRegisterInstitution() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: InstitutionProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerInstitution(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentInstitutionProfile'] });
    },
  });
}

// Produce Listing Queries
export function useProduceListing(organicOnly: boolean) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['produceListings', organicOnly],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return organicOnly ? actor.browseOrganicProduce() : actor.browseProduce();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMyListings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['myListings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyListings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      crop: string;
      quantity: bigint;
      price: bigint;
      organic: boolean;
      listingImage?: ExternalBlob;
      videoTour?: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.listProduce(
        params.crop,
        params.quantity,
        params.price,
        params.organic,
        params.listingImage || null,
        params.videoTour || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produceListings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useDeleteProduceListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduceListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produceListings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

// Produce Request Queries
export function useRequestProduce() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { listingId: bigint; requestedQuantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestProduce(params.listingId, params.requestedQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

// Farmer Compensation Queries
export function useGetFarmerCompensation() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FarmerCompensation | null>({
    queryKey: ['farmerCompensation'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFarmerCompensation();
    },
    enabled: !!actor && !actorFetching,
  });
}

// PF Account Queries
export function useGetMyPFAccount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PFAccount | null>({
    queryKey: ['myPFAccount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyPFAccount();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Assistance Request Queries
export function useGetMyAssistanceRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['myAssistanceRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyAssistanceRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitAssistanceRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      assistanceType: AssistanceType;
      description: string;
      images: ExternalBlob[];
      video?: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAssistanceRequest(
        params.assistanceType,
        params.description,
        params.images,
        params.video || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAssistanceRequests'] });
    },
  });
}

// Chat Queries
export function useGetChatHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getChatHistory();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function useAddChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { message: string; messageType: { user: null } | { assistant: null } }) => {
      if (!actor) throw new Error('Actor not available');
      const messageType = 'user' in params.messageType ? { user: null } : { assistant: null };
      return actor.addChatMessage(params.message, messageType as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });
}

// Dashboard Metrics
export function useGetDashboardMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardMetrics();
    },
    enabled: !!actor && !actorFetching,
  });
}
