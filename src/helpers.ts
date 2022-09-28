export const precalcData = (records: TableRecord[]) => {
    let result = []
    let calcs = {}
    let resources = {}
    let users = {}

    records.forEach(record => {
        users = {...users, [record.name]: 0}
    })

    records.forEach(record => {
        resources = {...resources, [record.resource]: {...users}}
    })

    records.forEach(record => {
        const { timestamp, name, resource, value } = record
        //@ts-ignore
     

        calcs = {...calcs, [timestamp]: {...resources, [resource]: {
            //@ts-ignore
            ...resources[resource],
            //@ts-ignore
            [name]: resources[resource][name] + value,
        }}}
    })

    console.log(calcs)
}   