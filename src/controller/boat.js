import Boats from '../models/Boats';
import Favorites from '../models/Favorites';
import { categoriesEnum, subCategoriesEnum } from '../models/constants';
import { coordinateObjToGeoJson } from '../utils';
import { boatStatus, boatFeaturesEnum } from '../utils/constants';
import Users from '../models/Users';

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

    const hasPaymentMethod = await Users.hasPaymentMethod({ userId });

    const newBoat = new Boats({
      boatName,
      boatType,
      description,
      manufacturer,
      status: boatStatus.ACTIVE,
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
      searchable: hasPaymentMethod,
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
      status,
      address,
      city,
      state,
      captained,
      category,
      subCategory,
      coordinates,
      bbox,
    } = req.query || {};
    const filter = {};

    if (boatName) filter.boatName = boatName;
    if (status) {
      filter.status = status;
    } else {
      filter.status = boatStatus.ACTIVE;
    }
    if (address) filter.address = address;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (coordinates)
      filter.coordinates =
        typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
    if (bbox) filter.bbox = typeof bbox === 'string' ? JSON.parse(bbox) : bbox;

    filter.captained = captained;
    filter.searchable = true;

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
      captained,
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
      if (latLng?.type && latLng?.coordinates) updateObject.latLng = latLng;
      else if (latLng?.latitude && latLng?.longitude) {
        const parsedLocation = coordinateObjToGeoJson(latLng);
        updateObject.latLng = parsedLocation;
      }
    }

    if (category) updateObject.category = category;
    if (subCategory) updateObject.subCategory = subCategory;
    if (currency) updateObject.currency = currency;
    if (features) updateObject.features = features;
    if (pricing) updateObject.pricing = pricing;
    if (securityAllowance) updateObject.securityAllowance = securityAllowance;
    if (typeof captained === 'boolean') updateObject.captained = captained;

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

export const getFavoritesController = async (req, res, next) => {
  try {
    const user = req?.user?._id || '';
    const favorites = await Favorites.getFavorites(user);
    res.send(favorites);
  } catch (error) {
    next(error);
  }
};
