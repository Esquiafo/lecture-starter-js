import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    #getId(id) {
        const idEndpoint = `details/fighter/${id}.json`;
        return `${this.#endpoint}/${idEndpoint}`;
    }

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            console.error(`Error in getFighters: ${error.message}`);
            throw error;
        }
    }

    async getFighterInfo(id) {
        try {
            const apiResult = await callApi(this.#getId(id));
            return apiResult;
        } catch (error) {
            console.error(`Error in getFighterInfo: ${error.message}`);
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            const apiResult = await callApi(this.#getId(id));
            return apiResult;
        } catch (error) {
            console.error(`Error in getFighterDetails: ${error.message}`);
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
