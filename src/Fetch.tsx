
interface IRes {
    keyword: string
    stations: Station[]
}

interface Station {
    StationUID: string
    StationName: string
    Location: Location
    StationAddress: string
    Bearing: string
    Stops: Stop[]
    Routes: string[]
}

interface Location {
    Latitude: number
    Longitude: number
}

interface Stop {
    StopUID: string
    StopName: string
    Location: Location
}

class FetchProxy {
    baseUrl: string
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }
    static handleLogFetchError(err: any, reason?: string) {
        console.log(`error happen`)
        console.log(err)
    }
    fetch(apiUrl: string,
        fetchConfig: RequestInit = {},
        useBaseUrl: boolean = true
    ) {
        const finalUrl = useBaseUrl ? this.baseUrl + apiUrl : apiUrl
        return fetch(finalUrl, fetchConfig)
    }
}
const fetchProxy = new FetchProxy('https://buibui.5xcampus.com')
fetchProxy.fetch('/api/v1/bus_stations/search?keyword=衡陽', {
    headers: {
        'Content-Type': 'application/json',
        'Latitude': '24.982899',
        'Longitude': '121.541351',
        'Message': 'test'
    }
})
    .then(response => {
        if (!response.ok) {
            throw 'error happen by call /api/v1/bus_stations/search?keyword=衡陽'
        }
        return response.json()
    })
    .then((jsonData: IRes) => {
        console.log(jsonData)
        appendData(jsonData)
    })
    .catch(err => {
        FetchProxy.handleLogFetchError(err)
    })
const appendData = (data: IRes) => {
    const container = document.createDocumentFragment();
    data.stations.forEach((station: Station) => {
        const stationNameDiv = document.createElement("div");
        stationNameDiv.textContent = station.StationName
        container.appendChild(stationNameDiv)
    });
    const stationEl = document.getElementById('station')
    stationEl?.appendChild(container)
}
console.log('a')
export { }