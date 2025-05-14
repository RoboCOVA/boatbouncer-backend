import Boats from '../models/Boats';
import Favorites from '../models/Favorites';
import { categoriesEnum, subCategoriesEnum } from '../models/constants';
import { coordinateObjToGeoJson } from '../utils';
import {
  boatStatus,
  boatFeaturesEnum,
  boatTypeEnum,
  boatActivityTypeEnum,
} from '../utils/constants';
import Users from '../models/Users';

export const createBoatController = async (req, res, next) => {
  try {
    const { latLng } = req.body;

    const userId = req?.user?._id || '';

    const parsedLocation = latLng ? coordinateObjToGeoJson(latLng) : undefined;

    const hasPaymentMethod = await Users.hasPaymentMethod({ userId });
    const newBoat = new Boats({
      ...req.body,
      latLng: parsedLocation,
      owner: userId,
      status: boatStatus.ACTIVE,
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
      listingType,
      boatTypes,
      activityTypes,
      coordinates,
      maxPassengers,
      bbox,
      features,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      radius = 50,
    } = req.query || {};

    const filter = {};

    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;
    if (minPrice) filter.minPrice = minPrice;
    if (maxPrice) filter.maxPrice = maxPrice;
    if (boatName) filter.boatName = boatName;
    if (radius) filter.radius = radius;
    if (status) {
      filter.status = status;
    } else {
      filter.status = boatStatus.ACTIVE;
    }
    if (address) filter.address = address;
    if (listingType) filter.listingType = listingType;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (!listingType || (listingType && listingType === 'rental')) {
      if (boatTypes) filter.boatTypes = JSON.parse(boatTypes);
      if (features) filter.features = JSON.parse(features);
    }

    if (!listingType || (listingType && listingType === 'activity')) {
      if (activityTypes) filter.activityTypes = JSON.parse(activityTypes);
    }
    if (maxPassengers) filter.maxPassengers = maxPassengers;
    if (coordinates)
      filter.coordinates =
        typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
    if (bbox) filter.bbox = typeof bbox === 'string' ? JSON.parse(bbox) : bbox;

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
      status,
      address,
      city,
      state,
      listingType,
      boatTypes,
      activityTypes,
      features,
    } = req.query;
    const filter = {};

    if (boatName) filter.boatName = boatName;
    if (address) filter.address = address;
    if (features) filter.features = features;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (status) filter.status = status;
    if (listingType) filter.listingType = listingType;

    if (!listingType || (listingType && listingType === 'rental')) {
      if (boatTypes) filter.boatTypes = JSON.parse(boatTypes);
      if (features) filter.features = JSON.parse(features);
    }
    if (!listingType || (listingType && listingType === 'activity')) {
      if (activityTypes) filter.activityTypes = JSON.parse(activityTypes);
    }

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
    const { latLng } = req.body;
    const user = req?.user;
    const { boatId } = req.params;
    const updateObject = req.body;
    if (latLng) {
      if (latLng?.type && latLng?.coordinates) updateObject.latLng = latLng;
      else if (latLng?.latitude && latLng?.longitude) {
        const parsedLocation = coordinateObjToGeoJson(latLng);
        updateObject.latLng = parsedLocation;
      }
    }
    const boatUpdate = await Boats.updateBoat(boatId, user?.id?.toString(), {
      ...updateObject,
    });
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
export const getBoatTypes = (req, res, next) => {
  try {
    res.send({ boatTypeEnum });
  } catch (error) {
    next(error);
  }
};

export const getBoatActivties = (req, res, next) => {
  try {
    res.send({ boatActivityTypeEnum });
  } catch (error) {
    next(error);
  }
};
export const getBoatFeatures = (req, res, next) => {
  try {
    res.send({ boatFeaturesEnum });
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
