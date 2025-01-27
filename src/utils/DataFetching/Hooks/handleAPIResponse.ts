export const RequestedEntities = Object.freeze({
  events: 'events',
  trackedEntity: 'trackedEntity',
});

export const handleAPIResponse = (recourceName: string, apiResponse: any) => {
  if (!apiResponse) {
    return [];
  }
  return apiResponse[recourceName] || apiResponse.instances || [];
};
