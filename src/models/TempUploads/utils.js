/**
 * Returns the string constant of the resource dir on s3
 * @param {'avatar' | 'farm' | 'legalDocument'} resourceType the resource type
 * @param {'exportLisence', 'tinLisence', 'arkenaAgreement', 'exportProcessorAgreement', 'icoCertificate', 'idCard', 'powerOfAttorney',} additionalResourceType additional resource type that is being uploaded used when uploading a legal document
 */
export const getResourceDirRoute = (resourceType, additionalResourceType) => {
  let uploadDir = 'miscs';
  if (typeof resourceType === 'string') {
    uploadDir = `${resourceType}`;
    if (additionalResourceType) {
      uploadDir = `${uploadDir}/${additionalResourceType}`;
    }
  }

  return uploadDir;
};

export const expUtils = {};
