export const precalcData = (records: TableRecord[]) => {
    let resources: any = {}
    let users: any = {}

    records.forEach(record => {
        users = {...users, [record.name]: 0}
    })

    records.forEach(record => {
        resources = {...resources, [record.resource]: {...users}}
    })

    let result: {timestamp: number, resources: typeof resources}[] = []

    result.push({
        timestamp: records[0].timestamp,
        resources: resources
    })

    records.forEach((record: TableRecord, idx: number) => {
        if (!idx) return

        const { timestamp, name, resource, value } = record

        const prevResources = {...result[idx - 1].resources}

        prevResources[resource] = { ...prevResources[resource], [name]: value }
        result.push({timestamp: timestamp, resources: prevResources})
    })

    console.log("finished calc")

    return result
}   