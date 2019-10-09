import { whitelist, paths, WhitelistedSites } from './constants';
import { getBaseDomain } from '../../utils/getBaseDomain';
import { ApiEndpoint } from '../../types';

export interface TestData {
    example: string
}

const getData = (): TestData => {
    // Replace this code with getter/cookier
    return {
        example: 'test-data'
    };
};

export const endpoint: ApiEndpoint = async (origin) => {
    const baseDomain = getBaseDomain(origin) as WhitelistedSites;
    if (!whitelist.includes(baseDomain)) {
        return {
            path: paths.response,
            error: `${origin} isn't included in the whitelist. Please add it to gain access.`,
        }
    }

    const testData = getData();

    const response = {
        path: paths.response,
        data: testData,
    }
    return response;
}
