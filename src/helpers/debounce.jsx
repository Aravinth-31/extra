import { useState } from "react"
import useConstant from "use-constant"
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';

// Generic reusable hook
const useDebouncedSearch = (searchFunction) => {

    // Handle the input text state
    const [searchText, setSearchText] = useState('');

    // Debounce the original search async function
    const debouncedSearchFunction = useConstant(() =>
        AwesomeDebouncePromise(searchFunction, 500)
    );

    // The async callback is run each time the text changes,
    // but as the search function is debounced, it does not
    // fire a new request on each keystroke
    const results = useAsync(
        async () => {
            return debouncedSearchFunction(searchText);
        },
        [debouncedSearchFunction, searchText]
    );

    // Return everything needed for the hook consumer
    return {
        searchText,
        setSearchText,
        results,
    };
};
export default useDebouncedSearch;