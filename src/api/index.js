import axios from 'axios';
// const API_URL = 'https://spanish-api-covid19.pedelriomarron.now.sh';

const fetchSummary = async () => {
    const { data } = await axios.get(`/api`);
    return {
        confirmed: data.confirmed,
        recovered: data.recovered,
        deaths: data.deaths,
        hospitalized: data.hospitalized,
        uci: data.uci
    };
};

const fetchRegions = async () => {
    const { data } = await axios.get(`/api/regions`);
    return {
        regions: data.regions
    };
};

const fetchRegion = async region => {
    const { data } = await axios.get(`/api/regions/${region}`);
    return {
        confirmed: data.confirmed,
        recovered: data.recovered,
        deaths: data.deaths,
        hospitalized: data.hospitalized,
        uci: data.uci
    };
};

export { fetchSummary, fetchRegions, fetchRegion };