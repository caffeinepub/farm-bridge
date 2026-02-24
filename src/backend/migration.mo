import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";

module {
  // Old version types
  type OldFarmLocation = {
    #rural;
    #urban;
  };

  type OldFarmingMethods = {
    #organic;
    #conventional;
    #mixed;
  };

  type OldFarmerProfile = {
    name : Text;
    location : OldFarmLocation;
    farmSize : Nat;
    methods : OldFarmingMethods;
    cropTypes : [Text];
  };

  type OldProduceListing = {
    farmer : Principal;
    crop : Text;
    quantity : Nat;
    price : Nat;
    organic : Bool;
  };

  type OldInstitutionType = {
    #temple;
    #school;
    #college;
    #court;
    #university;
    #governmentOffice;
  };

  type OldInstitutionProfile = {
    name : Text;
    instType : OldInstitutionType;
    interestedCrops : [Text];
  };

  type OldUserProfile = {
    name : Text;
    userType : { #farmer; #institution; #other };
  };

  type OldProduceRequest = {
    institution : Principal;
    listingId : Nat;
    requestedQuantity : Nat;
  };

  // New types for migration
  type FarmerProfile = {
    name : Text;
    location : OldFarmLocation;
    farmSize : Nat;
    methods : OldFarmingMethods;
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

  type ProduceRequest = {
    requestId : Nat;
    institution : Principal;
    listingId : Nat;
    requestedQuantity : Nat;
  };

  type OldActor = {
    farmers : Map.Map<Principal, OldFarmerProfile>;
    institutions : Map.Map<Principal, OldInstitutionProfile>;
    produceMarket : Map.Map<Nat, OldProduceListing>;
    produceRequests : Map.Map<Nat, OldProduceRequest>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextListingId : Nat;
    nextRequestId : Nat;
  };

  type NewActor = {
    farmers : Map.Map<Principal, FarmerProfile>;
    institutions : Map.Map<Principal, OldInstitutionProfile>;
    produceMarket : Map.Map<Nat, ProduceListing>;
    produceRequests : Map.Map<Nat, ProduceRequest>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextListingId : Nat;
    nextRequestId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newFarmers = old.farmers.map<Principal, OldFarmerProfile, FarmerProfile>(
      func(_p, oldFarm) {
        { oldFarm with profilePicture = null };
      }
    );

    let newProduceMarket = old.produceMarket.map<Nat, OldProduceListing, ProduceListing>(
      func(listingId, oldListing) {
        { oldListing with listingId; listingImage = null; videoTour = null };
      }
    );

    let newProduceRequests = old.produceRequests.map<Nat, OldProduceRequest, ProduceRequest>(
      func(requestId, oldReq) {
        { oldReq with requestId };
      }
    );

    {
      old with
      farmers = newFarmers;
      produceMarket = newProduceMarket;
      produceRequests = newProduceRequests;
    };
  };
};
