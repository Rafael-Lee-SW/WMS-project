// 사업체 회원가입 추가 필요

import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://i11a508.p.ssafy.io/api/',
});

// 모든 사업체 조회
function fetchBusinesses() {
    return instance.get('/businesses');
}

// 특정 사업체 조회
function fetchBusiness(id) {
    return instance.get(`/businesses/${id}`);
}

// 사업자 정보 수정
function editBusiness(id, data = {}) {
    return instance.put(`/businesses/${id}`, data);
}

// 사업체 삭제
function deleteBusiness(id) {
    return instance.patch(`/businesses/${id}`);
}

// 모든 직원 조회
function fetchEmployees() {
    return instance.get('/employees');
}

// 특정 사업체 직원 조회
function fetchBusinessEmployees(id) {
    return instance.get(`/employees?businessId=${id}`);
}

// 특정 직원 조회
function fetchEmployee(id) {
    return instance.get(`/employees/${id}`);
}

// 특정 직원 정보 수정
function editEmployee(id, data = {}) {
    return instance.put(`/employees/${id}`, data);
}

// 특정 직원 정보 삭제
function deleteEmployee(id) {
    return instance.patch(`/employees/${id}`);
}

// 창고 생성
function createWarehouses(data = {}) {
    return instance.post('/warehouses', data);
}

// 특정 사업체의 모든 창고 정보 조회
function fetchBusinessWarehouses(businessId) {
    return instance.get(`/warehouses/${businessId}`)
}

// 창고 수정
function editBusinessWarehouses(businessId, data = {}) {
    return instance.put(`/warehouses/${businessId}`, data)
}

// 창고 삭제
function deleteBusinessWarehouses(businessId) {
    return instance.patch(`/warehouses/${businessId}`)
}

// 구독 정보 전체 조회
function fetchSubscriptions() {
    return instance.get('/subscriptions')
}

// 특정 사업체 구독 조회
function fetchBusinessSubscriptions(businessId) {
    return instance.get(`/subscriptions?businessId=${businessId}`)
}

// 구독 등록
function createSubscription(data = {}) {
    return instance.post('/subscriptions', data)
}

// 구독 수정
function editSubscription(id, data = {}) {
    return instance.put(`/subscriptions/${id}`, data)
}

// 구독 삭제
function deleteSubscription(id) {
    return instance.patch(`/subscriptions/${id}`)
}

// 상품 전체 조회
function fetchProducts() {
    return instance.get('/products')
}

// 사업체의 상품 전체 조회
function fetchBusinessProducts(businessId) {
    return instance.get(`/products?businessId=${businessId}`)
}

// 창고의 상품 전체 조회
function fetchWarehouseProducts(warehouseId) {
    return instance.get(`/products?warehouseId=${warehouseId}`)
}

// 상품 정보에 따른 조회
function fetchDetailProducts(productDetailId) {
    return instance.get(`/products?productDetailId=${productDetailId}`)
}

// 특정 상품의 로케이션 조회
function fetchProductLocations(id) {
    return instance.get(`/products/${id}`)
}

// 상품 등록
function createProduct(data = {}) {
    return instance.post('/products', data)
}

// 상품 수정
function editProduct(id, data = {}) {
    return instance.put(`/products/${id}`, data)
}

// 상품 삭제
function deleteProduct(id) {
    return instance.patch(`/products/${id}`)
}

// 상품 입고
function importProducts(data = {}) {
    return instance.post('/products/import', data)
}

// 상품 출고
function exportProducts(data = {}) {
    return instance.post('/products/export', data)
}

// 전체 상품 정보 조회
function fetchProductsDetail() {
    return instance.get('/productDetail')
}

// 특정 상품 정보 조회
function fetchProductDetail(id) {
    return instance.get(`/productDetail/${id}`)
}

// 특정 사업자의 상품 정보 조회
function fetchBusinessProductsDetail(businessId) {
    return instance.get(`/product?businessId=${businessId}`)
}

// 상품 정보 등록
function createProductDetail(data = {}) {
    return instance.post('/productDetail', data)
}

// 상품 정보 삭제
function deleteProductDetail(id) {
    return instance.patch(`/productDetail/${id}`)
}

// 전체 로케이션 조회
function fetchLocations() {
    return instance.get('/locations')
}

// 특정 창고에 있는 로케이션 전체 조회
function fetchWarehouseLocations(warehouseId) {
    return instance.get(`/locations?=warehouseId=${warehouseId}`)
}

// 특정 로케이션 조회
function fetchLocation(locationId) {
    return instance.get(`/locations/${locationId}`)
}

// 로케이션 등록
function createLocation(data = {}) {
    return instance.post('/locations', data)
}

// 로케이션 수정
function editLocation(locationId, data = {}) {
    return instance.put(`/locations/${locationId}`, data)
}

// 로케이션 삭제
function deleteLocation(locationId) {
    return instance.patch(`/locations/${locationId}`)
}

// 특정 층 단일 조회
function fetchFloors(floorId) {
    return instance.get(`/floors/${floorId}`)
}

// 특정 로케이션에 있는 층 전부 조회
function fetchLocationFloors(locationId) {
    return instance.get(`/floors?locationId=${locationId}`)
}

// 특정 상품로케이션 조회
function fetchProductsLocation(id) {
    return instance.get(`/productlocations/${id}`)
}

// 특정 상품의 상품 로케이션 조회
function fetchProductLocation(productId) {
    return instance.get(`/productlocations?productid=${productId}`)
}

// 특정 층의 상품로케이션 조회
function fetchFloorLocation(floorId) {
    return instance.get(`/productlocation?floorid=${floorId}`)
}

// 특정 바코드의 상품 로케이션 조회
function fetchBarcodeLocation(barcode) {
    return instance.get(`productlocations?barcode=${barcode}`)
}

// 상품 이동
function moveProduct(data = {}) {
    return instance.patch('/productlocations', data)
}
 
export { 
    instance, 
    fetchBusinesses, 
    fetchBusiness, 
    editBusiness,
    deleteBusiness,
    fetchEmployees, 
    fetchBusinessEmployees,
    fetchEmployee,
    editEmployee,
    deleteEmployee,
    createWarehouses,
    editBusinessWarehouses,
    deleteBusinessWarehouses,
    fetchBusinessWarehouses,
    fetchSubscriptions,
    fetchBusinessSubscriptions,
    createSubscription,
    editSubscription,
    deleteSubscription,
    fetchProducts,
    fetchBusinessProducts,
    fetchWarehouseProducts,
    fetchDetailProducts,
    fetchProductLocations,
    createProduct,
    editProduct,
    deleteProduct,
    importProducts,
    exportProducts,
    fetchProductsDetail,
    fetchProductDetail,
    fetchBusinessProductsDetail,
    createProductDetail,
    deleteProductDetail,
    fetchLocations,
    fetchWarehouseLocations,
    fetchLocation,
    createLocation,
    editLocation,
    deleteLocation,
    fetchFloors,
    fetchLocationFloors,
    fetchProductsLocation,
    fetchProductLocation,
    fetchFloorLocation,
    fetchBarcodeLocation,
    moveProduct
}   