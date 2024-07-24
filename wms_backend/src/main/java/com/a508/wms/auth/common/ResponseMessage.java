package com.a508.wms.auth.common;

public interface ResponseMessage {
    String SUCCESS = "Success.";
    String VALIDTION_FAIL = "Validation Failed.";
    String DUPLICATE = "Duplicate Id.";
    String SIGN_IN_FAIL = "Login information mismatch.";
    String CERTIFICATION_FAIL = "Certification Failed.";

    String DATABASE_ERROR = "Database Error.";
}
