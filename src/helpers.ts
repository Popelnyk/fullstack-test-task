export const precalcData = (records: RawRecord[]): ProcessedRecord[] => {
  let resources: Resources = {};
  let users: Users = {};

  records.forEach((record) => {
    users = { ...users, [record.name]: 0 };
  });

  users = { ...users, total: 0 };

  records.forEach((record) => {
    resources = { ...resources, [record.resource]: { ...users } };
  });

  let result: ProcessedRecord[] = [];

  result.push({
    timestamp: records[0].timestamp,
    resources: resources,
  });

  records.forEach((record: RawRecord, idx: number) => {
    if (!idx) return;

    const { timestamp, name, resource, value } = record;

    const prevResources = { ...result[idx - 1].resources };

    prevResources[resource] = {
      ...prevResources[resource],
      [name]: prevResources[resource][name] + value,
    };
    result.push({ timestamp: timestamp, resources: prevResources });
  });

  console.log(result);

  return result;
};

export const normalizeResponse = (response: string) => {
  const result = response
    .split("\n")
    .map((record) =>
      record.length ? JSON.parse(record.replaceAll("'", '"')) : null
    );

  return result.filter((record) => record);
};
