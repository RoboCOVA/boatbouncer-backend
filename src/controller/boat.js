import Boats from '../models/Boats';
import Favorites from '../models/Favorites';
import { categoriesEnum, subCategoriesEnum } from '../models/constants';
import { coordinateObjToGeoJson } from '../utils';
import { boatFeaturesEnum } from '../utils/constants';

export const createBoatController = async (req, res, next) => {
  try {
    const {
      boatName,
      boatType,
      description,
      manufacturer,
      model,
      year,
      length,
      amenities,
      imageUrls,
      location,
      latLng,
      category,
      subCategory,
      currency,
      features,
      pricing,
      captained,
      securityAllowance,
    } = req.body;

    const userId = req?.user?._id || '';

    const parsedLocation = latLng ? coordinateObjToGeoJson(latLng) : undefined;

    const newBoat = new Boats({
      boatName,
      boatType,
      description,
      manufacturer,
      model,
      year,
      length,
      amenities,
      imageUrls,
      location,
      latLng: parsedLocation,
      category,
      subCategory,
      currency,
      features,
      pricing,
      securityAllowance,
      owner: userId,
      captained,
    });

    const boat = await newBoat.createBoat();
    res.send(boat);
  } catch (error) {
    next(error);
  }
};

export const getBoatsController = async (req, res, next) => {
  try {
    const {
      pageNo,
      size,
      boatName,
      address,
      city,
      state,
      captained,
      category,
      subCategory,
    } = req.query || {};
    const filter = {};

    if (boatName) filter.boatName = boatName;
    if (address) filter.address = address;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    filter.captained = captained;

    const boats = await Boats.getBoats({
      pageNo,
      size,
      filter,
    });
    res.send(boats);
  } catch (error) {
    next(error);
  }
};

export const getBoatListingController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      pageNo,
      size,
      boatName,
      address,
      city,
      state,
      captained,
      category,
      subCategory,
    } = req.query;
    const filter = {};

    if (boatName) filter.boatName = boatName;
    if (address) filter.address = address;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    filter.captained = captained;

    const boats = await Boats.getBoatListings({
      pageNo,
      size,
      userId,
      filter,
    });
    res.send(boats);
  } catch (error) {
    next(error);
  }
};

export const getBoatController = async (req, res, next) => {
  try {
    const { boatId } = req.params;
    const boats = await Boats.getBoat({ boatId });
    res.send(boats);
  } catch (error) {
    next(error);
  }
};

export const updateBoatController = async (req, res, next) => {
  try {
    const {
      boatName,
      boatType,
      description,
      manufacturer,
      model,
      year,
      length,
      amenities,
      imageUrls,
      owner,
      location,
      latLng,
      category,
      subCategory,
      currency,
      features,
      pricing,
      securityAllowance,
    } = req.body;
    const userId = req?.user?._id || '';
    const { boatId } = req.params;
    const updateObject = {};
    const matchQuery = { _id: boatId, owner: userId };

    if (boatName) updateObject.boatName = boatName;
    if (boatType) updateObject.boatType = boatType;
    if (description) updateObject.description = description;
    if (manufacturer) updateObject.manufacturer = manufacturer;
    if (model) updateObject.model = model;
    if (year) updateObject.year = year;
    if (length) updateObject.length = length;
    if (amenities) updateObject.amenities = amenities;
    if (imageUrls) updateObject.imageUrls = imageUrls;
    if (owner) updateObject.owner = owner;
    if (location) updateObject.location = location;
    if (latLng) {
      const parsedLocation = coordinateObjToGeoJson(latLng);
      updateObject.latLng = parsedLocation;
    }
    if (category) updateObject.category = category;
    if (subCategory) updateObject.subCategory = subCategory;
    if (currency) updateObject.currency = currency;
    if (features) updateObject.features = features;
    if (pricing) updateObject.pricing = pricing;
    if (securityAllowance) updateObject.securityAllowance = securityAllowance;

    const boatUpdate = await Boats.updateBoat(matchQuery, updateObject);
    res.send(boatUpdate);
  } catch (error) {
    next(error);
  }
};

export const deleteBoatController = async (req, res, next) => {
  try {
    const { boatId } = req.params;
    const userId = req?.user?._id || '';

    const boatRemoved = await Boats.deleteBoat({ boatId, userId });
    res.send(boatRemoved);
  } catch (error) {
    next(error);
  }
};

export const getBoatCategories = (req, res, next) => {
  try {
    res.send({ categoriesEnum, subCategoriesEnum, boatFeaturesEnum });
  } catch (error) {
    next(error);
  }
};

export const addOrRemoveFavoriteController = async (req, res, next) => {
  try {
    const { boatId: boat } = req.params;
    const user = req?.user?._id || '';
    const newFavorite = new Favorites({ boat, user });
    const favorite = await newFavorite.addOrRemoveFavorite();
    res.send(favorite);
  } catch (error) {
    next(error);
  }
};
