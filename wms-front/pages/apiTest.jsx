import { useEffect } from "react";

// 모든 사업체 조회

import { fetchBusinesses } from "./api";

function BusinessList() {
    useEffect(() => {
        const getBusinesses = async () => {
            try {
                const response = await fetchBusinesses();
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getBusinesses();
},[])};


export default BusinessList;

// ----------------------------------------------

// 특정 사업체 조회

// import { fetchBusiness } from "./api";

// function Business() {
//     useEffect(() => {
//         const getBusiness = async () => {
//             try {
//                 const response = await fetchBusiness(1);
//                 console.log(response.data)
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//         getBusiness();
// }, [])};

// export default Business;

// ----------------------------------------------

