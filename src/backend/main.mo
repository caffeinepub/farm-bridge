import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type FarmLocation = {
    #rural;
    #urban;
  };

  type FarmingMethods = {
    #organic;
    #conventional;
    #mixed;
  };

  type FarmerProfile = {
    name : Text;
    location : FarmLocation;
    farmSize : Nat;
    methods : FarmingMethods;
    cropTypes : [Text];
    profilePicture : ?Storage.ExternalBlob;
  };

  type ProduceListing = {
    listingId : Nat;
    farmer : Principal;
    crop : Text;
    quantity : Nat;
    price : Nat;
    organic : Bool;
    listingImage : ?Storage.ExternalBlob;
    videoTour : ?Storage.ExternalBlob;
  };

  type InstitutionType = {
    #temple;
    #school;
    #college;
    #court;
    #university;
    #governmentOffice;
  };

  type InstitutionProfile = {
    name : Text;
    instType : InstitutionType;
    interestedCrops : [Text];
  };

  type UserProfile = {
    name : Text;
    userType : { #farmer; #institution; #other };
  };

  type ProduceRequest = {
    requestId : Nat;
    institution : Principal;
    listingId : Nat;
    requestedQuantity : Nat;
  };

  type AssistanceType = {
    #technicalSupport;
    #postHarvestManagement;
    #equipmentLoan;
    #other;
  };

  type AssistanceRequestStatus = { #pending; #inProgress; #completed };
  type AssistanceRequest = {
    requestId : Nat;
    farmer : Principal;
    assistanceType : AssistanceType;
    description : Text;
    status : AssistanceRequestStatus;
    submittedTime : Time.Time;
    supportingImages : [Storage.ExternalBlob];
    videoExplanation : ?Storage.ExternalBlob;
  };

  type KnowledgeHubArticle = {
    articleId : Nat;
    title : Text;
    content : Text;
    author : Text;
    images : [Storage.ExternalBlob];
    videos : [Storage.ExternalBlob];
  };

  type SalaryRecord = {
    year : Nat;
    month : Nat;
    salary : Nat;
    bonuses : Nat;
    compensation : Nat;
    totalCompensation : Nat;
    paymentDate : Time.Time;
  };

  type InsurancePlan = {
    coverageAmount : Nat;
    monthlyPremium : Nat;
    planType : { #basic; #premium; #comprehensive };
  };

  type FarmerCompensation = {
    farmer : Principal;
    baseSalary : Nat;
    insuranceCoverage : InsurancePlan;
    pfContribution : Nat;
    totalCompensation : Nat;
    salaryHistory : [SalaryRecord];
    active : Bool;
  };

  type PFHistoryRecord = {
    year : Nat;
    month : Nat;
    contributionAmount : Nat;
    balance : Nat;
    withdrawal : Nat;
    accruedInterest : Nat;
  };

  type PFAccount = {
    farmer : Principal;
    totalBalance : Nat;
    yearlyStatements : [PFHistoryRecord];
  };

  type ChatMessage = {
    timestamp : Time.Time;
    user : Principal;
    message : Text;
    messageType : { #user; #assistant };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let farmers = Map.empty<Principal, FarmerProfile>();
  let institutions = Map.empty<Principal, InstitutionProfile>();
  let produceMarket = Map.empty<Nat, ProduceListing>();
  let produceRequests = Map.empty<Nat, ProduceRequest>();
  let assistanceRequests = Map.empty<Nat, AssistanceRequest>();
  let knowledgeHub = Map.empty<Nat, KnowledgeHubArticle>();
  let farmerCompensation = Map.empty<Principal, FarmerCompensation>();
  let pfAccounts = Map.empty<Principal, PFAccount>();
  let chatHistory = Map.empty<Principal, [ChatMessage]>();
  var nextListingId : Nat = 0;
  var nextRequestId : Nat = 0;
  var nextArticleId : Nat = 0;

  // PROFILE & REGISTRATION

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerFarmer(profile : FarmerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    farmers.add(caller, profile);
  };

  public query ({ caller }) func getFarmerProfile(farmer : Principal) : async ?FarmerProfile {
    if (caller != farmer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin access required");
    };
    farmers.get(farmer);
  };

  public shared ({ caller }) func registerInstitution(profile : InstitutionProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    institutions.add(caller, profile);
  };

  // MARKETPLACE

  public shared ({ caller }) func listProduce(crop : Text, quantity : Nat, price : Nat, organic : Bool, listingImage : ?Storage.ExternalBlob, videoTour : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (farmers.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only registered farmers can list produce") };
      case (_) {
        let listingId = nextListingId;
        let listing : ProduceListing = {
          listingId;
          farmer = caller;
          crop;
          quantity;
          price;
          organic;
          listingImage;
          videoTour;
        };
        produceMarket.add(listingId, listing);
        nextListingId += 1;
        listingId;
      };
    };
  };

  public shared ({ caller }) func updateProduceListing(listingId : Nat, quantity : Nat, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (produceMarket.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.farmer != caller) {
          Runtime.trap("Unauthorized: Only the listing owner can update it");
        };
        let updatedListing = {
          listing with quantity;
          price;
        };
        produceMarket.add(listingId, updatedListing);
      };
    };
  };

  public shared ({ caller }) func deleteProduceListing(listingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (produceMarket.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.farmer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the listing owner or admin can delete it");
        };
        produceMarket.remove(listingId);
      };
    };
  };

  public query ({ caller }) func browseProduce() : async [(Nat, ProduceListing)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse produce");
    };
    produceMarket.entries().toArray();
  };

  public query ({ caller }) func browseOrganicProduce() : async [(Nat, ProduceListing)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse produce");
    };
    produceMarket.entries().toArray().filter(func((_, listing)) { listing.organic });
  };

  public query ({ caller }) func getMyListings() : async [(Nat, ProduceListing)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access listings");
    };
    produceMarket.entries().toArray().filter(func((_, listing)) { listing.farmer == caller });
  };

  public shared ({ caller }) func requestProduce(listingId : Nat, requestedQuantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (institutions.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only registered institutions can request produce");
      };
      case (_) {
        switch (produceMarket.get(listingId)) {
          case (null) {
            Runtime.trap("Listing not found");
          };
          case (?listing) {
            if (requestedQuantity > listing.quantity) {
              Runtime.trap("Requested quantity exceeds available quantity");
            };
            let requestId = nextRequestId;
            let request : ProduceRequest = {
              requestId;
              institution = caller;
              listingId;
              requestedQuantity;
            };
            produceRequests.add(requestId, request);
            nextRequestId += 1;
            requestId;
          };
        };
      };
    };
  };

  // ASSISTANCE REQUESTS

  public shared ({ caller }) func submitAssistanceRequest(
    assistanceType : AssistanceType,
    description : Text,
    images : [Storage.ExternalBlob],
    video : ?Storage.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request assistance");
    };

    switch (farmers.get(caller)) {
      case (null) { Runtime.trap("Only registered farmers can submit assistance requests") };
      case (_) {
        let requestId = nextRequestId;
        let request : AssistanceRequest = {
          requestId;
          farmer = caller;
          assistanceType;
          description;
          status = #pending;
          submittedTime = Time.now();
          supportingImages = images;
          videoExplanation = video;
        };
        assistanceRequests.add(requestId, request);
        nextRequestId += 1;
        requestId;
      };
    };
  };

  public shared ({ caller }) func updateAssistanceRequestStatus(
    requestId : Nat,
    status : AssistanceRequestStatus,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update assistance request statuses");
    };

    switch (assistanceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request does not exist") };
      case (?request) {
        let updatedRequest = { request with status };
        assistanceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getMyAssistanceRequests() : async [(Nat, AssistanceRequest)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access requests");
    };
    let myRequests = assistanceRequests.entries().toArray().filter(
      func((_, request)) {
        request.farmer == caller
      }
    );
    myRequests;
  };

  // KNOWLEDGE HUB

  public shared ({ caller }) func addKnowledgeHubArticle(
    title : Text,
    content : Text,
    author : Text,
    images : [Storage.ExternalBlob],
    videos : [Storage.ExternalBlob],
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add knowledge hub articles");
    };

    let articleId = nextArticleId;
    let article : KnowledgeHubArticle = {
      articleId;
      title;
      content;
      author;
      images;
      videos;
    };
    knowledgeHub.add(articleId, article);
    nextArticleId += 1;
    articleId;
  };

  public query ({ caller }) func getAllKnowledgeHubArticles() : async [(Nat, KnowledgeHubArticle)] {
    // Public access - knowledge hub is available to everyone including guests
    knowledgeHub.entries().toArray();
  };

  public query ({ caller }) func getSpecificKnowledgeHubArticle(articleId : Nat) : async ?KnowledgeHubArticle {
    // Public access - knowledge hub is available to everyone including guests
    knowledgeHub.get(articleId);
  };

  // COMPENSATION, INSURANCE & PF

  public shared ({ caller }) func createOrUpdateCompensation(
    farmer : Principal,
    baseSalary : Nat,
    coverage : InsurancePlan,
    pfContribution : Nat,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can manage farmer compensation");
    };

    switch (farmerCompensation.get(farmer)) {
      case (null) {
        let newCompensation : FarmerCompensation = {
          farmer;
          baseSalary;
          insuranceCoverage = coverage;
          pfContribution;
          totalCompensation = baseSalary + pfContribution;
          salaryHistory = [];
          active = true;
        };
        farmerCompensation.add(farmer, newCompensation);
      };
      case (?existing) {
        let updated = { existing with baseSalary; insuranceCoverage = coverage; pfContribution };
        farmerCompensation.add(farmer, updated);
      };
    };
  };

  public shared ({ caller }) func addSalaryRecord(farmer : Principal, salaryRecord : SalaryRecord) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add salary records");
    };

    switch (farmerCompensation.get(farmer)) {
      case (null) { Runtime.trap("Farmer compensation record not found") };
      case (?existing) {
        let updatedHistory = (existing.salaryHistory).concat([salaryRecord]);
        let updated = { existing with salaryHistory = updatedHistory };
        farmerCompensation.add(farmer, updated);
      };
    };
  };

  public query ({ caller }) func getFarmerCompensation() : async ?FarmerCompensation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access compensation info");
    };
    farmerCompensation.get(caller);
  };

  // PF ACCOUNT MANAGEMENT

  public shared ({ caller }) func updatePFAccount(farmer : Principal, records : [PFHistoryRecord]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update PF account records");
    };

    let total = if (records.size() > 0) {
      let reversed = records.reverse();
      reversed[0].balance;
    } else { 0 };
    let newAccount : PFAccount = {
      farmer;
      totalBalance = total;
      yearlyStatements = records;
    };
    pfAccounts.add(farmer, newAccount);
  };

  public query ({ caller }) func getMyPFAccount() : async ?PFAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access PF account info");
    };
    pfAccounts.get(caller);
  };

  // CHAT ASSISTANCE SYSTEM

  public shared ({ caller }) func addChatMessage(message : Text, messageType : { #user; #assistant }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add chat messages");
    };

    let newMsg : ChatMessage = {
      timestamp = Time.now();
      user = caller;
      message;
      messageType;
    };
    let messages = switch (chatHistory.get(caller)) {
      case (null) { [newMsg] };
      case (?existing) { (existing).concat([newMsg]) };
    };
    chatHistory.add(caller, messages);
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat history");
    };
    switch (chatHistory.get(caller)) {
      case (null) { [] };
      case (?messages) { messages };
    };
  };

  // REPORTS & STATISTICS

  public query ({ caller }) func getDashboardMetrics() : async {
    totalFarmers : Nat;
    totalInstitutions : Nat;
    totalListings : Nat;
    totalOrganicListings : Nat;
    totalRequests : Nat;
    ruralFarmers : Nat;
    urbanFarmers : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access dashboard metrics");
    };

    let farmersArray = farmers.values().toArray();
    let listingsArray = produceMarket.values().toArray();

    let ruralCount = farmersArray.filter(
      func(f : FarmerProfile) : Bool { switch (f.location) { case (#rural) { true }; case (_) { false } } }
    ).size();

    let urbanCount = farmersArray.filter(
      func(f : FarmerProfile) : Bool { switch (f.location) { case (#urban) { true }; case (_) { false } } }
    ).size();

    let organicCount = listingsArray.filter(func(l : ProduceListing) : Bool { l.organic }).size();

    {
      totalFarmers = farmers.size();
      totalInstitutions = institutions.size();
      totalListings = produceMarket.size();
      totalOrganicListings = organicCount;
      totalRequests = produceRequests.size();
      ruralFarmers = ruralCount;
      urbanFarmers = urbanCount;
    };
  };

  // ADMIN FUNCTIONS

  public shared ({ caller }) func deleteFarmer(farmer : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete farmers");
    };
    farmers.remove(farmer);
  };

  public shared ({ caller }) func deleteInstitution(institution : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete institutions");
    };
    institutions.remove(institution);
  };
};
