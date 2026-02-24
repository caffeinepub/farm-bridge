import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PFAccount {
    yearlyStatements: Array<PFHistoryRecord>;
    totalBalance: bigint;
    farmer: Principal;
}
export interface SalaryRecord {
    compensation: bigint;
    month: bigint;
    salary: bigint;
    totalCompensation: bigint;
    year: bigint;
    paymentDate: Time;
    bonuses: bigint;
}
export type Time = bigint;
export interface ProduceListing {
    organic: boolean;
    listingId: bigint;
    crop: string;
    listingImage?: ExternalBlob;
    videoTour?: ExternalBlob;
    quantity: bigint;
    price: bigint;
    farmer: Principal;
}
export interface FarmerCompensation {
    active: boolean;
    totalCompensation: bigint;
    pfContribution: bigint;
    salaryHistory: Array<SalaryRecord>;
    insuranceCoverage: InsurancePlan;
    farmer: Principal;
    baseSalary: bigint;
}
export interface KnowledgeHubArticle {
    title: string;
    content: string;
    author: string;
    articleId: bigint;
    videos: Array<ExternalBlob>;
    images: Array<ExternalBlob>;
}
export interface InsurancePlan {
    coverageAmount: bigint;
    planType: Variant_premium_basic_comprehensive;
    monthlyPremium: bigint;
}
export interface AssistanceRequest {
    status: AssistanceRequestStatus;
    submittedTime: Time;
    requestId: bigint;
    videoExplanation?: ExternalBlob;
    supportingImages: Array<ExternalBlob>;
    description: string;
    farmer: Principal;
    assistanceType: AssistanceType;
}
export interface FarmerProfile {
    farmSize: bigint;
    methods: FarmingMethods;
    name: string;
    cropTypes: Array<string>;
    profilePicture?: ExternalBlob;
    location: FarmLocation;
}
export interface ChatMessage {
    user: Principal;
    messageType: Variant_user_assistant;
    message: string;
    timestamp: Time;
}
export interface PFHistoryRecord {
    month: bigint;
    balance: bigint;
    accruedInterest: bigint;
    year: bigint;
    withdrawal: bigint;
    contributionAmount: bigint;
}
export interface UserProfile {
    userType: Variant_other_institution_farmer;
    name: string;
}
export interface InstitutionProfile {
    name: string;
    instType: InstitutionType;
    interestedCrops: Array<string>;
}
export enum AssistanceRequestStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum AssistanceType {
    other = "other",
    technicalSupport = "technicalSupport",
    postHarvestManagement = "postHarvestManagement",
    equipmentLoan = "equipmentLoan"
}
export enum FarmLocation {
    urban = "urban",
    rural = "rural"
}
export enum FarmingMethods {
    mixed = "mixed",
    organic = "organic",
    conventional = "conventional"
}
export enum InstitutionType {
    school = "school",
    court = "court",
    university = "university",
    governmentOffice = "governmentOffice",
    temple = "temple",
    college = "college"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_other_institution_farmer {
    other = "other",
    institution = "institution",
    farmer = "farmer"
}
export enum Variant_premium_basic_comprehensive {
    premium = "premium",
    basic = "basic",
    comprehensive = "comprehensive"
}
export enum Variant_user_assistant {
    user = "user",
    assistant = "assistant"
}
export interface backendInterface {
    addChatMessage(message: string, messageType: Variant_user_assistant): Promise<void>;
    addKnowledgeHubArticle(title: string, content: string, author: string, images: Array<ExternalBlob>, videos: Array<ExternalBlob>): Promise<bigint>;
    addSalaryRecord(farmer: Principal, salaryRecord: SalaryRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    browseOrganicProduce(): Promise<Array<[bigint, ProduceListing]>>;
    browseProduce(): Promise<Array<[bigint, ProduceListing]>>;
    createOrUpdateCompensation(farmer: Principal, baseSalary: bigint, coverage: InsurancePlan, pfContribution: bigint): Promise<void>;
    deleteFarmer(farmer: Principal): Promise<void>;
    deleteInstitution(institution: Principal): Promise<void>;
    deleteProduceListing(listingId: bigint): Promise<void>;
    getAllKnowledgeHubArticles(): Promise<Array<[bigint, KnowledgeHubArticle]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getDashboardMetrics(): Promise<{
        totalOrganicListings: bigint;
        totalListings: bigint;
        urbanFarmers: bigint;
        totalInstitutions: bigint;
        totalRequests: bigint;
        totalFarmers: bigint;
        ruralFarmers: bigint;
    }>;
    getFarmerCompensation(): Promise<FarmerCompensation | null>;
    getFarmerProfile(farmer: Principal): Promise<FarmerProfile | null>;
    getMyAssistanceRequests(): Promise<Array<[bigint, AssistanceRequest]>>;
    getMyListings(): Promise<Array<[bigint, ProduceListing]>>;
    getMyPFAccount(): Promise<PFAccount | null>;
    getSpecificKnowledgeHubArticle(articleId: bigint): Promise<KnowledgeHubArticle | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listProduce(crop: string, quantity: bigint, price: bigint, organic: boolean, listingImage: ExternalBlob | null, videoTour: ExternalBlob | null): Promise<bigint>;
    registerFarmer(profile: FarmerProfile): Promise<void>;
    registerInstitution(profile: InstitutionProfile): Promise<void>;
    requestProduce(listingId: bigint, requestedQuantity: bigint): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAssistanceRequest(assistanceType: AssistanceType, description: string, images: Array<ExternalBlob>, video: ExternalBlob | null): Promise<bigint>;
    updateAssistanceRequestStatus(requestId: bigint, status: AssistanceRequestStatus): Promise<void>;
    updatePFAccount(farmer: Principal, records: Array<PFHistoryRecord>): Promise<void>;
    updateProduceListing(listingId: bigint, quantity: bigint, price: bigint): Promise<void>;
}
