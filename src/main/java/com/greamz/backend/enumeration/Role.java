package com.greamz.backend.enumeration;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    USER,
    ADMIN,
    MANAGER,
    EMPLOYEE;


    @Override
    public String getAuthority() {
        return name();
    }
}
